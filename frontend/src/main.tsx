import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import MovieAPI from './MovieAPI'
import 'bootstrap/dist/css/bootstrap.css'
import { Provider } from "@/components/ui/provider"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
      <MovieAPI/>
    </Provider>
  </StrictMode>,
)
