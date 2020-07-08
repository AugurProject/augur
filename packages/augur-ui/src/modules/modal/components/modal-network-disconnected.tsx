import React, { Component } from 'react';

import ModalNetworkConnect from 'modules/modal/containers/modal-network-connect';
import ModalLoading from 'modules/modal/components/common/modal-loading';

import commonStyles from 'modules/modal/components/common/common.styles.less';

import getValue from 'utils/get-value';
import type { SDKConfiguration } from '@augurproject/artifacts';

interface ModalNetworkDisconnectedProps {
  modal: {
    config: SDKConfiguration;
    connection: object;
  };
  updateIsReconnectionPaused: Function;
}

interface ModalNetworkDisconnectedState {
  [x: number]: any;
  showEnvForm: boolean;
}

export default class ModalNetworkDisconnected extends Component<ModalNetworkDisconnectedProps, ModalNetworkDisconnectedState> {
  state = {
    showEnvForm: false,
  };

  constructor(props) {
    super(props);

    this.showForm = this.showForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  showForm(e) {
    const { updateIsReconnectionPaused } = this.props;
    const { showEnvForm } = this.state;
    this.setState({ showEnvForm: !showEnvForm });
    // if the form is going to be shown, we pass true to pause reconnection
    updateIsReconnectionPaused(!showEnvForm);
  }

  submitForm(e, env) {
    const { updateIsReconnectionPaused } = this.props;
    // unpause reconnection
    updateIsReconnectionPaused(false);
    this.setState({ showEnvForm: false });
  }

  updateField(field, value) {
    this.setState({ [field]: value });
  }

  render() {
    const { modal } = this.props;
    const { showEnvForm } = this.state;
    const connectionStatus = getValue(this.props, 'modal.connection');
    let nodeTitleText = '';
    let nodeDescriptionText = '';
    if (
      !connectionStatus.isConnected
    ) {
      // ethereumNode disconnected only
      nodeTitleText = ' to Ethereum Node';
      nodeDescriptionText = ' from your Ethereum Node';
    }
    // assemble the text based on disconnections
    const titleText = `Reconnecting${nodeTitleText}`;
    const descriptionText = 'Please wait while being reconnected, or update your node addresses ';

    return (
      <section className={commonStyles.ModalContainer}>
        {!showEnvForm && <h1>{titleText}</h1>}
        {!showEnvForm && (
          <p>
            {`You have been disconnected${nodeDescriptionText}.`}
            <br />
            {descriptionText}
            <button onClick={this.showForm}>here</button>.
          </p>
        )}
        {!showEnvForm && <ModalLoading />}
        {showEnvForm && (
          <ModalNetworkConnect submitForm={this.submitForm} config={modal.config} />
        )}
      </section>
    );
  }
}
