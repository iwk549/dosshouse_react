import React from "react";

import {
  BiHome,
  BiLogOutCircle,
  BiLogInCircle,
  BiCheckDouble,
  BiSave,
} from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";
import { IoMdTrophy } from "react-icons/io";
import { MdOutlineBatchPrediction, MdWebStories } from "react-icons/md";

const icons = {
  app: MdWebStories,
  checkmark: BiCheckDouble,
  home: BiHome,
  login: BiLogInCircle,
  logout: BiLogOutCircle,
  prediction: MdOutlineBatchPrediction,
  save: BiSave,
  spotify: BsSpotify,
  trophy: IoMdTrophy,
};

const IconRender = ({ type, size }) => {
  if (!icons[type]) return null;
  return React.createElement(icons[type], { size });
};

export default IconRender;
