import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import ModalNetworkConnect from 'modules/modal/components/modal-network-connect';
import commonStyles from 'modules/modal/common.styles.less';
import type { SDKConfiguration } from '@augurproject/sdk-lite';
import { useAppStatusStore } from 'modules/app/store/app-status';

const ModalNetworkDisconnected = () => {
  const { modal } = useAppStatusStore();
  const [showEnvForm, setShowEnvForm] = useState(false);
  const {
    actions: { setIsReconnectionPaused },
  } = useAppStatusStore();
  const { connection } = modal;
  let nodeTitleText = '';
  let nodeDescriptionText = '';
  if (!connection.isConnected) {
    // ethereumNode disconnected only
    nodeTitleText = ' to Ethereum Node';
    nodeDescriptionText = ' from your Ethereum Node';
  }
  // assemble the text based on disconnections
  const titleText = `Reconnecting${nodeTitleText}`;
  const descriptionText =
    'Please wait while we try to reconnect you, or update your node addresses ';

<<<<<<< HEAD
  return (
    <section className={commonStyles.ModalContainer}>
      {showEnvForm && (
        <ModalNetworkConnect
          submitForm={() => {
            setIsReconnectionPaused(false);
            setShowEnvForm(false);
          }}
          config={modal.config}
        />
      )}
      {!showEnvForm && (
        <>
          <h1>{titleText}</h1>
=======
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
>>>>>>> v2
          <p>
            {`You have been disconnected${nodeDescriptionText}.`}
            <br />
            {descriptionText}
            <button
              onClick={() => {
                setIsReconnectionPaused(!showEnvForm);
                setShowEnvForm(!showEnvForm);
              }}
            >
              here
            </button>
            .
          </p>
          <div className={commonStyles.Loading}>
            <PulseLoader color="#fff" size={8} sizeUnit="px" loading />
          </div>
        </>
      )}
    </section>
  );
};

export default ModalNetworkDisconnected;
