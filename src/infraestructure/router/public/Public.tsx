import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FC } from "react";
import PrivateNotesPage from "../../pages/privateNotes/PrivateNotesPage";

export const PublicRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/private-notes" element={<PrivateNotesPage />} />
        <Route path="/*" element={<Navigate to={"/private-notes"} />} />
      </Routes>
    </BrowserRouter>
  );
};
