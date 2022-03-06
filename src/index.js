import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import "./css/buttons.css";
import "./css/icon.css";
import "./css/inputs.css";
import "./css/nav.css";
import "./css/pageSection.css";
import "./css/tab.css";
import "./css/table.css";
import "./css/text.css";
import "./css/tooltip.css";
import "./css/buttons.css";
import "./css/buttons.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
