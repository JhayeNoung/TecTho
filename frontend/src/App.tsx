import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/TokenContext";

import Home from "./pages/Home";
import MoiveAPI from "./pages/MovieAPI";
import Registration from "./pages/Registration";

function App() {
  return (

    <Routes>
      <Route index element={<Home />} />
      <Route path="api" element={<MoiveAPI />} />
      <Route path="registration/*" element={<Registration />} />
    </Routes>

  )
}

export default App
