import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://cyber-sierra-ai.onrender.com/api/history");
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleReuse = (item) => {
    navigate("/llm", {
      state: {
        files: item.filenames || [],
        prefillPrompt: item.prompt,
      },
    });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Prompt History
      </Typography>
      <Typography variant="body1" mb={3}>
        See all your previous questions and responses.
      </Typography>

      {history.length === 0 ? (
        <Typography>No prompts submitted yet.</Typography>
      ) : (
        history.map((item) => (
          <Paper key={item.id} sx={{ p: 2, mb: 2, backgroundColor: "#fafafa" }}>
            <Typography variant="subtitle2" gutterBottom>
              Prompt: <strong>{item.prompt}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Timestamp: {new Date(item.timestamp).toLocaleString() + (" UTC")}
            </Typography>

            {item.filenames && item.filenames.length > 0 && (
              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {item.filenames.map((file, idx) => (
                  <Chip key={idx} label={file} size="small" />
                ))}
              </Box>
            )}

            {item.feedback && (
              <Typography mt={1} variant="body2">
                Feedback: {item.feedback === "useful" ? "👍 Useful" : "👎 Not useful"}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Button
              size="small"
              variant="outlined"
              onClick={() => handleReuse(item)}
            >
              Reuse Prompt
            </Button>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default HistoryPage;
