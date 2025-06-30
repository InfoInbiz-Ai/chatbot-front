import { useState, useEffect, useMemo, Fragment } from "react";
import { Box, Button, Grid, Pagination, CircularProgress } from "@mui/material";
import RowCards from "../dashboard/shared/RowCards";
import MakeApi from "../../../__api__/makeApi";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

export default function AgentPage() {
  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [maxNo, setMaxNo] = useState(0);
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await MakeApi.getAllAgents();
  
      const transformed = response
        .filter((item) => item.key && item.data)
        .map((item) => ({
          id: item.key,
          name: item.data?.Agent?.agentName || "Untitled Agent",
          no: item.data?.no || 0,
          enable: item.data?.enable || false
        }));
  
      setAgents(transformed);
  
      // Find highest 'no' value
      const highestNo = transformed.length
        ? Math.max(...transformed.map((a) => a.no || 0))
        : 0;
      setMaxNo(highestNo);
  
    } catch (err) {
      console.error("Failed to fetch agents", err);
      Swal.fire("Error", "Failed to load agents", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const pageCount = Math.ceil(agents.length / ITEMS_PER_PAGE);
  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return agents.slice(start, start + ITEMS_PER_PAGE);
  }, [agents, page]);
  const handleToggleEnable = async (id) => {
    try {
      const currentAgent = agents.find(a => a.id === id);
      if (!currentAgent) return;
  
      const isCurrentlyEnabled = currentAgent.enable;
  
      if (isCurrentlyEnabled) {
        // Trying to disable the currently enabled agent
        // Check if this is the only enabled agent
        const enabledCount = agents.filter(a => a.enable).length;
        if (enabledCount <= 1) {
          Swal.fire("Error", "At least one agent must be enabled", "error");
          return;
        }
  
        // Disable this agent only
        const updatedAgents = agents.map(a =>
          a.id === id ? { ...a, enable: false } : a
        );
        setAgents(updatedAgents);
  
        // Update only this agent
        const oldData = await MakeApi.getAgentByKey(id);
        const newData = {
          key: id,
          Agent: { agentName: oldData.Agent?.agentName || "" },
          Model: oldData.Model || { companyName: "", systemPrompt: "", contexts: [] },
          no: Number(oldData.no) || 0,
          enable: false
        };
        await MakeApi.insertAgent(newData);
        fetchAgents();
        return;
      }
  
      // Enabling the agent - disable others
      const updatedAgents = agents.map(a =>
        a.id === id ? { ...a, enable: true } : { ...a, enable: false }
      );
  
      setAgents(updatedAgents);
  
      // Update all changed agents (disable all except the one being enabled)
      const updatePromises = updatedAgents.map(async (agent) => {
        const oldData = await MakeApi.getAgentByKey(agent.id);
        // Only update if enable state changed
        if (oldData.enable !== agent.enable) {
          const newData = {
            key: agent.id,
            Agent: { agentName: oldData.Agent?.agentName || "" },
            Model: oldData.Model || { companyName: "", systemPrompt: "", contexts: [] },
            no: Number(oldData.no) || 0,
            enable: agent.enable
          };
          return MakeApi.insertAgent(newData);
        }
        return Promise.resolve();
      });
  
      await Promise.all(updatePromises);
      fetchAgents();
  
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update agent enable status", "error");
    }
  };
  

  const handleAdd = () => {
    const hasEnabled = agents.some((a) => a.enable);
    const enableNew = agents.length === 0 ? true : (hasEnabled ? false : true);
  
    const newAgent = {
      id: `temp-${Date.now()}`,
      name: "",
      isNew: true,
      enable: enableNew,
    };
    setAgents((prev) => [newAgent, ...prev]);
    setPage(1);
  };
  
  const handleUpdate = async (id, name) => {
    try {
      if (!id || id.toString().startsWith("temp")) {
        // Insert new agent
        await MakeApi.insertAgent({
          Agent: { agentName: name },
          Model: {
            companyName: "",
            systemPrompt: "",
            contexts: []
          },
          no: maxNo + 1,
          enable : false
        });
      } else {
        // Fetch old data (without key in response)
        const oldData = await MakeApi.getAgentByKey(id);
  
        const newData = {
          key: id,  // key ต้องแปะเอง
          Agent: {
            agentName: name
          },
          Model: {
            companyName: oldData.Model?.companyName || "",
            systemPrompt: oldData.Model?.systemPrompt || "",
            contexts: oldData.Model?.contexts || []
          },
          no: Number(oldData.no) || 0,
          enable : oldData.enable|| false,
        };
  
        await MakeApi.insertAgent(newData);
      }
  
      setAgents((prev) => prev.filter((a) => !a.isNew));
      fetchAgents();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };
  
  

  const handleDelete = async (id) => {
    if (id.toString().startsWith("temp-")) {
      setAgents((prev) => prev.filter((a) => a.id !== id));
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This agent will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await MakeApi.deleteAgent(id);
        setAgents((prev) => prev.filter((a) => a.id !== id));
        setPage(1);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete agent", "error");
      }
    }
  };

  return (
    <Fragment>
      <Box sx={{ margin: "2rem" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem"
              }}
            >
              <h4 style={{ fontSize: "1.2rem" }}>Agents</h4>
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Add Agent
              </Button>
            </Box>

            {loading ? (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
) : agents.length === 0 ? (
  <Box textAlign="center" mt={4} fontSize="1.1rem" color="text.secondary">
    No agents found. Please add one.
  </Box>
) : (
  <>
    <RowCards
      projects={paginatedAgents}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onToggleEnable={handleToggleEnable}
    />

    <Box mt={2} display="flex" justifyContent="center">
      <Pagination
        count={pageCount}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
      />
    </Box>
  </>
)}

          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
