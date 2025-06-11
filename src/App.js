import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga4";

import PageBottom from "./components/common/pageSections/pageBottom";
import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navigation/navbar";
import LoadingContext from "./context/loadingContext";
import Loading from "./components/common/loading/loading";
import { getCurrentUser, refreshUser } from "./services/userService";
import Banner from "./components/common/pageSections/banner";
import CookieBanner from "./components/common/pageSections/cookieBanner";
import setPageTitle from "./textMaps/pageTitles";

ReactGA.initialize("G-TJW8WX427W");

function App() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [textTimeout, setTextTimeout] = useState(null);
  const [user, setUser] = useState(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  const setCurrentUser = () => {
    setUser(getCurrentUser());
  };

  const refresh = async () => {
    const res = await refreshUser();
    if (res?.status === 200) {
      setUser(res.data);
    }
  };

  useEffect(() => {
    refresh();
    setCurrentUser();
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
        cookiesAccepted,
        setCookiesAccepted,
      }}
    >
      <Loading loading={loading} showText={showText} />
      <div className="App">
        <Navbar />
        <>
          <CookieBanner />
          <Banner
            announcement="Club World Cup 2025 predictions are now live!!!"
            onClick={() => {
              navigate(
                "/predictions?id=new&competitionID=683f0928dc52d0c36b3e3b5f"
              );
            }}
            cookieName="clubWorldCup2022"
            showIfLoggedIn={false}
          />
          <SwitchRouter />
          <PageBottom />
        </>
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
