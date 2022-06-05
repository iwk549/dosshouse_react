import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PageBottom from "./components/common/pageSections/pageBottom";
import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navigation/navbar";
import LoadingContext from "./context/loadingContext";
import Loading from "./components/common/loading/loading";
import { getCurrentUser, refreshUser } from "./services/userService";
import Banner from "./components/common/pageSections/banner";
import CookieBanner from "./components/common/pageSections/cookieBanner";

function App() {
  let navigate = useNavigate();
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
        <CookieBanner />
        <Banner
          announcement="World Cup 2022 predictions are now live!!!"
          onClick={() => navigate("/predictions?tab=Active%20Competitions")}
          cookieName="worldCup2022Announcement"
        />
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
