import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Manager from "./pages/Manager";
import TeamLead from "./pages/TeamLead";
import Developer from "./pages/Developer";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            {user.role === "manager" && <Route path="/manager" element={<Manager />} />}
            {user.role === "teamlead" && <Route path="/teamlead" element={<TeamLead />} />}
            {user.role === "developer" && <Route path="/developer" element={<Developer />} />}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
