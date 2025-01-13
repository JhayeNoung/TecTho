import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/TokenContext";

import Home from "./pages/Home";
import MovieAPI from "./components/MovieAPI";
import Registration from "./pages/Registration";
import MovieAPITest from "./components/MovieAPITest";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="api" element={<MovieAPITest />} />
      <Route path="registration/*" element={<Registration />} />
    </Routes>
  )
}

export default App
