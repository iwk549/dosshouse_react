import React, { useContext, useEffect } from "react";

import ActiveSites from "../activeSites/activeSites";
import LoadingContext from "../../context/loadingContext";

const Home = () => {
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="standout-header">Welcome to Dosshouse</div>
      <p>
        Dosshouse is a combination of personal projects, utilities, and links to
        my active sites. Please browse around and check them out.
      </p>
      <hr />
      <ActiveSites />
    </div>
  );
};

export default Home;
