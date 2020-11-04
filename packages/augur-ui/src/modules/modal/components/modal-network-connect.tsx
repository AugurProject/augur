import React, { useState } from 'react';
import classNames from 'classnames';

import { InputErrorIcon } from 'modules/common/icons';
import { Input } from 'modules/common/form';
import Styles from 'modules/modal/common.styles.less';
import { windowRef } from 'utils/window-ref';
import { editEndpointParams } from 'utils/edit-endpoint-params';
import { MODAL_NETWORK_CONNECT } from 'modules/common/constants';
import { WindowApp } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { isWeb3Transport } from 'modules/contracts/actions/contractCalls';

interface ModalNetworkConnectProps {
  submitForm: Function;
}

const types = { IPC: 'ipc', HTTP: 'http', WS: 'ws' };

function calcProtocol(uri) {
  if (typeof uri === 'string' && uri.length && uri.includes('://')) {
    if (uri.includes(types.IPC)) return types.IPC;
    if (uri.includes(types.WS)) return types.WS;
    if (uri.includes(types.HTTP)) return types.HTTP;
  }
  return false;
}

function getInitialEthereumNode(env) {
  let ethereumNode = '';
  if (env?.ethereum?.http) {
    ethereumNode = env.ethereum.http;
  }
  return ethereumNode;
}

function isFormInvalid(isConnectedThroughWeb3, ethereumNode) {
  return !(ethereumNode.length || isConnectedThroughWeb3);
}

const ModalNetworkConnect = ({
  submitForm,
}: ModalNetworkConnectProps) => {
  const isConnectedThroughWeb3 = isWeb3Transport();
  const { env, modal } = useAppStatusStore();
  const ethereumNode = getInitialEthereumNode(env);
  const [formErrors, setFormErrors] = useState({ ethereumNode: [] });

  const ethereumNodeInValid = formErrors.ethereumNode.length > 0;
  const formInvalid = isFormInvalid(isConnectedThroughWeb3, ethereumNode);

  function validateEthNode(value) {
    const updatedFormErrors = { ethereumNode: [] };
    if (!value || value.length === 0)
      updatedFormErrors.ethereumNode.push(`This field is required.`);
    setFormErrors(updatedFormErrors);
  }

  function handleSubmitForm(e) {
    let ethNode = {};
    const protocol = calcProtocol(ethereumNode);
    if (protocol) {
      ethNode = {
        [`${protocol}`]: ethereumNode,
      };
    }

    // because we prioritize, lets wipe out all previous connection options but not remove things like timeout.
    const updatedEnv = {
      ...env,
      ethereum: {
        ...env['ethereum'],
        http: '',
        ...ethNode,
      },
    };
    const endpoints = {
      ethereumNodeHTTP: updatedEnv['ethereum']?.http,
      ethereumNodeWS: null,
    };

    // reloads window
    editEndpointParams(windowRef as WindowApp, endpoints);

    // this.props.submitForm used as a hook for disconnection modal, normally just preventsDefault
    !submitForm && e.preventDefault();
    submitForm && submitForm();
  }
  return (
    <form
      className={classNames(Styles.ModalForm, {
        [`${Styles.ModalContainer}`]: modal.type === MODAL_NETWORK_CONNECT,
      })}
    >
      <h1>Connect to Augur</h1>
      <label htmlFor="modal__ethNode-input">Ethereum Node address:</label>
      {isConnectedThroughWeb3 && (
        <div>
          You are already connected to an Ethereum Node through Metamask. If you
          would like to specify a node, please disable Metamask.
        </div>
      )}
      {!isConnectedThroughWeb3 && (
        // @ts-ignore
        <Input
          id="modal__ethNode-input"
          type="text"
          className={classNames({
            [`${Styles.ErrorField}`]: ethereumNodeInValid,
          })}
          value={ethereumNode}
          placeholder="Enter the Ethereum Node address you would like to connect to."
          onChange={value => validateEthNode(value)}
          required
        />
      )}
      {!isConnectedThroughWeb3 &&
        ethereumNodeInValid &&
        formErrors.ethereumNode.map(error => (
          <p key={error} className={Styles.Error}>
            {InputErrorIcon()} {error}
          </p>
        ))}
      <div className={Styles.ActionButtons}>
        <button
          className={Styles.Primary}
          disabled={formInvalid}
          onClick={e => handleSubmitForm(e)}
        >
          Connect
        </button>
      </div>
    </form>
  );
};

export default ModalNetworkConnect;
