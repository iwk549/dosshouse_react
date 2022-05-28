import { useState, useEffect } from "react";

function getWindowDimensions() {
  const mobileWidth = 750;
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
    isMobile: width <= mobileWidth,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
