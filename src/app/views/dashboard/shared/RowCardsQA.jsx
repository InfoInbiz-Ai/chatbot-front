import { Fragment } from "react";
import { Box, Card, Grid, TextField, Typography, Checkbox, Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Label = styled("div")({
  fontWeight: "bold",
  marginBottom: 4
});
export default function RowCardsQA({
  data,
  onUpdate,
  onDelete,
  onAdd,
  selectedIds = [],
  setSelectedIds,
  isEditMode = false
}) {
  const toggleSelect = (id) => {
    if (!setSelectedIds) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <>
      {data.map((item) => (
        <Fragment key={item.id}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {!isEditMode && (
                <Grid item xs={12} sm={1}>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={isEditMode ? 6 : 4}>
                <Label>Question</Label>
                <TextField
                  fullWidth
                  variant="standard"
                  value={item.question}
                  onChange={
                    !isEditMode
                      ? (e) => onUpdate(item.id, { ...item, question: e.target.value })
                      : undefined
                  }
                  InputProps={{
                    readOnly: isEditMode
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={isEditMode ? 6 : 4}>
                <Label>Answer</Label>
                <TextField
                  fullWidth
                  variant="standard"
                  value={item.answer}
                  onChange={
                    !isEditMode
                      ? (e) => onUpdate(item.id, { ...item, answer: e.target.value })
                      : undefined
                  }
                  InputProps={{
                    readOnly: isEditMode
                  }}
                />
              </Grid>
              {!isEditMode && (
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
              )}
            </Grid>
          </Card>
        </Fragment>
      ))}

      {/* Add Button */}
      {!isEditMode && onAdd && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Fab color="primary" aria-label="Add" onClick={onAdd}>
            <AddIcon />
          </Fab>
        </Box>
      )}
    </>
  );
}
