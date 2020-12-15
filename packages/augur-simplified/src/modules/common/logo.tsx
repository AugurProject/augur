import React from 'react';
import { AugurTextLogo, v2AugurLogo } from 'modules/common/icons';

import Styles from 'modules/common/logo.styles.less';
import { useAppStatusStore } from 'modules/stores/app-status';

export const Logo = () => {
  const { isMobile } = useAppStatusStore();

  return (
    <section className={Styles.v2Logo}>
      {isMobile ? v2AugurLogo : AugurTextLogo}
    </section>
  );
};

export default Logo;
