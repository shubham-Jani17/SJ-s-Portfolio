import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import PublicApp from "./PublicApp";
import AdminApp from "./admin/AdminApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route
          path="/*"
          element={
            <PortfolioProvider>
              <PublicApp />
            </PortfolioProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
