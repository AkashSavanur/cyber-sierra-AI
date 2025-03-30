import { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supabase from "../helper/SupabaseClient";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogIn = () => {
    navigate("/login"); // Navigate to the Sign Up page
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      Swal.fire({
        title: "Success!",
        text: "Check your email for verification.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }

    setFormData({ email: "", password: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "80vh" }}>
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "24px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "16px" }}>
            Sign Up
          </Typography>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
            onClick={handleSubmit}
            disabled={!(formData.email && formData.password)}
          >
            Sign Up
          </Button>
          <div style={{ marginTop: "16px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogIn}
              fullWidth
            >
              Already have an account? Log In
            </Button>
          </div>
          {message && <Typography style={{ marginTop: "16px", color: "red" }}>{message}</Typography>}
        </Paper>
      </main>
    </div>
  );
}