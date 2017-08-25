import React from 'react';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon/augur-logo-icon';

import Styles from 'modules/app/components/logo/styles';

const Logo = props => (
  <section className={Styles.Logo}>
    <AugurLogoIcon />
    <span className={Styles.Logo__text}>
      Augur
    </span>
  </section>
);

export default Logo;
