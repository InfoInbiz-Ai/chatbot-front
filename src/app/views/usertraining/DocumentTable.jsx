
import { useState, useEffect } from "react";
import { Box, styled, Button, Typography } from "@mui/material";
import PaginationTable from "../material-kit/tables/PaginationTable";
import { Breadcrumb, SimpleCard } from "app/components";
import FormDialog from "../material-kit/dialog/FormDialog";;
import DocumentApi  from "../../../__api__/documentApi";
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

  const columns = [
    { field: "name", label: "Document Name" },
    { field: "knowledgeTypes", label: "Type" },
  ];

  const fetchData = async () => {
    try {
      if (!kbId) return;
      const items = await DocumentApi.fetchDocuments({ kbId });
      console.log('items',items)
      setData(items);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  const handleAdd = async (item) => {
    try {

      await DocumentApi.addDocument({ ...item, kbId });
    
      fetchData();
    } catch (err) {
      console.error("Failed to add document:", err);
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
        setData(prevData => prevData.filter(item => item.id !== id));
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
          <Typography variant="h5"  component="div">Documents</Typography>
          <Button variant="contained" color="primary"  onClick={() => setOpenDialog(true)}>
            Add Document
          </Button>
        </CardHeaderFlex>

        <PaginationTable
  data={data}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  columns={columns}
/>

<FormDialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  onSubmit={handleAdd}
  columns={columns}
  showQA={true}
/>

      </SimpleCard>
    </Container>
  );
};

export default DocumentTable;
