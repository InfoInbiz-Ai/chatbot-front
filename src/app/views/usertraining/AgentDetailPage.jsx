import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TextareaAutosize } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import MakeApi from "../../../__api__/makeApi";
import { useSearchParams } from "react-router-dom";

const AgentDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [agentData, setAgentData] = useState(null);

  const [contextDialog, setContextDialog] = useState({
    open: false,
    data: { contextName: "", contextDescription: "" },
    index: null,
  });

  const fetchAgent = async () => {
    try {
      const data = await MakeApi.getAgentByKey(id);

      setAgentData({
        ...data,
        Model: {
          ...data.Model,
          companyName: data.Model.companyName || "",
          systemPrompt: data.Model.systemPrompt || "",
          contexts: data.Model.contexts || [],
        },
      });

    } catch (err) {
      Swal.fire("Error", "Failed to load agent details", "error");
    }
  };

  useEffect(() => {
    if (id) fetchAgent();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!agentData) return;

      const updatedData = {
        key: id,
        Agent: {
          agentName: agentData.Agent.agentName,
        },
        Model: {
          companyName: agentData.Model.companyName,
          systemPrompt: agentData.Model.systemPrompt,
          contexts: agentData.Model.contexts,
        },
        no: Number(agentData.no) || 0,
        enable : agentData.enable|| false,
      };

      await MakeApi.insertAgent(updatedData);
      Swal.fire("Success", "Agent updated successfully", "success");
      fetchAgent();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleContextEdit = (data = { contextName: "", contextDescription: "" }, index = null) => {
    setContextDialog({ open: true, data, index });
  };

  const handleContextDelete = (index) => {
    const newContexts = [...agentData.Model.contexts];
    newContexts.splice(index, 1);
    setAgentData({
      ...agentData,
      Model: {
        ...agentData.Model,
        contexts: newContexts,
      },
    });
  };

  const handleContextDialogSubmit = () => {
    if (!contextDialog.data.contextName.trim()) {
      Swal.fire("Error", "Context name is required", "warning");
      return;
    }

    const newContexts = [...agentData.Model.contexts];
    if (contextDialog.index !== null) {
      newContexts[contextDialog.index] = contextDialog.data;
    } else {
      newContexts.push(contextDialog.data);
    }

    setAgentData({
      ...agentData,
      Model: {
        ...agentData.Model,
        contexts: newContexts,
      },
    });

    setContextDialog({
      open: false,
      data: { contextName: "", contextDescription: "" },
      index: null,
    });
  };

  if (!agentData) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4">
        <TextField
          variant="standard"
          fullWidth
          label="Agent Name"
          value={agentData.Agent.agentName}
          onChange={(e) =>
            setAgentData({ ...agentData, Agent: { agentName: e.target.value } })
          }
        />
      </Typography>

      <Typography variant="h6" mt={2}>
        <TextField
          variant="standard"
          fullWidth
          label="Company Name"
          value={agentData.Model.companyName}
          onChange={(e) =>
            setAgentData({
              ...agentData,
              Model: { ...agentData.Model, companyName: e.target.value },
            })
          }
        />
      </Typography>

      <Typography variant="h6" mt={2}>
      <TextField
  variant="outlined"
  multiline
  rows={4}
  fullWidth
  label="System Prompt"
  value={agentData.Model.systemPrompt}
  onChange={(e) =>
    setAgentData({
      ...agentData,
      Model: { ...agentData.Model, systemPrompt: e.target.value },
    })
  }
  sx={{
    mt: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  }}
/>

      </Typography>

      <Typography variant="h6" mt={3}>
        Contexts
      </Typography>
      <Grid container spacing={1} mt={1}>
        {agentData.Model.contexts.length === 0 && (
          <Typography sx={{ ml: 2 }}>No contexts yet. Add one.</Typography>
        )}
{agentData.Model.contexts.map((ctx, index) => (
  <Grid item xs={12} key={index}>
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      p={2}
      sx={{
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <Typography flex={1}>{ctx.contextName}</Typography>
      <IconButton onClick={() => handleContextEdit(ctx, index)}>
        <EditIcon />
      </IconButton>
      <IconButton color="error" onClick={() => handleContextDelete(index)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  </Grid>
))}

      </Grid>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ mt: 2 }}
        onClick={() => handleContextEdit()}
      >
        Add Context
      </Button>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      <Dialog
        open={contextDialog.open}
        onClose={() =>
          setContextDialog({
            open: false,
            data: { contextName: "", contextDescription: "" },
            index: null,
          })
        }
      >
        <DialogTitle>
          {contextDialog.index !== null ? "Edit Context" : "Add Context"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Context Name"
            fullWidth
            value={contextDialog.data.contextName}
            onChange={(e) =>
              setContextDialog({
                ...contextDialog,
                data: { ...contextDialog.data, contextName: e.target.value },
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Context Description"
            multiline
            rows={6}
            fullWidth
            value={contextDialog.data.contextDescription}
            onChange={(e) =>
              setContextDialog({
                ...contextDialog,
                data: {
                  ...contextDialog.data,
                  contextDescription: e.target.value,
                },
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setContextDialog({
                open: false,
                data: { contextName: "", contextDescription: "" },
                index: null,
              })
            }
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleContextDialogSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentDetailPage;
