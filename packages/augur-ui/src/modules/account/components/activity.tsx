import React, { useState } from 'react';

import PlatformOverviewStats from 'modules/account/containers/platform-overview-stats';
import { TIMEFRAME_OPTIONS } from 'modules/common/constants';
import { LinearPropertyLabel } from 'modules/common/labels';
import Styles from 'modules/account/components/activity.styles.less';

export interface ActivityProps {
  updatePlatformTimeframeData: Function;
  currentAugurTimestamp: number;
  openInterest: string;
}

interface ActivityState {
  selected: number;
}

const Activity = ({ openInterest }: ActivityProps) => {
  const [selected, setSelected] = useState(TIMEFRAME_OPTIONS[2].id);
  return (
    <div className={Styles.Activity}>
      <h4>Activity</h4>
      <LinearPropertyLabel
        highlight
        key="openInterest"
        label="Open Interest"
        value={openInterest}
        useFull={true}
      />
      <PlatformOverviewStats
        timeframe={selected}
        updateSelected={selected => setSelected(selected)}
      />
    </div>
  );
};

export default Activity;
