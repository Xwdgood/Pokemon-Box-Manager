import { Routes, Route, Navigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoxPage from "./components/BoxPage.jsx";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        {/* Render the BoxPage when the path is /boxes/:boxNumber */}
        <Route path="/boxes/:boxNumber" element={<BoxPage />} />

        {/* Catch-all route: Redirect to /boxes/1 */}
        <Route path="*" element={<Navigate to="/boxes/1" replace />} />
      </Routes>
    </DndProvider>
  );
}
