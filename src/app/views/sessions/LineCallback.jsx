import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "app/contexts/FirebaseAuthContext";
import Swal from "sweetalert2";

const LineCallback = () => {
  const navigate = useNavigate();
  const { signInWithLine } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const uid = params.get("uid");

    if (token && uid) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("uid", uid);

      signInWithLine()
        .then(() => {
          navigate("/auth/line-company-selector"); // ✅ success — go to company selector page
        })
        .catch(() => {
          Swal.fire("Error", "Invalid user session. Please login again.", "error").then(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("uid");
            sessionStorage.removeItem("companyName");
            navigate("/session/signin");
          });
        });
    } else {
      navigate("/session/signin");
    }
  }, [navigate, signInWithLine]);

  return <div>Authenticating via Line...</div>;
};

export default LineCallback;
