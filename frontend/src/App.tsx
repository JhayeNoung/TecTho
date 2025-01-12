import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/TokenContext";

import Home from "./pages/Home";
import MoiveAPI from "./pages/MovieAPI";
import Registeration from "./pages/Registeriation";

function App() {
  return (

    <Routes>
      <Route index element={<Home />} />
      <Route path="api" element={<MoiveAPI />} />
      <Route path="registeration/*" element={<Registeration />} />
    </Routes>

  )
}

export default App
