import React from "react";

import {
  BiHome,
  BiLogOutCircle,
  BiLogInCircle,
  BiCheckDouble,
  BiSave,
} from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";
import { IoMdTrophy, IoMdSettings } from "react-icons/io";
import { MdOutlineBatchPrediction, MdWebStories } from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";

const icons = {
  app: MdWebStories,
  checkmark: BiCheckDouble,
  home: BiHome,
  login: BiLogInCircle,
  logout: BiLogOutCircle,
  prediction: MdOutlineBatchPrediction,
  profile: RiUserSettingsLine,
  save: BiSave,
  settings: IoMdSettings,
  spotify: BsSpotify,
  trophy: IoMdTrophy,
};

const IconRender = ({ type, size }) => {
  if (!icons[type]) return null;
  return React.createElement(icons[type], { size });
};

export default IconRender;
