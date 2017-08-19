/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance since the order NEVER changes
// comment lifted from old core-stats.js
import React from 'react';
import PropTypes from 'prop-types';

const TopBar = props => (
  <header className="topbar">
    <section className="stats">
      <span className="stat-eth stat">
        <span className="stat-label">ETH</span>
        <span className="stat-value">
          {props.stats[0].totalRealEth.value.formatted}
        </span>
      </span>
      <span className="stat-rep stat">
        <span className="stat-label">REP</span>
        <span className="stat-value">
          {props.stats[0].totalRep.value.formatted}
        </span>
      </span>
    </section>
    <span className="mobile-logotext">Augur</span>
  </header>
);

TopBar.propTypes = {
  stats: PropTypes.array.isRequired
};

export default TopBar;
