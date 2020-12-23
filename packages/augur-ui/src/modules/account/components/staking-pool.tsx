import React from "react";
import Styles from "modules/portfolio/components/common/quad.styles.less";
import FeePoolView from 'modules/reporting/containers/fee-pool-view';
import QuadBox from 'modules/portfolio/components/common/quad-box';

const StakingPool = () => (
  <QuadBox
  title="REP Staking Pool"
  content={
    <div className={Styles.Content}>
      <FeePoolView />
    </div>
  }
/>
)


export default StakingPool;
