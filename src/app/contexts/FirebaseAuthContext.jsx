import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import Loading from "app/components/MatxLoading";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext({
  user: null,
  isInitialized: false,
  isAuthenticated: false,
  method: "CUSTOM_BACKEND",
  signInWithEmail: () => {},
  createUserWithEmail: () => {},
  logout: () => {},
  signInWithLine: () => {},
});

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmail = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    console.log('user',response)
    const userData = response.data;

    const user = {
      id: userData.uid,
      email: userData.email,
      avatar: userData.providerData?.[0]?.photoURL || null,
      name: userData.providerData?.[0]?.displayName || userData.email,
      token: userData.stsTokenManager.accessToken,
    };

    localStorage.setItem("accessToken", user.token);
    dispatch({ type: "AUTH_STATE_CHANGED", payload: { isAuthenticated: true, user } });

    return user;
  };
  const signInWithLine = async () => {
    try {
      // Check if we have a token in localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
  
      // Verify the token with your backend if needed
      const response = await axios.get(`${API_BASE_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const userData = response.data;
      const user = {
        id: userData.uid,
        email: userData.email,
        avatar: userData.providerData?.[0]?.photoURL || null,
        name: userData.providerData?.[0]?.displayName || 'LINE User',
        token: token,
      };
  
      dispatch({ 
        type: "AUTH_STATE_CHANGED", 
        payload: { 
          isAuthenticated: true, 
          user 
        } 
      });
  
      return user;
    } catch (error) {
      console.error('LINE login failed:', error);
      throw error;
    }
  };

  const createUserWithEmail = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/signup`, { email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    dispatch({ type: "AUTH_STATE_CHANGED", payload: { isAuthenticated: false, user: null } });
  };


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch({
        type: "AUTH_STATE_CHANGED",
        payload: {
          isAuthenticated: true,
          user: {
            id: "local-user",
            email: "user@example.com",
            name: "User",
            avatar: null,
            token,
          },
        },
      });
    } else {
      dispatch({ type: "AUTH_STATE_CHANGED", payload: { isAuthenticated: false, user: null } });
    }
  }, []);

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "CUSTOM_BACKEND",
        signInWithEmail,
        createUserWithEmail,
        logout,
        signInWithLine,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

