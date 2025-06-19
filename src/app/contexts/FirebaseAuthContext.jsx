import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import Loading from "app/components/MatxLoading";
import {

  signInWithPopup,
  GoogleAuthProvider,

} from "firebase/auth";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "app/config";
import { initializeApp } from "firebase/app";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext({
  user: null,
  isInitialized: false,
  isAuthenticated: false,
  method: "CUSTOM_BACKEND",
  signInWithGoogle:()=>{},
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

  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email, password) => {
    // Mock check
    if (email === "jason@ui-lib.com" && password === "dummyPass") {
      // Mock user data
      const user = {
        id: "mock-uid-12345",
        email: "jason@ui-lib.com",
        avatar: null,
        name: "Jason Mock",
        token: "mock-token-abcde12345",
      };
  
      localStorage.setItem("accessToken", user.token);
      dispatch({ type: "AUTH_STATE_CHANGED", payload: { isAuthenticated: true, user } });
  
      return user;
    }
  
    // For any other credentials, simulate login failure
    throw new Error("Invalid email or password");
  };
  
  // const signInWithEmail = async (email, password) => {
  //   const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  //   console.log('user',response)
  //   const userData = response.data;


    
  //   const user = {
  //     id: userData.uid,
  //     email: userData.email,
  //     avatar: userData.providerData?.[0]?.photoURL || null,
  //     name: userData.providerData?.[0]?.displayName || userData.email,
  //     token: userData.stsTokenManager.accessToken,
  //   };

  //   localStorage.setItem("accessToken", user.token);
  //   dispatch({ type: "AUTH_STATE_CHANGED", payload: { isAuthenticated: true, user } });

  //   return user;
  // };
  const signInWithLine = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");
  
    const user = {
      id: localStorage.getItem("uid"),
      name: "LINE User",
      token
    };
  
    dispatch({
      type: "AUTH_STATE_CHANGED",
      payload: {
        isAuthenticated: true,
        user
      }
    });
  
    return user;
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
        signInWithGoogle,
        logout,
        signInWithLine,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

