import React from 'react';
import { AugurTextLogo, v2AugurLogo } from './icons';
import classNames from 'classnames';

import Styles from './logo.styles.less';

interface LogoProps {
  isMobile?: boolean;
  darkTheme?: boolean;
}

export const Logo = ({isMobile, darkTheme}: LogoProps) => {
  return (
    <section className={classNames(Styles.v2Logo, {[Styles.Dark]: darkTheme})}>
      {isMobile ? v2AugurLogo : AugurTextLogo}
    </section>
  );
};

export default Logo;
