import React from "react";

import Arrow from "@assets/icons/arrow.svg";
import Back from "@assets/icons/back.svg";
import Calendar from "@assets/icons/calendar.svg";
import Check from "@assets/icons/check.svg";
import Down from "@assets/icons/down.svg";
import DownWhite from "@assets/icons/down_white.svg";
import Edit from "@assets/icons/edit.svg";
import Info from "@assets/icons/info.svg";
import List from "@assets/icons/list.svg";
import Location from "@assets/icons/location.svg";
import Plus from "@assets/icons/plus.svg";
import Profile from "@assets/icons/profile.svg";
import Temperature from "@assets/icons/temperature.svg";
import TemperatureGray from "@assets/icons/temperature_gray.svg";
import Trash from "@assets/icons/trash.svg";
import GoogleLogo from "@assets/icons/google_logo.svg";
import AppleLogo from "@assets/icons/apple_logo.svg";

export enum IconName {
  arrow = "arrow",
  back = "back",
  calendar = "calendar",
  check = "check",
  down = "down",
  edit = "edit",
  info = "info",
  list = "list",
  location = "location",
  plus = "plus",
  profile = "profile",
  temperature = "temperature",
  trash = "trash",
  downWhite = "down_white",
  temperatureGray = "temperature_gray",
  googleLogo = "google_logo",
  appleLogo = "apple_logo",
}

const icons = {
  [IconName.arrow]: Arrow,
  [IconName.back]: Back,
  [IconName.calendar]: Calendar,
  [IconName.check]: Check,
  [IconName.down]: Down,
  [IconName.edit]: Edit,
  [IconName.info]: Info,
  [IconName.list]: List,
  [IconName.location]: Location,
  [IconName.plus]: Plus,
  [IconName.profile]: Profile,
  [IconName.temperature]: Temperature,
  [IconName.trash]: Trash,
  [IconName.downWhite]: DownWhite,
  [IconName.temperatureGray]: TemperatureGray,
  [IconName.googleLogo]: GoogleLogo,
  [IconName.appleLogo]: AppleLogo,
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const Icon = ({ name, size = 24, color }: IconProps) => {
  const SvgIcon = icons[name];
  return <SvgIcon width={size} height={size} fill={color} />;
};

export default Icon;
