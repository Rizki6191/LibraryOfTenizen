import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/auth.css"; // import global css (optional since Login.jsx juga import)
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from './components/dashboard/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </BrowserRouter>
);
