import React from "react";

import {
  BiHome,
  BiLogOutCircle,
  BiLogInCircle,
  BiCheckDouble,
  BiSave,
  BiRename,
  BiSearchAlt,
} from "react-icons/bi";
import { BsSpotify, BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import {
  FaCaretLeft,
  FaCaretRight,
  FaSortAmountUp,
  FaWindowClose,
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaGripLines,
  FaClipboardCheck,
  FaBlog,
} from "react-icons/fa";
import { IoMdTrophy, IoMdSettings, IoMdCheckmark } from "react-icons/io";
import {
  MdOutlineBatchPrediction,
  MdWebStories,
  MdOutlineRemoveCircle,
  MdDeleteSweep,
  MdOutlineLocationOn,
  MdCalendarToday,
  MdCancel,
} from "react-icons/md";
import { RiUserSettingsLine, RiUserFill } from "react-icons/ri";
import { VscThreeBars } from "react-icons/vsc";

const icons = {
  app: MdWebStories,
  blog: FaBlog,
  calendar: MdCalendarToday,
  cancel: MdCancel,
  check: IoMdCheckmark,
  checkmark: BiCheckDouble,
  close: FaWindowClose,
  delete: MdDeleteSweep,
  down: BsCaretDownFill,
  drag: FaGripLines,
  home: BiHome,
  left: FaCaretLeft,
  location: MdOutlineLocationOn,
  login: BiLogInCircle,
  logout: BiLogOutCircle,
  moveDown: FaCaretSquareDown,
  moveUp: FaCaretSquareUp,
  name: BiRename,
  nav: VscThreeBars,
  prediction: MdOutlineBatchPrediction,
  profile: RiUserSettingsLine,
  ranking: FaSortAmountUp,
  remove: MdOutlineRemoveCircle,
  right: FaCaretRight,
  save: BiSave,
  search: BiSearchAlt,
  settings: IoMdSettings,
  spotify: BsSpotify,
  submission: FaClipboardCheck,
  trophy: IoMdTrophy,
  up: BsCaretUpFill,
  user: RiUserFill,
};

const IconRender = ({ type, size, ...rest }) => {
  if (!icons[type]) return null;
  return React.createElement(icons[type], {
    size,
    "data-testid": type + "_icon",
    ...rest,
  });
};

export default IconRender;
