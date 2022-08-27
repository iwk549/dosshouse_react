import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga4";

import PageBottom from "./components/common/pageSections/pageBottom";
import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navigation/navbar";
import LoadingContext from "./context/loadingContext";
import Loading from "./components/common/loading/loading";
import { getCurrentUser, refreshUser } from "./services/userService";
import { getLatestVersion } from "./services/versionsService";
import Banner from "./components/common/pageSections/banner";
import CookieBanner from "./components/common/pageSections/cookieBanner";
import setPageTitle from "./textMaps/pageTitles";
import packageJSON from "../package.json";
import CouldNotContactServer from "./components/common/pageSections/couldNotContactServer";

ReactGA.initialize("G-TJW8WX427W");

function App() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [textTimeout, setTextTimeout] = useState(null);
  const [user, setUser] = useState(null);
  const [apiRunning, setApiRunning] = useState(true);

  const setCurrentUser = () => {
    setUser(getCurrentUser());
  };

  const refresh = async () => {
    await refreshUser();
  };

  const getCurrentVersion = async () => {
    const version = await getLatestVersion();
    // version should alwasy return 200 if server is running
    if (version && version.status === 200) {
      const webVersion = packageJSON.version.split(".");
      const webMajor = webVersion[0];
      const webMinor = webVersion[1];
      const webPatch = webVersion[2];

      if (
        Number(webMajor) !== version.data.major ||
        Number(webMinor) !== version.data.minor ||
        Number(webPatch) !== version.data.patch
      ) {
        window.location.reload(true);
      } else
        console.log(
          `Dosshouse is up to date. Running version ${packageJSON.version}.`
        );
    } else {
      toast.error("Could not contact server");
      setApiRunning(false);
    }
  };

  useEffect(() => {
    getCurrentVersion();
    setCurrentUser();
    refresh();
    // wait a tick before setting loading to false to allow for other pages to complete their requests
    // do need to set loading to false here as some pages dont have any requests and are not setting loading to false
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    sendPageView();
    setPageTitle(window.location.pathname);
  }, [window.location.pathname, window.location.search]);

  const sendPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  };

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
        {!apiRunning ? (
          <CouldNotContactServer />
        ) : (
          <>
            <CookieBanner />
            <Banner
              announcement="World Cup 2022 predictions are now live!!!"
              onClick={() => navigate("/predictions?tab=Active%20Competitions")}
              cookieName="worldCup2022"
            />
            <SwitchRouter />
            <PageBottom />
          </>
        )}
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
