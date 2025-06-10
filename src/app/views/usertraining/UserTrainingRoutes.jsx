import { lazy } from "react";
import Loadable from "app/components/Loadable";

// Lazy load your AppTable component
const AppTable = Loadable(lazy(() => import("./AppTable")));

const Category = Loadable(lazy(() => import("./Category")));
const DocumentTable = Loadable(lazy(() => import("./DocumentTable")));
const userTrainingRoutes = [
  {
    path: "/training/projects",
    element: <AppTable />
  },
  {
    path: "/training/training-category",
    element: <Category />
  },
  {
    path: "/training/document-table",
    element: <DocumentTable />
  }
];

export default userTrainingRoutes;
