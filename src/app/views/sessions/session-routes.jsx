import { lazy } from "react";

const NotFound = lazy(() => import("./NotFound"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));

const FirebaseLogin = lazy(() => import("./login/FirebaseLogin"));
const FirebaseRegister = lazy(() => import("./register/FirebaseRegister"));
const LineCallback = lazy(() => import("./LineCallback"));
// const JwtLogin = Loadable(lazy(() => import("./login/JwtLogin")));
// const JwtRegister = Loadable(lazy(() => import("./register/JwtRegister")));
// const Auth0Login = Loadable(lazy(() => import("./login/Auth0Login")));
import CompanySelector from "./CompanySelector";
const sessionRoutes = [
  {
    path: "/auth/line-callback",
    element: <LineCallback />
  },
  {
    path: "/auth/line-company-selector",
    element: <CompanySelector />
  },
  { path: "/session/signup", element: <FirebaseRegister /> },
  { path: "/session/signin", element: <FirebaseLogin /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "*", element: <NotFound /> }
];

export default sessionRoutes;
