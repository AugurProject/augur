import React from 'react';
import Styles from 'modules/portfolio/portfolio-view.styles.less';
import { AppViewStats } from 'modules/common/labels';
import Activity from './activity';
import { SecondaryButton } from 'modules/common/buttons';

export const PortfolioView = () => (
  <div className={Styles.PortfolioView}>
    <section>
      <AppViewStats />
      <SecondaryButton text={'$24.00 in Winnings to claim'}/>
    </section>
    <section>
      <Activity />
    </section>
  </div>
);

export default PortfolioView;
