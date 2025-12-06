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
import DevBanner from "./components/common/dev/devBanner";

ReactGA.initialize("G-TJW8WX427W");

function App() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  const setCurrentUser = () => {
    setUser(getCurrentUser());
  };

  const refresh = async () => {
    await refreshUser();
    setCurrentUser();
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    sendPageView();
    setPageTitle(window.location.pathname);
  }, [window.location.pathname, window.location.search]);

  const sendPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  };

  const handleUpdateLoading = (bool) => {
    setLoading(bool);
  };

  /* 
      this is a workaround to fix issues between React and Google Translate which cause errors
      Solution found here: https://github.com/facebook/react/issues/11538
      Information on this issue: https://martijnhols.nl/gists/everything-about-google-translate-crashing-react
    */
  if (typeof Node === "function" && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child.parentNode !== this) {
        if (console) {
          console.error(
            "Cannot remove a child from a different parent",
            child,
            this
          );
        }
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (console) {
          console.error(
            "Cannot insert before a reference node from a different parent",
            referenceNode,
            this
          );
        }
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    };
  }

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
      <Loading loading={loading} />
      <div className="App">
        <DevBanner />
        <Navbar />
        <>
          <CookieBanner />
          <Banner
            hide={false}
            announcement="World Cup 2026 predictions are now live!!!"
            onClick={() => {
              navigate(
                "/competitions?id=new&competitionID=6933533400d2c729449b2e0a"
              );
            }}
            cookieName="worldCup2026"
            showIfLoggedIn={true}
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
        limit={3}
        icon={
          <img
            src="assets/logo4.png"
            width={25}
            height={25}
            style={{ borderRadius: 5, border: "1px solid #831fe0" }}
          />
        }
      />
    </LoadingContext.Provider>
  );
}

export default App;
