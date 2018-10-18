import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalNetworkConnect from "modules/modal/containers/modal-network-connect";
import ModalLoading from "modules/modal/components/common/modal-loading";

import commonStyles from "modules/modal/components/common/common.styles";

import getValue from "utils/get-value";

export default class ModalNetworkDisconnected extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      env: PropTypes.object.isRequired,
      connection: PropTypes.object.isRequired
    }).isRequired,
    updateIsReconnectionPaused: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showEnvForm: false
    };

    this.showForm = this.showForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  showForm(e) {
    const { updateIsReconnectionPaused } = this.props;
    this.setState({ showEnvForm: !this.state.showEnvForm });
    // if the form is going to be shown, we pass true to pause reconnection
    updateIsReconnectionPaused(!this.state.showEnvForm);
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
    const s = this.state;
    const connectionStatus = getValue(this.props, "modal.connection");
    let nodeTitleText = "";
    let nodeDescriptionText = "";
    if (
      connectionStatus.isConnected &&
      !connectionStatus.isConnectedToAugurNode
    ) {
      // augurNode disconnected only
      nodeTitleText = " to Augur Node";
      nodeDescriptionText = " from your Augur Node";
    }
    if (
      !connectionStatus.isConnected &&
      connectionStatus.isConnectedToAugurNode
    ) {
      // ethereumNode disconnected only
      nodeTitleText = " to Ethereum Node";
      nodeDescriptionText = " from your Ethereum Node";
    }
    // assemble the text based on disconnections
    const titleText = `Reconnecting${nodeTitleText}`;
    const descriptionText = `Please wait while we try to reconnect you, or update your node addresses `;

    return (
      <section className={commonStyles.ModalContainer}>
        {!s.showEnvForm && <h1>{titleText}</h1>}
        {!s.showEnvForm && (
          <p>
            {`You have been disconnected${nodeDescriptionText}.`}
            <br />
            {descriptionText}
            <button onClick={this.showForm}>here</button>.
          </p>
        )}
        {!s.showEnvForm && <ModalLoading />}
        {s.showEnvForm && (
          <ModalNetworkConnect submitForm={this.submitForm} env={modal.env} />
        )}
      </section>
    );
  }
}
