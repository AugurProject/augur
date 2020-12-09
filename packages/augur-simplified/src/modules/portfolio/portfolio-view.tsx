import React, { useState } from 'react';
import Styles from 'modules/portfolio/portfolio-view.styles.less';
import { AppViewStats } from 'modules/common/labels';
import Activity from './activity';
import { SecondaryButton } from 'modules/common/buttons';
import { LIQUIDITY, POSITIONS } from 'modules/constants';
import classNames from 'classnames';

export const PortfolioView = () => {
  const [tableView, setTableView] = useState(POSITIONS);

  return (
  <div className={Styles.PortfolioView}>
    <section>
      <AppViewStats />
      <SecondaryButton text={'$24.00 in Winnings to claim'}/>
      <div>
        <span onClick={() => setTableView(POSITIONS)} className={classNames({[Styles.Selected]: tableView === POSITIONS})}>{POSITIONS}</span>
        <span onClick={() => setTableView(LIQUIDITY)} className={classNames({[Styles.Selected]: tableView === LIQUIDITY})}>{LIQUIDITY}</span>
      </div>
    </section>
    <section>
      <Activity />
    </section>
  </div>
);}

export default PortfolioView;
