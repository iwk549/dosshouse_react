import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PageBottom from "./components/common/pageBottom";
import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navbar";
import LoadingContext from "./context/loadingContext";
import Loading from "./components/common/loading/loading";
import { getCurrentUser, refreshUser } from "./services/userService";

function App() {
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [textTimeout, setTextTimeout] = useState(null);
  const [user, setUser] = useState(null);

  const setCurrentUser = () => {
    setUser(getCurrentUser());
  };

  const refresh = async () => {
    await refreshUser();
    setLoading(false);
  };

  useEffect(() => {
    setCurrentUser();
    refresh();
  }, []);

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
      value={{
        loading,
        setLoading: handleUpdateLoading,
        user,
        setUser: setCurrentUser,
      }}
    >
      <Loading loading={loading} showText={showText} />
      <div className="App">
        <Navbar />
        <SwitchRouter />
        <PageBottom />
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        theme="dark"
        limit={3}
      />
    </LoadingContext.Provider>
  );
}

export default App;
