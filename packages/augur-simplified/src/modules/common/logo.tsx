import React from 'react';

import Styles from './logo.styles.less';
import { Icons, Links, useAppStatusStore } from '@augurproject/augur-comps';

const { MarketsLink } = Links;
const { AugurTextLogo, v2AugurLogo } = Icons;

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
