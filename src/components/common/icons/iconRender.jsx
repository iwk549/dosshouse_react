import React from "react";

import {
  BiHome,
  BiLogOutCircle,
  BiLogInCircle,
  BiCheckDouble,
  BiSave,
} from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { IoMdTrophy, IoMdSettings, IoMdCheckmark } from "react-icons/io";
import {
  MdOutlineBatchPrediction,
  MdWebStories,
  MdOutlineRemoveCircle,
  MdDeleteSweep,
  MdOutlineLocationOn,
  MdCalendarToday,
} from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";

const icons = {
  app: MdWebStories,
  calendar: MdCalendarToday,
  check: IoMdCheckmark,
  checkmark: BiCheckDouble,
  delete: MdDeleteSweep,
  home: BiHome,
  left: FaCaretLeft,
  location: MdOutlineLocationOn,
  login: BiLogInCircle,
  logout: BiLogOutCircle,
  prediction: MdOutlineBatchPrediction,
  profile: RiUserSettingsLine,
  remove: MdOutlineRemoveCircle,
  right: FaCaretRight,
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
