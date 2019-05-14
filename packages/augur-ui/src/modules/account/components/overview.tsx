import React from "react";

import {
  YOUR_OVERVIEW_TITLE,
  TIMEFRAME_OPTIONS
} from "modules/common-elements/constants";
import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import { PillSelection } from "modules/common-elements/selection";
import Funds from "modules/account/containers/funds";
import Stats from "modules/account/containers/stats";
import AccountOverviewChart from "modules/account/containers/account-overview-chart";
import Styles from "modules/account/components/overview.styles";

export interface AccountOverviewProps {
  currentAugurTimestamp: number;
  updateTimeframeData: Function;
}

interface AccountOverviewState {
  selected: number;
}

export default class AccountOverview extends React.Component<
  AccountOverviewProps,
  AccountOverviewState
> {
  state: AccountOverviewState = {
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
            <AccountOverviewChart timeframe={selected} />
          </div>
        }
      />
    );
  }
}
