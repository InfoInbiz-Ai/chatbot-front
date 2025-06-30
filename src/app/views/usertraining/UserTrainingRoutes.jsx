import { lazy } from "react";
import Loadable from "app/components/Loadable";

// Lazy load your AppTable component
const AppTable = Loadable(lazy(() => import("./AppTable")));
const Agent = Loadable(lazy(() => import("./AgentPage")));
const Category = Loadable(lazy(() => import("./Category")));
const DocumentTable = Loadable(lazy(() => import("./DocumentTable")));
const AgentDetail = Loadable(lazy(() => import("./AgentDetailPage")));
const userTrainingRoutes = [
  {
    path: "/training/agent-detail",
    element: <AgentDetail />
  },
 
  {
    path: "/training/agent",
    element: <Agent />
  },
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
