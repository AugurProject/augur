import React from 'react';
import Styles from 'modules/portfolio/portfolio-view.styles.less';
import { AppViewStats } from 'modules/common/labels';
import Activity from './activity';

export const PortfolioView = () => (
  <div className={Styles.PortfolioView}>
    <section>
      <AppViewStats />
    </section>
    <section>
      <Activity />
    </section>
  </div>
);

export default PortfolioView;
