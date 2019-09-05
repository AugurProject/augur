import React, { Component } from 'react';
import MarketsInDispute from "modules/reporting/containers/markets-in-dispute";

interface ReportingDisputeProps {
  isConnected: boolean;
  loadDisputeWindow: Function;
}
export default class ReportingDispute extends Component<ReportingDisputeProps> {
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
    return (
      <section>
        <MarketsInDispute />
      </section>
    );
  }
}
