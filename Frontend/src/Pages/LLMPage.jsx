import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  OutlinedInput,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import aiLoadingAnimation from "../assets/ai-loader.json";
import Swal from "sweetalert2";

const LLMPage = () => {
  const location = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(
    location.state?.files || []
  );
  const [prompt, setPrompt] = useState(location.state?.prefillPrompt);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [responseId, setResponseId] = useState(null);

  const sendFeedback = async (feedback) => {
    await axios.post("https://cyber-sierra-ai.onrender.com/api/feedback", {
      id: responseId,
      feedback,
    });
    Swal.fire({
      icon: "success",
      title: "Thank you!",
      text: "We value your feedback",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    fetchUploadedFiles();
    if (location.state?.prefillPrompt) {
      setPrompt(location.state.prefillPrompt);
    }
  }, [location.state]);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get("https://cyber-sierra-ai.onrender.com/api/files");
      setUploadedFiles(res.data.files);
    } catch (err) {
      console.error("Error fetching file list:", err);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !prompt) {
      alert("Please select at least one file and enter a prompt.");
      return;
    }

    setLoading(true);
    setResponse(null);
    setResponseId(null);

    try {
      const res = await axios.post("https://cyber-sierra-ai.onrender.com/api/query", {
        filenames: selectedFiles,
        prompt: prompt,
      });

      console.log(res.data.response);
      setShowCode(true);
      setResponse(res.data.response || "No response received.");
      setResponseId(res.data.id);
    } catch (err) {
      console.error("Query error:", err);
      setResponse("Error occurred while querying.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={3} maxWidth="100%">
      <Typography variant="h4">Ask Questions (LLM)</Typography>
      <Typography variant="body1">
        Use AI to ask natural language questions about your uploaded data.
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="multi-file-label">Select File(s)</InputLabel>
        <Select
          labelId="multi-file-label"
          multiple
          value={selectedFiles}
          onChange={(e) => setSelectedFiles(e.target.value)}
          input={<OutlinedInput label="Select File(s)" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {uploadedFiles.map((file, idx) => (
            <MenuItem key={idx} value={file}>
              {file}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Enter your question or prompt"
        multiline
        minRows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={loading}
        sx={{ alignSelf: "flex-start" }}
      >
        Submit Query
      </Button>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Lottie
            animationData={aiLoadingAnimation}
            loop={true}
            style={{ width: 300 }}
          />
        </Box>
      )}

      {response && (
        <Paper elevation={2} sx={{ padding: 2, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h6">Response:</Typography>

          <Box mt={1}>
            {typeof response === "object" ? (
              typeof response.value === "object" ? (
                Array.isArray(response.value) ? (
                  <RenderArrayTable data={response.value} />
                ) : (
                  <RenderDictTable data={response.value} />
                )
              ) : (
                <>
                  {response.value ===
                  "Unfortunately, I was not able to get your answer. Please try again." ? (
                    <Typography sx={{ whiteSpace: "pre-wrap", color: "black" }}>
                      Please enhance your prompt to make the instructions
                      clearer for the LLM. Consider specifying the need for
                      conversion of datatypes of the columns. Take a look at the
                      SQL Query for more understanding.
                    </Typography>
                  ) : response.value &&
                    typeof response.value === "string" &&
                    response.value.includes("exports/charts/") ? (
                    <Box mt={2} sx={{ textAlign: "center" }}>
                      {/* Add timestamp or random query param to avoid cached image */}
                      <img
                        src={`https://cyber-sierra-ai.onrender.com/${
                          response.value
                        }?t=${new Date().getTime()}`}
                        alt="Chart"
                        style={{ width: "100%", maxWidth: "600px" }}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {response.value}
                    </Typography>
                  )}
                </>
              )
            ) : (
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {response}
              </Typography>
            )}
          </Box>

          {typeof response === "object" && response.last_code_executed && (
            <Box mt={2}>
              <Button
                variant="text"
                onClick={() => setShowCode((prev) => !prev)}
                size="small"
              >
                {showCode ? "Hide Code Executed" : "Show Code Executed"}
              </Button>

              {showCode && (
                <Box
                  mt={1}
                  sx={{
                    backgroundColor: "#272822",
                    color: "#f8f8f2",
                    padding: 2,
                    borderRadius: 1,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflowX: "auto",
                  }}
                >
                  {response.last_code_executed}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}

      {response && responseId && (
        <Box mt={2}>
          <Typography variant="subtitle2">Was this response useful?</Typography>
          <Box display="flex" gap={1} mt={1}>
            <Button
              size="small"
              variant="contained"
              onClick={() => sendFeedback("useful")}
            >
              👍 Yes
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => sendFeedback("not_useful")}
            >
              👎 No
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LLMPage;

const RenderDictTable = ({ data }) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return <Typography>No data available.</Typography>;
  }

  const columns = Object.keys(data);

  if (!columns.length || !data[columns[0]]) {
    return <Typography>Invalid table data.</Typography>;
  }

  const numRows = Object.keys(data[columns[0]]).length;

  const rows = Array.from({ length: numRows }, (_, rowIndex) => {
    const row = {};
    columns.forEach((col) => {
      row[col] = data[col]?.[rowIndex.toString()] ?? "N/A";
    });
    return row;
  });

  return <RenderArrayTable data={rows} />;
};

const RenderArrayTable = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <Typography>No table data available.</Typography>;
  }

  const columns = Object.keys(data[0]);

  return (
    <Box mt={2} sx={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: "8px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ridx) => (
            <tr key={ridx}>
              {columns.map((col, cidx) => (
                <td
                  key={cidx}
                  style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                >
                  {row[col] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};
