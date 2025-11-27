// Lembre-se de instalar as dependências necessárias com o comando:
// npm install react-router-dom sonner

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <App />
        <Toaster richColors position="top-right" />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);