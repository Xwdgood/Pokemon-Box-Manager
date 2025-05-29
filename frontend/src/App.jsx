import { Routes, Route, Navigate } from "react-router-dom";
import BoxPage from "./components/BoxPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Render the BoxPage when the path is /boxes/:boxNumber */}
      <Route path="/boxes/:boxNumber" element={<BoxPage />} />

      {/* Catch-all route: Redirect to /boxes/1 */}
      <Route path="*" element={<Navigate to="/boxes/1" replace />} />
    </Routes>
  );
}
