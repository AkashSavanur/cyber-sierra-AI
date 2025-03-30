import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./helper/SupabaseClient";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import UploadPage from "./Pages/UploadPage";
import HistoryPage from "./Pages/HistoryPage";
import LLMPage from "./Pages/LLMPage";
import { Box } from "@mui/material";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";

function ProtectedRoute({ element }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
      >
        <Navbar />
        <Box component="main" flexGrow={1}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<ProtectedRoute element={<HomePage />}/>} />
            <Route path="/upload" element={<ProtectedRoute element={<UploadPage />}/>} />
            <Route path="/history" element={<ProtectedRoute element={<HistoryPage />} />} />
            <Route path="/llm" element={<ProtectedRoute element={<LLMPage />} />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
