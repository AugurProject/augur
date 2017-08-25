/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance since the order NEVER changes
// comment lifted from old core-stats.js
import React from 'react';
import PropTypes from 'prop-types';

import Styles from 'modules/app/components/top-bar/styles';

const TopBar = props => (
  <header className={Styles.TopBar}>
    <section>
      <span className={Styles.TopBar__stat}>
        <span className={Styles['TopBar__stat-label']}>ETH</span>
        <span className={Styles['TopBar__stat-value']}>
          {props.stats[0].totalRealEth.value.formatted}
        </span>
      </span>
      <span className={Styles.TopBar__stat}>
        <span className={Styles['TopBar__stat-label']}>REP</span>
        <span className={Styles['TopBar__stat-value']}>
          {props.stats[0].totalRep.value.formatted}
        </span>
      </span>
    </section>
    <span className={Styles['TopBar__logo-text']}>Augur</span>
  </header>
);

TopBar.propTypes = {
  stats: PropTypes.array.isRequired
};

export default TopBar;
