import React from 'react';

import Arrow from '@assets/icons/arrow.svg';
import Back from '@assets/icons/back.svg';
import Calendar from '@assets/icons/calendar.svg';
import Cancel from '@assets/icons/cancel.svg';
import Check from '@assets/icons/check.svg';
import Down from '@assets/icons/down.svg';
import DownWhite from '@assets/icons/down_white.svg';
import Edit from '@assets/icons/edit.svg';
import Eye from '@assets/icons/eye.svg';
import Info from '@assets/icons/info.svg';
import KeypadBack from '@assets/icons/keypad_back.svg';
import List from '@assets/icons/list.svg';
import Location from '@assets/icons/location.svg';
import Plus from '@assets/icons/plus.svg';
import Profile from '@assets/icons/profile.svg';
import Sad from '@assets/icons/sad.svg';
import Temperature from '@assets/icons/temperature.svg';
import TemperatureGray from '@assets/icons/temperature_gray.svg';
import Trash from '@assets/icons/trash.svg';
import GoogleLogo from '@assets/icons/google_logo.svg';
import AppleLogo from '@assets/icons/apple_logo.svg';
import Caution from '@assets/icons/caution.svg';
import CheckCircle from '@assets/icons/check_circle.svg';
import UncheckCircle from '@assets/icons/uncheck_circle.svg';

export enum IconName {
  arrow = 'arrow',
  back = 'back',
  calendar = 'calendar',
  cancel = 'cancel',
  check = 'check',
  down = 'down',
  edit = 'edit',
  eye = 'eye',
  info = 'info',
  keypadBack = 'keypad_back',
  list = 'list',
  location = 'location',
  plus = 'plus',
  profile = 'profile',
  sad = 'sad',
  temperature = 'temperature',
  trash = 'trash',
  downWhite = 'down_white',
  temperatureGray = 'temperature_gray',
  googleLogo = 'google_logo',
  appleLogo = 'apple_logo',
  caution = 'caution',
  checkCircle = 'check_circle',
  uncheckCircle = 'uncheck_circle',
}

const icons = {
  [IconName.arrow]: Arrow,
  [IconName.back]: Back,
  [IconName.calendar]: Calendar,
  [IconName.cancel]: Cancel,
  [IconName.check]: Check,
  [IconName.down]: Down,
  [IconName.edit]: Edit,
  [IconName.eye]: Eye,
  [IconName.info]: Info,
  [IconName.keypadBack]: KeypadBack,
  [IconName.list]: List,
  [IconName.location]: Location,
  [IconName.plus]: Plus,
  [IconName.profile]: Profile,
  [IconName.sad]: Sad,
  [IconName.temperature]: Temperature,
  [IconName.trash]: Trash,
  [IconName.downWhite]: DownWhite,
  [IconName.temperatureGray]: TemperatureGray,
  [IconName.googleLogo]: GoogleLogo,
  [IconName.appleLogo]: AppleLogo,
  [IconName.caution]: Caution,
  [IconName.checkCircle]: CheckCircle,
  [IconName.uncheckCircle]: UncheckCircle,
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const Icon = ({ name, size = 24, color }: IconProps) => {
  const SvgIcon = icons[name];
  return <SvgIcon width={size} height={size} color={color} />;
};

export default Icon;
