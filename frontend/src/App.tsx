import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Registration from "./pages/Registration";
import MovieAPI from "./pages/MovieAPI";
import Payment from "./pages/Payment";
import { useUserStore } from "./context/useUserStore";


function App() {
  const { accessToken, fetchAccessToken } = useUserStore();

  useEffect(() => {
    if (!accessToken) {
      fetchAccessToken();
    }
  }, [accessToken, fetchAccessToken]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="api" element={<MovieAPI />} />
      <Route path="registration/*" element={<Registration />} />
      <Route path="payment" element={<Payment />} />
    </Routes>
  )
}

export default App
