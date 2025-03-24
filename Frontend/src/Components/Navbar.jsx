import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Navbar = () => {
  const navigate = useNavigate();



  return (
      <AppBar position="sticky" color="default" elevation={3}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            CyberSierraAI
          </Typography>
    
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/upload")}>
              Upload Files
            </Button>
            <Button variant="outlined" onClick={() => navigate("/llm")}>
              LLM
            </Button>
            <Button variant="outlined" onClick={() => navigate("/history")}>
              History
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
