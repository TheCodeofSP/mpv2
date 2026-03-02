import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import { ProfileProvider } from "./context/profile/ProfileContext.jsx";
import { ContentProvider } from "./content/ContentProvider.jsx";
import "./App.scss";

export default function App() {
  return (
    <ProfileProvider>
      <ContentProvider>
        <RouterProvider router={router} />
      </ContentProvider>
    </ProfileProvider>
  );
}
