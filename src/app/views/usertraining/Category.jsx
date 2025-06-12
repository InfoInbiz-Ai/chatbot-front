import { useState, useEffect, useMemo, Fragment } from "react";
import { Box, Button, Grid, Pagination, TextField } from "@mui/material";
import RowCards from "../dashboard/shared/RowCards";
import CategoryApi from "../../../__api__/categoryApi";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

export default function Category() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // <-- added state
  const isAddingNewRow = projects.some((p) => p.isNew);

  const fetchCategories = async (filter = "") => {
    setLoading(true);
    try {
      const response = await CategoryApi.fetchCategories({ filter, pageSize: 5 });

      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories(searchTerm);
    setPage(1);
  }, [searchTerm]);

  const refetch = async () => {
    await fetchCategories(searchTerm);
  };

  const pageCount = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return projects.slice(start, start + ITEMS_PER_PAGE);
  }, [projects, page]);

  const handleAdd = () => {
    const newProject = {
      id: `temp-${Date.now()}`,
      name: "",
      isNew: true
    };
    setProjects((prev) => [newProject, ...prev]);
    setPage(1);
  };

  const handleUpdate = async (id, name) => {
    try {
      if (!id || id.toString().startsWith("temp")) {
        await CategoryApi.addCategory(name);
      } else {
        await CategoryApi.updateCategory(id, name);
      }

      setProjects((prev) => prev.filter((p) => !p.isNew));
      setPage(1);
      await refetch();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };
  const handleDelete = async (id) => {
    // Handle unsaved (temporary) items
    if (id.toString().startsWith("temp-")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    // Ask for confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(id);

        // Attempt deletion via API
        const response = await CategoryApi.deleteCategory(id);

        if (response === "success") {
          // Only remove from UI if deletion succeeded
          setProjects((prev) => prev.filter((p) => p.id !== id));
        }

        setPage(1);
      } catch (err) {
        // Show backend error message from err.message
        Swal.fire("Error", err.message || "Failed to delete category", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <Fragment>
      <Box sx={{ margin: "2rem", boxSizing: "border-box" }}>
        <Grid container spacing={3} sx={{ width: "100%" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: "1rem",
                marginBottom: "1rem",
                gap: "1rem"
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "gray",
                  paddingLeft: "1rem",
                  marginBottom: "1rem"
                }}
              >
                Training Data
              </h4>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!deletingId} // optional: disable search while deleting
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                disabled={isAddingNewRow || !!deletingId} // disable add while deleting
              >
                Add
              </Button>
            </Box>

            <RowCards
              projects={paginatedProjects}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              deletingId={deletingId} // pass deletingId to RowCards to handle UI state per row if needed
            />

            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                disabled={!!deletingId} // disable pagination while deleting
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
