import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ParticipationTokensView from 'modules/reporting/containers/participation-tokens-view';

interface DisputingProps {
  isConnected: boolean;
  loadDisputeWindow: Function;
}
export default class Disputing extends Component<DisputingProps> {
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
    return (
      <section>  
        <ParticipationTokensView />
      </section>
    );
  }
}
