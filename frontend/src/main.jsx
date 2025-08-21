import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Componentes/Store/Ui.jsx";
import { CartContextProvider } from "./Componentes/Store/CartContext.jsx";
import { ThemeProvider } from "./Componentes/Store/theme.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./Componentes/Store/ToastContext.jsx";

// ✅ Create QueryClient instance
const queryClient = new QueryClient();
const storedUser = JSON.parse(localStorage.getItem("user"));

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartContextProvider userId={storedUser?.id}>
        <AuthProvider>
          <StrictMode>
            <ToastProvider>
              <App />
            </ToastProvider>
          </StrictMode>
        </AuthProvider>
      </CartContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
