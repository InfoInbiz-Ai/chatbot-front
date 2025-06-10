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
  Checkbox
} from "@mui/material";
import Icon from "@mui/material/Icon";
import RowCardsQA from "app/views/dashboard/shared/RowCardsQA";
export default function FormDialog({
  open,
  onClose,
  onSubmit,
  columns = [],
  showQA = false,
  initialData = null,
  dialogMode = "add"
}) {
  const [form, setForm] = useState({});
  const [qaList, setQaList] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const isReadOnlyQA =
    qaList.length > 0 && qaList.every((item) => !item.isNew && typeof item.id === "string");
  const isEditMode = dialogMode === "edit";
  useEffect(() => {
    if (open) {
      const initialForm = {};
      columns.forEach((col) => {
        initialForm[col.field] = initialData?.[col.field] || "";
      });
      setForm(initialForm);

      if (initialData) {
        const qaItems = [];
        Object.keys(initialData).forEach((key) => {
          if (!isNaN(key)) {
            qaItems.push({ id: key, ...initialData[key] });
          }
        });
        setQaList(qaItems);
      } else {
        setQaList([]); // Clear QA list if no initial data
      }

      setSelectedIds([]);
    } else {
      // Clear QA list when dialog closes
      setQaList([]);
      setSelectedIds([]);
      setForm({});
    }
  }, [open, columns, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQA = () => {
    setQaList((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary unique id
        question: "",
        answer: "",
        isNew: true
      }
    ]);
  };

  const handleUpdateQA = (id, values) => {
    setQaList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...values, isNew: false } : item))
    );
  };

  const handleDeleteQA = (id) => {
    setQaList((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((sel) => sel !== id));
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
      <DialogTitle>{isEditMode ? "Edit Entry" : "Add New Entry"}</DialogTitle>
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
            onChange={
              isEditMode
                ? undefined
                : (e) => {
                    const { name, value } = e.target;
                    setForm((prev) => ({ ...prev, [name]: value }));
                  }
            }
            InputProps={{
              readOnly: isEditMode
            }}
          />
        ))}

        {showQA && (
          <>
            <Box display="flex" justifyContent="center" alignItems="center" my={3}>
              <Typography variant="h6" mr={2}>
                {isEditMode ? "Questions and Answers" : "Add Questions and Answers"}
              </Typography>
              {!isEditMode && (
                <Fab size="small" color="secondary" aria-label="Add" onClick={handleAddQA}>
                  <Icon>add</Icon>
                </Fab>
              )}
            </Box>

            {qaList.length > 0 && (
              <Box mb={2}>
                {!isEditMode && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Checkbox
                      checked={selectedIds.length === qaList.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(qaList.map((qa) => qa.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                    <Typography variant="body1">Select All for Delete</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ ml: 2 }}
                      disabled={selectedIds.length === 0}
                      onClick={() => {
                        setQaList((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
                        setSelectedIds([]);
                      }}
                    >
                      Delete Selected
                    </Button>
                  </Box>
                )}

                <RowCardsQA
                  data={qaList}
                  onUpdate={handleUpdateQA}
                  onDelete={handleDeleteQA}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  isEditMode={isEditMode} // Pass edit mode
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
        {!isEditMode && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSubmit({ ...form, questions: qaList });
              onClose();
            }}
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
