import { useEffect, useState, useContext } from "react";
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
  Typography,
} from "@mui/material";

const LineCallback = () => {
  const navigate = useNavigate();
  const { signInWithLine } = useContext(AuthContext);

  const [accessToken, setAccessToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const uid = params.get("uid");

    if (token && uid) {
      // Save tokens to localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("uid", uid);

      // Keep tokens in state for showing the form
      setAccessToken(token);
      setUid(uid);
    } else {
      // If no tokens, go back to login
      navigate("/session/signin");
    }
  }, [navigate]);

  const handleSubmit = () => {
    // Mock user data
    const mockUsers = [
      { companyName: "Dekhowood", password: "1qaz!QAZ" },
      { companyName: "AIS", password: "AIS1qaz!QAZ" },
    ];

    const matchedUser = mockUsers.find(
      (u) => u.password === password
    );

    if (matchedUser) {
      sessionStorage.setItem("companyName", matchedUser.companyName);
      window.location.reload();
      // Now proceed to signInWithLine and go to main page
      signInWithLine()
        .then(() => {
          Swal.fire("Success", "Authenticated successfully", "success");
          navigate("/");
        })
        .catch(() => {
          navigate("/session/signin");
        });
    } else {
      Swal.fire("Error", "Incorrect password for selected company", "error");
    }
  };

  // While waiting for tokens
  if (!accessToken || !uid) {
    return <div>Authenticating via Line...</div>;
  }

  // Show company selection form
  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Select Company & Authenticate
      </Typography>

      <FormLabel component="legend">Choose Company</FormLabel>
      <RadioGroup
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      >
        <FormControlLabel
          value="Dekhowood"
          control={<Radio />}
          label="Dekhowood"
        />
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

export default LineCallback;
