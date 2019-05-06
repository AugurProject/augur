import React from "react";

import { PillSelection } from "modules/common-elements/selection";
import PlatformOverviewStats from "modules/account/containers/platform-overview-stats";
import * as constants from "modules/common-elements/constants";
import { LinearPropertyLabel } from "modules/common-elements/labels";
import Styles from "modules/account/components/augur-status/activity.styles";

export interface ActivityProps {
  updatePlatformTimeframeData: Function;
  currentAugurTimestamp: number;
  openInterest: string;
}

interface ActivityState {
  selected: number;
}

export default class Activity extends React.Component<
  ActivityProps,
  ActivityState
> {
  state: ActivityState = {
    selected: constants.TIMEFRAME_OPTIONS[3].id
  };

  componentDidMount() {
    this.updateTimeSelection(constants.TIMEFRAME_OPTIONS[3].id);
  }

  updateTimeSelection = (id: number) => {
    this.setState({ selected: id });
    const period = constants.TIMEFRAME_OPTIONS[id].periodInterval;
    const startTime =
      period === 0 ? 0 : this.props.currentAugurTimestamp - period;
    this.props.updatePlatformTimeframeData(startTime);
  };

  render() {
    return (
      <div className={Styles.Activity}>
        <span>Activity</span>
        <LinearPropertyLabel
          highlight
          key="openInterest"
          label="Open Interest"
          value={this.props.openInterest}
        />
        <PillSelection
          options={constants.TIMEFRAME_OPTIONS}
          defaultSelection={constants.TIMEFRAME_OPTIONS[3].id}
          onChange={this.updateTimeSelection}
        />
        <PlatformOverviewStats timeframe={this.state.selected} />
      </div>
    );
  }
}
