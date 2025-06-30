import { Fragment, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  Grid,
  Fab,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarOutline from "@mui/icons-material/StarOutline";
import DateRange from "@mui/icons-material/DateRange";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/material/styles";

const ProjectName = styled("span")(({ theme }) => ({
  marginLeft: 16,
  fontWeight: "500",
  [theme.breakpoints.down("sm")]: { marginLeft: 8 },
}));

const StyledFabStar = styled(Fab)(({ theme }) => ({
  boxShadow: "none",
  backgroundColor: "rgba(9, 182, 109, 1) !important",
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

export default function RowCards({ projects, onUpdate, onDelete, onToggleEnable }) {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleSave = async (project) => {
    if (!inputValue.trim()) return;

    if (project.isNew) {
      await onUpdate(null, inputValue);
    } else {
      await onUpdate(project.id, inputValue);
    }

    setEditId(null);
    setInputValue("");
  };

  return projects.map((project) => (
    <Fragment key={project.id}>
      <Card sx={{ py: 1, px: 2, mb: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          
          {/* LEFT SIDE: Enable Checkbox */}
          <Grid item xs="auto">
            {!project.isNew && (
              <Checkbox
                checked={project.enable === true}
                onChange={() => onToggleEnable(project.id)}
                inputProps={{ "aria-label": "enable agent" }}
              />
            )}
          </Grid>

          {/* CENTER: Icon + Name */}
          <Grid item xs>
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

          {/* RIGHT SIDE: Actions */}
          <Grid item xs="auto">
            <Box display="flex" gap={1}>
              <Fab
                color="default"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/training/agent-detail?id=${project.id}`);
                }}
              >
                <VisibilityIcon />
              </Fab>

              {!project.isNew && (
                <Fab
                  color="primary"
                  size="small"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(project);
                  }}
                >
                  <SaveIcon />
                </Fab>
              )}

              <Fab
                size="small"
                sx={{ bgcolor: "error.main", color: "white" }}
                onClick={(e) => {
                  e.stopPropagation();
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
