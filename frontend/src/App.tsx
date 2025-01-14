import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/TokenContext";

import Home from "./pages/Home";
import Registration from "./pages/Registration";
import MovieAPI from "./pages/MovieAPI";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="api" element={<MovieAPI />} />
      <Route path="registration/*" element={<Registration />} />
    </Routes>
  )
}

export default App
