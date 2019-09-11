import React, { Component } from 'react';
import MarketsInDispute from "modules/reporting/containers/markets-in-dispute";
import { WindowProgress } from "modules/common/progress";
import UserRepDisplay from "modules/reporting/containers/user-rep-display";

import ParticipationTokensView from 'modules/reporting/containers/participation-tokens-view';

interface DisputingProps {
  account: object;
  isLogged: boolean;
  isConnected: boolean;
  loadDisputeWindow: Function;
  disputeWindow: object;
  currentTime: number;
}
// TODO: containerize the WindowProgress for disputing.
// TODO: fix fitlers dispute Markets List
export default class Disputing extends Component<DisputingProps> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { isConnected, loadDisputeWindow } = this.props;
    if (isConnected) {
      loadDisputeWindow();
    }
  }

  componentWillUpdate(nextProps) {
    const { isConnected, loadDisputeWindow } = this.props;
    if (nextProps.isConnected !== isConnected) {
      loadDisputeWindow();
    }
  }

  render() {
    const { disputeWindow, currentTime, isLogged, account } = this.props;
    const { startTime, endTime } = disputeWindow;

    return (
      <section>
        <UserRepDisplay />
        <WindowProgress 
          startTime={startTime}
          endTime={endTime}
          currentTime={currentTime}
          title="Current Dispute Window"
          description="A few lines of information explaing the purpose of the Dispute Window"
          countdownLabel="Time Remaining in Window"
        />
        <ParticipationTokensView />
        <MarketsInDispute />
      </section>
    );
  }
}
