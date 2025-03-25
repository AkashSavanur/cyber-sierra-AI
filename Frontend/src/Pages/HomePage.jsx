import React from "react";
import { Typography, Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: "#fff",
        color: "#000", 
        flexGrow: 1,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to CyberSierraAI
      </Typography>

      <Typography variant="h6" gutterBottom>
        Your AI-powered workspace for intelligent data interaction
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" sx={{ mb: 2 }}>
        CyberSierraAI empowers users to:
      </Typography>

      <List>
        <ListItem button component={Link} to="/upload">
          <ListItemText
            primary="Upload CSV or Excel files"
            secondary="Upload one or more datasets (e.g., the Titanic dataset) and explore them with AI assistance."
          />
        </ListItem>

        <ListItem button component={Link} to="/upload">
          <ListItemText
            primary="View Top N Rows"
            secondary="Select a file or sheet, specify the number of rows (N), and instantly preview the dataset contents."
          />
        </ListItem>

        <ListItem button component={Link} to="/llm">
          <ListItemText
            primary="Ask Questions via AI"
            secondary="Leverage large language models (LLMs) to ask questions about your data in natural language and get intelligent responses."
          />
        </ListItem>

        <ListItem button component={Link} to="/history">
          <ListItemText
            primary="Prompt History"
            secondary="Easily revisit and reuse previous prompts and queries to save time and streamline analysis."
          />
        </ListItem>

        <ListItem button component={Link} to="/llm">
          <ListItemText
            primary="Feedback System"
            secondary="Rate AI-generated answers to improve accuracy and personalize your experience."
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'gray', }}>
        Start by uploading your files using the "Upload Files" button in the navbar, then explore your data like never before!
      </Typography>
    </Box>
    
  );
};

export default HomePage;
