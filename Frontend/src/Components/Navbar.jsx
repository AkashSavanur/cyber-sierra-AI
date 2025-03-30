import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import supabase from "../helper/SupabaseClient";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be signed out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out",
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      setUser(null);
      Swal.fire(
        "Signed out!",
        "You have been successfully signed out.",
        "success"
      );
      navigate("/login");
    }
  };

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
          {user && (
            <Button variant="contained" onClick={handleSignOut}>
              Log Out
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
