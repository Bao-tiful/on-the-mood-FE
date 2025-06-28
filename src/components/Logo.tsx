import React from "react";
import { SvgProps } from "react-native-svg";

import OnTheMoodLogo from "@assets/images/onthemood-logo.svg";

interface LogoProps extends SvgProps {
  variant?: "default";
}

const Logo = ({ variant = "default", ...props }: LogoProps) => {
  switch (variant) {
    case "default":
    default:
      return <OnTheMoodLogo {...props} />;
  }
};

export default Logo;
export { OnTheMoodLogo };
