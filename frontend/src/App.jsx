import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      {/* TODO Render the BoxPage when the path is /boxes/:boxNumber */}

      {/* TODO Delete me!!!!! */}
      <Route path="/boxes/1" element={<p>Hello world</p>} />

      {/* Catch-all route: Redirect to /boxes/1 */}
      <Route path="*" element={<Navigate to="/boxes/1" replace />} />
    </Routes>
  );
}
