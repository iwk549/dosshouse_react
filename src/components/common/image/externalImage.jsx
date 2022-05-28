import React from "react";

const ExternalImage = ({ uri, height, width }) => {
  if (!uri) return null;

  const imageStyle = {
    width: width || 35,
    height: height || 35,
  };

  return <img src={uri} style={imageStyle} className="external-image" />;
};

export default ExternalImage;
