import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from "react-router";
import "./index.css"; // my custom css
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
