import React from "react";

import {
  YOUR_OVERVIEW_TITLE,
  TIMEFRAME_OPTIONS
} from "modules/common-elements/constants";
import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import { PillSelection } from "modules/common-elements/selection";
import Funds from "modules/account/containers/funds";
import Stats from "modules/account/containers/stats";
import OverviewChart from "modules/account/containers/overview-chart";
import Styles from "modules/account/components/overview.styles";

export interface OverviewProps {
  currentAugurTimestamp: number;
  updateTimeframeData: Function;
}

interface OverviewState {
  selected: number;
}

export default class Overview extends React.Component<
  OverviewProps,
  OverviewState
> {
  state: OverviewState = {
    selected: TIMEFRAME_OPTIONS[3].id
  };

  componentDidMount() {
    this.updateTimeSelection(TIMEFRAME_OPTIONS[3].id);
  }

  updateTimeSelection = (id: number) => {
    this.setState({ selected: id });
    const period = TIMEFRAME_OPTIONS[id].periodInterval;
    const startTime =
      period === 0 ? null : this.props.currentAugurTimestamp - period;
    this.props.updateTimeframeData({ startTime });
  };

  render() {
    const { selected } = this.state;

    return (
      <QuadBox
        title={YOUR_OVERVIEW_TITLE}
        content={
          <div className={Styles.AccountOverview}>
            <Funds />
            <div className={Styles.AccountOverview__pillSelector}>
              <PillSelection
                options={TIMEFRAME_OPTIONS}
                defaultSelection={TIMEFRAME_OPTIONS[3].id}
                onChange={this.updateTimeSelection}
              />
            </div>
            <Stats timeframe={selected} />
            <OverviewChart timeframe={selected} />
          </div>
        }
      />
    );
  }
}
