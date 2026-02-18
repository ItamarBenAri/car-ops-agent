import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Garage } from "./pages/Garage";
import { Upload } from "./pages/Upload";
import { Timeline } from "./pages/Timeline";
import { Chat } from "./pages/Chat";
import { Observability } from "./pages/Observability";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "garage", Component: Garage },
      { path: "upload", Component: Upload },
      { path: "timeline", Component: Timeline },
      { path: "chat", Component: Chat },
      { path: "observability", Component: Observability },
      { path: "settings", Component: Settings },
    ],
  },
]);
