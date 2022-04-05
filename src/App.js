import React, { useState } from "react";
import logo from "./logo.svg";
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";

import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navbar";
import LoadingContext from "./context/loadingContext";
import Loading from "./components/common/loading/loading";

function App() {
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const [textTimeout, setTextTimeout] = useState(null);

  const handleUpdateLoading = (bool) => {
    if (bool)
      setTextTimeout(
        setTimeout(() => {
          setShowText(true);
        }, 2500)
      );
    else {
      if (textTimeout) clearTimeout(textTimeout);
      setShowText(false);
    }
    setLoading(bool);
  };

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading: handleUpdateLoading }}
    >
      <Loading loading={loading} showText={showText} />
      <div className="App">
        <Navbar />
        <SwitchRouter />
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        theme="dark"
      />
    </LoadingContext.Provider>
  );
}

export default App;
