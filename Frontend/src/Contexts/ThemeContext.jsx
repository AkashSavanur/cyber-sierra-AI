import React, { createContext, useContext, useState } from "react";

// Create a context to share the theme state
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, handleThemeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
