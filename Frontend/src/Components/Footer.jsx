import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 4,
        py: 2,
        px: 3,
        backgroundColor: "#00002a",
        textAlign: "center",
        boxShadow: "0 -2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="body2" color="white">
        © {new Date().getFullYear()} CyberSierraAI — Developed by Akash Savanur
      </Typography>
    </Box>
  );
};

export default Footer;
