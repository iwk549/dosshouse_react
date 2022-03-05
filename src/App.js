import React, { useState } from "react";
import logo from "./logo.svg";
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navbar";
import LoadingContext from "./context/loadingContext";
import Loading from "./components/common/loading/loading";

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Loading loading={loading} />
      <div className="App">
        <Navbar />
        <SwitchRouter />
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
      />
    </LoadingContext.Provider>
  );
}

export default App;
