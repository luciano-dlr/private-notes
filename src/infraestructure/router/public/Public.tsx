import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FC } from "react";
import Board from "../../pages/board/Board";

export const PublicRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/private-notes" element={<Board />} />
        <Route path="*" element={<Navigate to={"/private-notes"} />} />
      </Routes>
    </BrowserRouter>
  );
};
