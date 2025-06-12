import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "app/contexts/FirebaseAuthContext";

const LineCallback = () => {
  const navigate = useNavigate();
  const { signInWithLine } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const uid = params.get("uid");

    if (accessToken && uid) {
      // Save tokens somewhere - localStorage or in signInWithLine internally
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("uid", uid);

      // Call the context signInWithLine function
      signInWithLine()
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          navigate("/session/signin");
        });
    } else {
      navigate("/session/signin");
    }
  }, [signInWithLine, navigate]);

  return <div>Logging you in via Line...</div>;
};

export default LineCallback;
