import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import { ProfileProvider } from "./context/profile/ProfileContext.jsx";
import { ContentProvider } from "./content/ContentProvider.jsx";
import { initAnalytics } from "./lib/analytics.js";
import "./App.scss";

export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ProfileProvider>
      <ContentProvider>
        <RouterProvider router={router} />
      </ContentProvider>
    </ProfileProvider>
  );
}