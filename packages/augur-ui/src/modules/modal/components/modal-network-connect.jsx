import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import Input from "modules/common/components/input/input";

import Styles from "modules/modal/components/common/common.styles";
import ModalActions from "modules/modal/components/common/modal-actions";
import { windowRef } from "src/utils/window-ref";
import { editEndpointParams } from "src/utils/edit-endpoint-params";
import { MODAL_NETWORK_CONNECT } from "modules/common-elements/constants";

export default class ModalNetworkConnect extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      isInitialConnection: PropTypes.bool
    }).isRequired,
    env: PropTypes.object.isRequired,
    submitForm: PropTypes.func.isRequired,
    isConnectedThroughWeb3: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    // prioritize ethereumNode connections
    let ethereumNode = "";
    if (props.env["ethereum-node"]) {
      if (props.env["ethereum-node"].ipc) {
        ethereumNode = props.env["ethereum-node"].ipc;
      } else if (props.env["ethereum-node"].ws) {
        ethereumNode = props.env["ethereum-node"].ws;
      } else if (props.env["ethereum-node"].http) {
        ethereumNode = props.env["ethereum-node"].http;
      }
    }

    this.state = {
      augurNode: props.env["augur-node"] || "",
      ethereumNode,
      connectErrors: [],
      formErrors: {
        augurNode: [],
        ethereumNode: []
      }
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
    const { augurNode, ethereumNode } = this.state;
    return !(
      augurNode.length &&
      (ethereumNode.length || isConnectedThroughWeb3)
    );
  }

  submitForm(e) {
    const { submitForm, env } = this.props;
    const { ethereumNode, augurNode } = this.state;
    let ethNode = {};
    const protocol = this.calcProtocol(ethereumNode);
    if (protocol) {
      ethNode = {
        [`${protocol}`]: ethereumNode
      };
    }

    // because we prioritize, lets wipe out all previous connection options but not remove things like timeout.
    const updatedEnv = {
      ...env,
      "augur-node": augurNode,
      "ethereum-node": {
        ...env["ethereum-node"],
        ipc: "",
        http: "",
        ws: "",
        ...ethNode
      }
    };
    const endpoints = {
      augurNode: updatedEnv["augur-node"],
      ethereumNodeHTTP: updatedEnv["ethereum-node"].http,
      ethereumNodeWS: updatedEnv["ethereum-node"].ws
    };

    // reloads window
    editEndpointParams(windowRef, endpoints);

    // this.props.submitForm used as a hook for disconnection modal, normally just preventsDefault
    submitForm(e);
  }

  render() {
    const { isConnectedThroughWeb3, modal } = this.props;
    const { formErrors, connectErrors, augurNode, ethereumNode } = this.state;
    const AugurNodeInValid = formErrors.augurNode.length > 0;
    const ethereumNodeInValid = formErrors.ethereumNode.length > 0;
    const hasConnectionErrors = connectErrors.length > 0;
    const formInvalid = this.isFormInvalid();

    return (
      <form
        className={classNames(Styles.ModalForm, {
          [`${Styles.ModalContainer}`]: modal.type === MODAL_NETWORK_CONNECT
        })}
      >
        <h1>Connect to Augur</h1>
        <label htmlFor="modal__augurNode-input">Augur Node Address:</label>
        <Input
          id="modal__augurNode-input"
          type="text"
          className={classNames({
            [`${Styles.ErrorField}`]: AugurNodeInValid
          })}
          value={augurNode}
          placeholder="Enter the augurNode address you would like to connect to."
          onChange={value => this.validateField("augurNode", value)}
          required
        />
        {AugurNodeInValid &&
          formErrors.augurNode.map(error => (
            <p key={error} className={Styles.Error}>
              {InputErrorIcon()} {error}
            </p>
          ))}
        <label htmlFor="modal__ethNode-input">Ethereum Node address:</label>
        {isConnectedThroughWeb3 && (
          <div>
            You are already connected to an Ethereum Node through Metamask. If
            you would like to specify a node, please disable Metamask.
          </div>
        )}
        {!isConnectedThroughWeb3 && (
          <Input
            id="modal__ethNode-input"
            type="text"
            className={classNames({
              [`${Styles.ErrorField}`]: ethereumNodeInValid
            })}
            value={ethereumNode}
            placeholder="Enter the Ethereum Node address you would like to connect to."
            onChange={value => this.validateField("ethereumNode", value)}
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
        {hasConnectionErrors &&
          connectErrors.map(error => (
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
              action: this.submitForm
            }
          ]}
        />
      </form>
    );
  }
}
