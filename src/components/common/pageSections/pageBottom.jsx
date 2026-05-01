import React from "react";
import TipJarBanner from "../../tipJar/tipJarBanner";

const PageBottom = () => {
  return (
    <div style={{ margin: "0 24px 10px" }}>
      <TipJarBanner />
      <div
        className="text-center"
        style={{ marginTop: 16, fontSize: 13, opacity: 0.75 }}
      >
        Part of{" "}
        <a
          href="https://ultimatescoreboard.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ultimate Scoreboard
        </a>
        {" "}· manage your own sports league
      </div>
    </div>
  );
};

export default PageBottom;
