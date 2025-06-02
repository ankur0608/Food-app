import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Componentes/Store/Ui.jsx";
import { CartContextProvider } from "./Componentes/Store/CartContext.jsx";
import { ThemeProvider } from "./Componentes/Store/theme.jsx";
createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider>
      <CartContextProvider>
        <AuthProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </AuthProvider>
      </CartContextProvider>
    </ThemeProvider>
  </>
);
