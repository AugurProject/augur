import React, { Component } from "react";
import classNames from "classnames";

import { InputErrorIcon } from "modules/common/icons";
import { Input } from "modules/common/form";
import Styles from "modules/modal/components/common/common.styles.less";
import ModalActions from "modules/modal/components/common/modal-actions";
import { windowRef } from "utils/window-ref";
import { editEndpointParams } from "utils/edit-endpoint-params";
import { MODAL_NETWORK_CONNECT } from "modules/common/constants";
import { WindowApp } from "modules/types";
import type { SDKConfiguration } from "@augurproject/artifacts";


interface ModalNetworkConnectProps {
  modal: {
    type: string;
    isInitialConnection?: boolean;
    config: SDKConfiguration;
  };
  submitForm: Function;
  isConnectedThroughWeb3: boolean;
}

interface ModalNetworkConnectState {
  ethereumNode: string;
  connectErrors: Array<string>;
  formErrors: {
    ethereumNode: Array<string>;
  };
  [x: number]: any;
}

export default class ModalNetworkConnect extends Component<ModalNetworkConnectProps, ModalNetworkConnectState> {
  public types: {
    IPC: string;
    HTTP: string;
    WS: string;
  };

  constructor(props) {
    super(props);
    // prioritize ethereumNode connections
    let ethereumNode = "";
    if (props.modal.config.ethereum?.http) {
      ethereumNode = props.modal.config.ethereum?.http;
    }

    this.state = {
      ethereumNode,
      connectErrors: [],
      formErrors: {
        ethereumNode: [],
      },
    };

    this.types = { IPC: "ipc", HTTP: "http", WS: "ws" };

    this.submitForm = this.submitForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
    this.calcProtocol = this.calcProtocol.bind(this);
  }

  calcProtocol(uri) {
    const { types } = this;
    if (typeof uri === "string" && uri.length && uri.includes("://")) {
      if (uri.includes(types.IPC)) return types.IPC;
      if (uri.includes(types.WS)) return types.WS;
      if (uri.includes(types.HTTP)) return types.HTTP;
    }
    return false;
  }

  validateField(field, value) {
    const { formErrors } = this.state;
    const connectErrors = [];
    formErrors[field] = [];

    if (!value || value.length === 0)
      formErrors[field].push(`This field is required.`);

    this.setState({ connectErrors, formErrors, [field]: value });
  }

  isFormInvalid() {
    const { isConnectedThroughWeb3 } = this.props;
    const { ethereumNode } = this.state;
    return !(
      (ethereumNode.length || isConnectedThroughWeb3)
    );
  }

  submitForm(e) {
    const { submitForm, env } = this.props;
    const { ethereumNode } = this.state;
    let ethNode = {};
    const protocol = this.calcProtocol(ethereumNode);
    if (protocol) {
      ethNode = {
        [`${protocol}`]: ethereumNode,
      };
    }

    // because we prioritize, lets wipe out all previous connection options but not remove things like timeout.
    const updatedEnv = {
      ...env,
      "ethereum": {
        ...env["ethereum"],
        http: "",
        ...ethNode,
      },
    };
    const endpoints = {
      ethereumNodeHTTP: updatedEnv["ethereum"]?.http,
      ethereumNodeWS: null
    };

    // reloads window
    editEndpointParams(windowRef as WindowApp, endpoints);

    // this.props.submitForm used as a hook for disconnection modal, normally just preventsDefault
    submitForm(e);
  }

  render() {
    const { isConnectedThroughWeb3, modal } = this.props;
    const { formErrors, connectErrors, ethereumNode } = this.state;
    const ethereumNodeInValid = formErrors.ethereumNode.length > 0;
    const hasConnectionErrors = connectErrors.length > 0;
    const formInvalid = this.isFormInvalid();

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
            You are already connected to an Ethereum Node through Metamask. If
            you would like to specify a node, please disable Metamask.
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
            onChange={(value) => this.validateField("ethereumNode", value)}
            required
          />
        )}
        {!isConnectedThroughWeb3 &&
          ethereumNodeInValid &&
          formErrors.ethereumNode.map((error) => (
            <p key={error} className={Styles.Error}>
              {InputErrorIcon()} {error}
            </p>
          ))}
        {hasConnectionErrors &&
          connectErrors.map((error) => (
            <p key={error} className={Styles.Error}>
              {InputErrorIcon()} {error}
            </p>
          ))}
        <ModalActions
          buttons={[
            {
              label: "Connect",
              isDisabled: formInvalid,
              type: "purple",
              action: this.submitForm,
            },
          ]}
        />
      </form>
    );
  }
}
