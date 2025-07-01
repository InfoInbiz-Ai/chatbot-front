import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "app/contexts/FirebaseAuthContext";
import Swal from "sweetalert2";
import {
  Button,
  TextField,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Box,
  Typography
} from "@mui/material";

const CompanySelector = () => {
  const { signInWithLine } = useContext(AuthContext);
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const mockUsers = [
      { companyName: "Dekhowood", password: "1qaz!QAZ" },
      { companyName: "AIS", password: "AIS1qaz!QAZ" }
    ];

    const matchedUser = mockUsers.find((u) => u.companyName === company && u.password === password);

    if (matchedUser) {
      sessionStorage.setItem("companyName", matchedUser.companyName);
      signInWithLine()
        .then(() => {
          Swal.fire("Success", "Authenticated successfully", "success");
          navigate("/"); // ✅ go to main page after successful company select
        })
        .catch(() => {
          navigate("/session/signin");
        });
    } else {
      Swal.fire("Error", "Incorrect password for selected company", "error");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Select Company & Authenticate
      </Typography>

      <FormLabel component="legend">Choose Company</FormLabel>
      <RadioGroup value={company} onChange={(e) => setCompany(e.target.value)}>
        <FormControlLabel value="Dekhowood" control={<Radio />} label="Dekhowood" />
        <FormControlLabel value="AIS" control={<Radio />} label="AIS" />
      </RadioGroup>

      <TextField
        label="Password"
        type="password"
        fullWidth
        sx={{ my: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!company || !password}
      >
        Submit
      </Button>
    </Box>
  );
};

export default CompanySelector;
