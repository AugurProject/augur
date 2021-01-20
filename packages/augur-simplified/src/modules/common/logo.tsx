import React from 'react';
import { AugurTextLogo, v2AugurLogo } from './icons';

import Styles from './logo.styles.less';
import { useAppStatusStore } from '../stores/app-status';
import { MarketsLink } from '../routes/helpers/links';

export const Logo = () => {
  const { isMobile } = useAppStatusStore();

  return (
    <MarketsLink id="logolink">
      <section className={Styles.v2Logo}>
        {isMobile ? v2AugurLogo : AugurTextLogo}
      </section>
    </MarketsLink>
  );
};

export default Logo;
