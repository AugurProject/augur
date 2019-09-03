import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface ReportingDisputeProps {
  isConnected: boolean;
  loadDisputeWindow: Function;
}
export default class ReportingDispute extends Component<ReportingDisputeProps> {
  static propTypes = {};

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
    return <section>Dispute</section>;
  }
}
