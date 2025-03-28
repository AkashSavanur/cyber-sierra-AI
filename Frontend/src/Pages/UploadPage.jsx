import React, { useRef, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [numRows, setNumRows] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get("https://cyber-sierra-ai.onrender.com/api/files");
      setUploadedFiles(response.data.files);
    } catch (err) {
      console.error("Error fetching file list:", err);
    }
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;

    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post(
        "https://cyber-sierra-ai.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Confirm response from server
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: "Your file(s) have been uploaded!",
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchUploadedFiles(); // Refresh file list after upload
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Error uploading files:", err);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while uploading your file(s).",
      });
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      const response = await axios.delete(
        `https://cyber-sierra-ai.onrender.com/api/files/${filename}`
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "File Deleted",
          text: `The file ${filename} has been deleted.`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh file list after deletion
        fetchUploadedFiles();
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: `Something went wrong while deleting ${filename}.`,
      });
    }
  };

  const handlePreview = async () => {
    if (!selectedFile || !numRows || isNaN(numRows) || parseInt(numRows) < 1 || !Number.isInteger(Number(numRows))) {
      Swal.fire({
        icon: "error",
        title: "Unsuccessful",
        text: "Please ensure that you have selected a file and enter a valid positive integer for the number of rows",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
  
    setLoading(true);
    setPreviewData(null);
  
    try {
      const response = await axios.get("https://cyber-sierra-ai.onrender.com/api/preview", {
        params: {
          filename: selectedFile,
          n: numRows,
        },
      });
      setPreviewData(response.data.preview);
    } catch (err) {
      console.error("Error fetching preview:", err);
      setPreviewData("Error loading data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={3}>
      <Typography variant="h4">Upload Files</Typography>
      <Typography variant="body1">
        Upload one or more CSV or Excel files to start exploring with AI.
      </Typography>

      <div
        style={{ display: "flex", justifyContent: "left", marginTop: "16px" }}
      >
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current.click()}
          sx={{ maxWidth: "300px", mr: "16px" }}
        >
          Upload CSV/XLS Files
        </Button>
        {selectedFile && (
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() =>
              navigate("/llm", { state: { files: [selectedFile] } })
            }
            sx={{ maxWidth: "300px" }}
          >
            Query LLM
          </Button>
        )}
      </div>

      <input
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {uploadedFiles.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Uploaded Files</Typography>
          <Box>
            {uploadedFiles.map((file, idx) => (
              <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                <Typography variant="body2">{file}</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteFile(file)}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <FormControl fullWidth>
          <InputLabel id="file-select-label">Select File</InputLabel>
          <Select
            labelId="file-select-label"
            value={selectedFile}
            label="Select File"
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            {uploadedFiles.map((file, idx) => (
              <MenuItem key={idx} value={file}>
                {file}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedFile && (
        <TextField
          label="Number of rows to display (N)"
          type="number"
          value={numRows}
          onChange={(e) => setNumRows(e.target.value)}
          fullWidth
        />
      )}

      {selectedFile && numRows && (
        <Button variant="outlined" onClick={handlePreview}>
          Preview Top {numRows} Rows
        </Button>
      )}

      {loading && <CircularProgress />}

      {previewData && Array.isArray(previewData) && (
        <Paper elevation={2} sx={{ padding: 2, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h6" gutterBottom>
            Top {numRows} Rows of {selectedFile}
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((col, index) => (
                    <th
                      key={index}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {cell !== null ? cell.toString() : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default UploadPage;
