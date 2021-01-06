import React from 'react';
import { AugurTextLogo, v2AugurLogo } from 'modules/common/icons';

import Styles from 'modules/common/logo.styles.less';
import { useAppStatusStore } from 'modules/stores/app-status';
import { MarketsLink } from 'modules/routes/helpers/links';

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
