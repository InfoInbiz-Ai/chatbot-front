import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Typography,
  Fab,
  Checkbox,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import RowCardsQA from "app/views/dashboard/shared/RowCardsQA";
export default function FormDialog({ open, onClose, onSubmit, columns = [], showQA = false }) {
  const [form, setForm] = useState({});
  const [qaList, setQaList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (open) {
      const initialForm = {};
      columns.forEach(col => {
        initialForm[col.field] = "";
      });
      setForm(initialForm);
      setQaList([]); // Reset QA data when form opens
      setSelectedIds([]);
    }
  }, [open, columns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQA = () => {
    setQaList(prev => [...prev, {
      id: Date.now(), // temporary unique id
      question: "",
      answer: "",
      isNew: true
    }]);
  };

  const handleUpdateQA = (id, values) => {
    setQaList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...values, isNew: false } : item))
    );
  };

  const handleDeleteQA = (id) => {
    setQaList(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(sel => sel !== id));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(qaList.map((qa) => qa.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSubmit = () => {

    onSubmit({ ...form, questions: qaList });
    onClose();
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Entry</DialogTitle>
      <DialogContent>
        {columns.map((col) => (
          <TextField
            key={col.field}
            margin="dense"
            name={col.field}
            label={col.label}
            type="text"
            fullWidth
            variant="standard"
            value={form[col.field] || ""}
            onChange={handleChange}
          />
        ))}

        {showQA && (
          <>
            <Box display="flex" justifyContent="center" alignItems="center" my={3}>
              <Typography variant="h6" mr={2}>Add Heading Questions and Answers</Typography>
              <Fab size="small" color="secondary" aria-label="Add" onClick={handleAddQA}>
                <Icon>add</Icon>
              </Fab>
            </Box>

            {qaList.length > 0 && (
              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Checkbox
                    checked={selectedIds.length === qaList.length}
                    onChange={handleSelectAll}
                  />
                  <Typography variant="body1">Select All for Delete</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ ml: 2 }}
                    disabled={selectedIds.length === 0}
                    onClick={() => {
                      setQaList(prev => prev.filter(item => !selectedIds.includes(item.id)));
                      setSelectedIds([]);
                    }}
                  >
                    Delete Selected
                  </Button>
                </Box>
                <RowCardsQA
                  data={qaList}
                  onUpdate={handleUpdateQA}
                  onDelete={handleDeleteQA}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
