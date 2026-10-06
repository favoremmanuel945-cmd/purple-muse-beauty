import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Booking from "./pages/Booking.jsx";
import "./styles.css";
import "./booking.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
