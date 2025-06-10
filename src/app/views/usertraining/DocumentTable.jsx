/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Box, styled, Button, Typography } from "@mui/material";
import PaginationTable from "../material-kit/tables/PaginationTable";
import { Breadcrumb, SimpleCard } from "app/components";
import FormDialog from "../material-kit/dialog/FormDialog";
import DocumentApi from "../../../__api__/documentApi";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

const CardHeaderFlex = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16
});

const DocumentTable = () => {
  const [searchParams] = useSearchParams();
  const kbId = searchParams.get("id"); // 👈 Extract from query string
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
  const [selectedRowData, setSelectedRowData] = useState(null);
  const columns = [
    { field: "displayName", label: "Document Name" },
    { field: "knowledgeTypes", label: "Type" }
  ];

  const columnsDialog = [{ field: "displayName", label: "Document Name" }];
  const fetchData = async () => {
    try {
      if (!kbId) return;
      const items = await DocumentApi.fetchDocuments({ kbId });
      console.log("items", items);
      setData(items);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };
  const handleEdit = async (rowData) => {
    try {
      setDialogMode("edit");

      // Fetch additional KB data by id
      const kbData = await DocumentApi.getSingleKB(kbId, rowData.id); // ✅ kbId from param, documentId from row
      // 👈 change this if `rowData.id` isn't the KB ID
      console.log("Fetched KB Data:", kbData);

      // Optionally merge or replace selected row data with fetched KB data
      setSelectedRowData({ ...rowData, ...kbData });

      setOpenDialog(true);
    } catch (err) {
      console.error("Failed to fetch KB for edit:", err);
      Swal.fire("Error", "Failed to fetch document details.", "error");
    }
  };

  const handleUpdate = async (item) => {
    try {
      await DocumentApi.updateDocument(kbId, item.id, item);
      fetchData();
    } catch (err) {
      console.error("Failed to update document:", err);
    }
  };

  const handleSubmitDialog = async (formData) => {
    try {
      await DocumentApi.addDocument({ ...formData, kbId });
      Swal.fire("Created!", "Document has been added.", "success");

      setOpenDialog(false);
      fetchData(); // refresh
      // oxlint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire("Error!", "Operation failed.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the document.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await DocumentApi.deleteDocument(kbId, id);
        setData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Document has been deleted.", "success");
      } catch (err) {
        console.error("Failed to delete document:", err);
        Swal.fire("Error", "Failed to delete document.", "error");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [kbId]);

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Documents", path: "/documents" }]} />
      </div>

      <SimpleCard>
        <CardHeaderFlex>
          <Typography variant="h5" component="div">
            Documents
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenDialog(true);
              setDialogMode("add");
            }}
          >
            Add Document
          </Button>
        </CardHeaderFlex>

        <FormDialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedRowData(null); // 👈 CLEAR SELECTED DATA
          }}
          onSubmit={handleSubmitDialog}
          columns={columnsDialog}
          initialData={selectedRowData}
          showQA={true}
          dialogMode={dialogMode}
        />

        <PaginationTable
          data={data}
          columns={columns}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </SimpleCard>
    </Container>
  );
};

export default DocumentTable;
