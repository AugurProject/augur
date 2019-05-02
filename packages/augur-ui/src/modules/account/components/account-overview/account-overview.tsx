import React from "react";

import * as constants from "modules/common-elements/constants";
import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import { PillSelection } from "modules/common-elements/selection";
import AccountOverviewFunds from "modules/account/containers/account-overview-funds";
import AccountOverviewStats from "modules/account/containers/account-overview-stats";
import AccountOverviewChart from "modules/account/containers/account-overview-chart";
import Styles from "modules/account/components/account-overview/account-overview.styles";

export interface AccountOverviewProps {}

interface AccountOverviewState {
  selected: number;
  updateTimeSelection: Function;
  currentAugurTimestamp: number;
}

export default class AccountOverview extends React.Component<
  AccountOverviewProps,
  AccountOverviewState
> {
  state: AccountOverviewState = {
    selected: constants.TIMEFRAME_OPTIONS[3].id
  };

  componentDidMount() {
    this.updateTimeSelection(constants.TIMEFRAME_OPTIONS[3].id);
  }

  updateTimeSelection = id => {
    this.setState({ selected: id });
    const period = constants.TIMEFRAME_OPTIONS[id].periodInterval;
    const startTime =
      period === 0 ? null : this.props.currentAugurTimestamp - period;
    this.props.updateTimeframeData({ startTime });
  };

  render() {
    const { selected } = this.state;

    return (
      <QuadBox
        title={constants.YOUR_OVERVIEW_TITLE}
        content={
          <div className={Styles.AccountOverview}>
            <AccountOverviewFunds />
            <div className={Styles.AccountOverview__pillSelector}>
              <PillSelection
                options={constants.TIMEFRAME_OPTIONS}
                defaultSelection={constants.TIMEFRAME_OPTIONS[3].id}
                onChange={this.updateTimeSelection}
              />
            </div>
            <AccountOverviewStats timeframe={selected} />
            <AccountOverviewChart timeframe={selected} />
          </div>
        }
      />
    );
  }
}
