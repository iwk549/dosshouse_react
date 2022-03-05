import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";

const LoadingAnimation = ({}) => {
  return (
    <div className="loading-animation-container">
      <motion.div
        className="loading-animation"
        animate={{
          backgroundColor: ["#fff", "#000", "#fff"],
        }}
        transition={{
          flip: Infinity,
          duration: 2,
          ease: "easeOut",
        }}
      />
      <div
        style={{
          position: "absolute",
          height: 20,
          width: 20,
          backgroundColor: "#000",
          borderRadius: "50%",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          height: 10,
          width: 10,
          backgroundColor: "#fff",
          borderRadius: "50%",
        }}
        animate={{
          backgroundColor: ["#fff", "#000", "#fff"],
        }}
        transition={{
          flip: Infinity,
          duration: 2,
          ease: "easeOut",
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
