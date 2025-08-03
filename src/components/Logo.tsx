import React from 'react';
import { SvgProps } from 'react-native-svg';

import OnthemoodLogo from '@assets/icons/onthemood-logo.svg';

interface LogoProps extends SvgProps {
  variant?: 'default';
}

const Logo = ({ variant = 'default', ...props }: LogoProps) => {
  switch (variant) {
    case 'default':
    default:
      return <OnthemoodLogo {...props} />;
  }
};

export default Logo;
