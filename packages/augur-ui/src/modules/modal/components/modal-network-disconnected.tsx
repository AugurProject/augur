import React, { useState } from 'react';

import ModalNetworkConnect from 'modules/modal/containers/modal-network-connect';
import ModalLoading from 'modules/modal/components/common/modal-loading';

import commonStyles from 'modules/modal/components/common/common.styles.less';

import { SDKConfiguration } from '@augurproject/artifacts';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface ModalNetworkDisconnectedProps {
  modal: {
    config: SDKConfiguration;
    connection: { 
      isConnected: boolean;
    };
  };
}

const ModalNetworkDisconnected = ({
  modal,
}: ModalNetworkDisconnectedProps) => {
  const [showEnvForm, setShowEnvForm] = useState(false);
  const { actions: { setIsReconnectionPaused } } = useAppStatusStore();
  const { connection } = modal;
  let nodeTitleText = '';
  let nodeDescriptionText = '';
  if (
    !connection.isConnected
  ) {
    // ethereumNode disconnected only
    nodeTitleText = ' to Ethereum Node';
    nodeDescriptionText = ' from your Ethereum Node';
  }
  // assemble the text based on disconnections
  const titleText = `Reconnecting${nodeTitleText}`;
  const descriptionText = 'Please wait while we try to reconnect you, or update your node addresses ';

  return (
    <section className={commonStyles.ModalContainer}>
      {!showEnvForm && <h1>{titleText}</h1>}
      {!showEnvForm && (
        <p>
          {`You have been disconnected${nodeDescriptionText}.`}
          <br />
          {descriptionText}
          <button onClick={() => {
            setIsReconnectionPaused(!showEnvForm);
            setShowEnvForm(!showEnvForm); 
          }}>here</button>.
        </p>
      )}
      {!showEnvForm && <ModalLoading />}
      {showEnvForm && (
        <ModalNetworkConnect submitForm={() => {
          setIsReconnectionPaused(false);
          setShowEnvForm(false); 
        }} config={modal.config} />
      )}
    </section>
  );
};

export default ModalNetworkDisconnected;
