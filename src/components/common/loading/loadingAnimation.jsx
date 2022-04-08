import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";

import LogoRender from "../image/logoRender";

const LoadingAnimation = ({}) => {
  return (
    <div className="loading-animation-container">
      <motion.div
        style={{
          position: "absolute",
          height: 5,
          width: 10,
          backgroundColor: "#ccffd0",
          borderRadius: 5,
        }}
        animate={{
          width: [10, 150, 10],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
