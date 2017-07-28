import React from 'react';

const TopBar = (props) => (
  <div className="topbar">
    <div className="stats">
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
    </div>
    <span className="mobile-logotext">Augur</span>
  </div>
);

TopBar.propTypes = {
};

export default TopBar;
