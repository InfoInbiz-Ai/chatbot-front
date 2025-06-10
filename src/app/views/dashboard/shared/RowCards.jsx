import { Fragment, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  Grid,
  Fab,
  Avatar,
  IconButton,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarOutline from "@mui/icons-material/StarOutline";
import DateRange from "@mui/icons-material/DateRange";
import { styled } from "@mui/material/styles";
import format from "date-fns/format";
import SaveIcon from '@mui/icons-material/Save'; 

const ProjectName = styled("span")(({ theme }) => ({
  marginLeft: 24,
  fontWeight: "500",
  [theme.breakpoints.down("sm")]: { marginLeft: 4 },
}));

const StyledFabStar = styled(Fab)(({ theme }) => ({
  boxShadow: "none",
  backgroundColor: "rgba(9, 182, 109, 1) !important",
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: "32px",
  height: "32px",
}));


export default function RowCards({ projects, onUpdate, onDelete }) {
    const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleSave = async (project) => {
    if (!inputValue.trim()) return;

    if (project.isNew) {
      await onUpdate(null, inputValue); // adding new
    } else {
      await onUpdate(project.id, inputValue);
    }

    setEditId(null);
    setInputValue("");
  };

  return projects.map((project) => (
    <Fragment key={project.id}>
      <Card sx={{ py: 1, px: 2, mb: 2 }}    onClick={() => navigate(`/training/document-table?id=${project.id}`)}>
      <Grid container alignItems="center" justifyContent="space-between">
  {/* LEFT SIDE - Project Icon + Name */}
  <Grid item xs={12} sm={10}>
    <Box display="flex" alignItems="center">
      {project.id % 2 === 1 ? (
        <StyledFabStar size="small">
          <StarOutline />
        </StyledFabStar>
      ) : (
        <StyledFabStar size="small">
          <DateRange />
        </StyledFabStar>
      )}

      {(editId === project.id || project.isNew) ? (
        <TextField
          fullWidth
          value={inputValue}
          variant="standard"
          autoFocus
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            if (!project.isNew) handleSave(project);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave(project);
          }}
          sx={{ ml: 2 }}
        />
      ) : (
        <ProjectName>{project.name || "Untitled"}</ProjectName>
      )}
    </Box>
  </Grid>

  {/* RIGHT SIDE - Buttons */}
  <Grid item xs={12} sm={2}>
    <Box display="flex" justifyContent="flex-end" gap={1}>
      {!project.isNew && (
        <Fab
          color="primary"
          size="small"
          aria-label="Edit"
          onClick={(e) => {
            e.stopPropagation();
            setEditId(project.id);
            setInputValue(project.name);
          }}
        >
          <EditIcon />
        </Fab>
      )}

      {project.isNew && (
        <Fab
          color="primary"
          size="small"
          aria-label="Save"
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            handleSave(project);
          }}
        >
          <SaveIcon />
        </Fab>
      )}

      <Fab
        size="small"
        aria-label="Delete"
        sx={{ bgcolor: "error.main", color: "white" }}
        onClick={(e) => {
          e.stopPropagation(); // prevent card click
          onDelete(project.id);
        }}
      >
        <DeleteIcon />
      </Fab>
    </Box>
  </Grid>
</Grid>

      </Card>
    </Fragment>
  ));
}

