import { Fragment } from "react";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Checkbox,
  Fab
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const Label = styled("div")({
  fontWeight: "bold",
  marginBottom: 4,
});

export default function RowCardsQA({ data, onUpdate, onDelete, selectedIds = [], setSelectedIds }) {
  const toggleSelect = (id) => {
    if (!setSelectedIds) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return data.map((item) => (
    <Fragment key={item.id}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={1}>
            <Checkbox
              checked={selectedIds.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Label>Question</Label>
            <TextField
              fullWidth
              variant="standard"
              value={item.question}
              onChange={(e) =>
                onUpdate(item.id, { ...item, question: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Label>Answer</Label>
            <TextField
              fullWidth
              variant="standard"
              value={item.answer}
              onChange={(e) =>
                onUpdate(item.id, { ...item, answer: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-end">
              <Fab
                size="small"
                aria-label="Delete"
                sx={{ bgcolor: "error.main", color: "white" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
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
