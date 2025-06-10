// src/pages/qna/AppTable.jsx

import { useState, useEffect } from "react";
import { Box, styled, Button, Typography } from "@mui/material";
import PaginationTable from "../material-kit/tables/PaginationTable";
import { Breadcrumb, SimpleCard } from "app/components";
import FormDialog from "../material-kit/dialog/FormDialog";
import QnAApi from "../../../__api__/qnaApi";

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


export default function AppTable() {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const columns = [
    { field: "userQuestion", label: "User Questions" },
    { field: "botResponse", label: "Bot Response" },
    { field: "includeWords", label: "Include Words" },
    { field: "startWith", label: "Start With" },
  ];
  const fetchData = async () => {
    try {
      const items = await QnAApi.fetchAll();
      setData(items);
    } catch (err) {
      console.error("Failed to fetch Q&A:", err);
    }
  };

  const handleAdd = async (item) => {
    try {
      await QnAApi.add(item);
      fetchData();
    } catch (err) {
      console.error("Failed to add Q&A:", err);
    }
  };

  const handleUpdate = async (id, updatedItem) => {
    try {
      await QnAApi.update(id, updatedItem);
      fetchData();
    } catch (err) {
      console.error("Failed to update Q&A:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await QnAApi.delete(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete Q&A:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Q&A", path: "/qna" }]} />
      </div>

      <SimpleCard>
        <CardHeaderFlex>
          <Typography variant="h5" component="div">
            Bot Questions & Answers
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
            Add Q&A
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
/>
      </SimpleCard>
    </Container>
  );
}
