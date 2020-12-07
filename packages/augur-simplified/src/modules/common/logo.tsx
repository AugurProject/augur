import React from 'react';
import {
  AugurTextLogo,
} from 'modules/common/icons';

import * as Styles from 'modules/common/logo.styles.less';

export const Logo = () => (
  <section className={Styles.v2Logo}>
    {AugurTextLogo}
  </section>
);

export default Logo;