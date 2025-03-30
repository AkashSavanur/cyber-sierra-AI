import { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supabase from "../helper/SupabaseClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate("/home");
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
      setFormData({ email: "", password: "" });
      return;
    }

    if (data) {
      Swal.fire({
        title: "Success!",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        console.log(data)
        navigate("/home");
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      Swal.fire("Error", "Please enter your email to reset password", "error");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success!", "Check your email for reset instructions.", "success");
    }
  };

  const handleSignUp = () => {
    navigate("/signup"); // Navigate to the Sign Up page
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "80vh" }}>

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
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
            Log In
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!(formData.email && formData.password)}
              sx={{ mr: '16px', width: "180px"}}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </Button>
          </div>
          <div style={{ marginTop: "16px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSignUp}
              fullWidth
            >
              Don't have an account? Sign Up
            </Button>
          </div>
        </Paper>
      </main>
    </div>
  );
}
