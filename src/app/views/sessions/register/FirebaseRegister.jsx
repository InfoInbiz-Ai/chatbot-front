import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";
import { firebaseConfig } from "app/config";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import useTheme from "@mui/material/styles/useTheme";
// GLOBAL CUSTOM COMPONENTS
import MatxDivider from "app/components/MatxDivider";
import { Paragraph } from "app/components/Typography";
// GLOBAL CUSTOM HOOKS
import useAuth from "app/hooks/useAuth";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  height: "100%",
  padding: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default
}));

const IMG = styled("img")({ width: "100%" });

const GoogleButton = styled(Button)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "#e0e0e0",
  boxShadow: theme.shadows[0],
  "&:hover": { backgroundColor: "#d5d5d5" }
}));

const RegisterRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": { maxWidth: 750, margin: 16, borderRadius: 12 }
});

// initial login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!")
});

function generateState() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
export default function FirebaseRegister() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { createUserWithEmail } = useAuth();

  const backEndUrl =firebaseConfig.backEndUrl;


  
const handleLineLogin = () => {
  const state = generateState();
  localStorage.setItem('line_oauth_state', state);
  
  // Add frontend callback URL to state so backend knows where to redirect back
  const frontendCallback = `${window.location.origin}/auth/line-callback`;
  window.location.href = `${backEndUrl}/line/auth?state=${state}&frontend_callback=${encodeURIComponent(frontendCallback)}`;
};

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      await createUserWithEmail(values.email, values.password);
      navigate("/");
      enqueueSnackbar("Register Successfully!", { variant: "success" });
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <RegisterRoot>
      <Card className="card">
        <Grid container>
          <Grid size={{ md: 6, xs: 12 }}>
            <ContentBox>
              <IMG src="/assets/images/illustrations/posting_photo.svg" alt="Photo" />
            </ContentBox>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }}>
            <Box px={4} pt={4}>
            <Button
    fullWidth
    variant="outlined"
    onClick={handleLineLogin}
    startIcon={
        <img 
            src="/assets/images/logos/line.svg" 
            alt="LINE" 
            width={24}
            height={24}
            style={{ display: 'block' }}
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE5LjA0IDQuNTZjLTEuNDItLjUxLTMuMS4zLTMuNiAxLjgxLS4xMi4zNy0uMzkuNjUtLjczLjc0LTEuMDMuMy0xLjg2LS44My0xLjU1LTEuODYuMi0uNy42OS0xLjI5IDEuMzUtMS41OCAyLjExLS45MyA0LjU0LjQ3IDUuMSAyLjUzLjYgMi4xNS0uOTMgNC4yNS0zLjA4IDQuODNoLS4wNmMuMDEuMDcuMDEuMTUuMDEuMjMuMDQgMS4zNC0uNzcgMi41My0yLjA3IDIuODktMS4zNC4zNy0yLjcyLS4yNS0zLjMtMS40Mi0uMi0uNC0uNi0uNjUtMS4wNC0uNjVoLS4wMWMtLjc3IDAtMS4zOC42Ni0xLjI2IDEuNDIuMjUgMS41NyAxLjY2IDIuNzYgMy4yOCAyLjc2aC4zOGMtMS42NyAxLjItMy4wOCAyLjUtNC4xMiAzLjQ4LS41OS41Ni0xLjUyLjU3LTIuMTEuMDMtLjU4LS41NC0uNTgtMS40My4wMS0xLjk5IDEuNTQtMS40NyAzLjYzLTMuNDYgNC40Mi00LjkyaC0zLjE0Yy0xLjY3IDAtMy4xOS0xLjAxLTMuNzItMi41Ni0uNTYtMS42MS4xNC0zLjMyIDEuNjEtNC4yIDEuMzQtLjggMy4wNS0uNjggNC4yOC4zLjE4LjE1LjQuMjQuNjMuMjQuMzggMCAuNzMtLjIxLjktLjU2LjU2LTEuMTMgMS45My0xLjY0IDMuMTYtMS4xIDEuMDMuNDUgMS42NiAxLjQ3IDEuNjYgMi41NiAwIC44My0uMzcgMS42LTEuMDEgMi4xMS0uNjQuNTEtMS40Ni43LTIuMjYuNTIuMi44My42OSAxLjU2IDEuNCAxLjk1LjczLjQgMS41OC40MiAyLjMyLjA2LjcyLS4zNSAxLjIzLS45OCAxLjQtMS43Ni4xOS0uODgtLjA3LTEuNzgtLjY5LTIuNDQgMS41Mi0uMzggMi43LTEuNzQgMi43LTMuMzQgMC0xLjUzLTEuMTEtMi44Ny0yLjY0LTMuMTR6IiBmaWxsPSIjMDBDMzAwIi8+PC9zdmc+"
            }}
        />
    }
    sx={{ 
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        border: '1px solid #e0e0e0',
        textTransform: 'none',
        fontSize: '16px',
        padding: '8px 24px',
        '&:hover': {
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
        },
        '& .MuiButton-startIcon': {
            marginRight: '12px',
            '& img': {
                width: '24px',
                height: '24px',
                // Ensures color is #00C300 even if SVG has inline color
                filter: 'brightness(0) saturate(100%) invert(48%) sepia(96%) saturate(1265%) hue-rotate(72deg) brightness(99%) contrast(105%)'
            }
        }
    }}
>
    Continue with LINE
</Button>
            </Box>

            <MatxDivider sx={{ mt: 3, px: 4 }} text="Or" />

            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        I have read and agree to the terms of service.
                      </Paragraph>
                    </Box>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}>
                      Register
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}>
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </RegisterRoot>
  );
}
