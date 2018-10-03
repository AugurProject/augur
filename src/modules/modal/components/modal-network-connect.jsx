import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import Input from "modules/common/components/input/input";

import Styles from "modules/modal/components/common/common.styles";
import ModalActions from "modules/modal/components/common/modal-actions";
import { windowRef } from "src/utils/window-ref";
import { editEndpointParams } from "src/utils/edit-endpoint-params";
import { MODAL_NETWORK_CONNECT } from "modules/modal/constants/modal-types";

export default class ModalNetworkConnect extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      isInitialConnection: PropTypes.bool
    }),
    env: PropTypes.object,
    connection: PropTypes.object,
    submitForm: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    updateEnv: PropTypes.func.isRequired,
    connectAugur: PropTypes.func.isRequired,
    isAugurJSVersionsEqual: PropTypes.func.isRequired,
    isConnectedThroughWeb3: PropTypes.bool
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
    const p = this.props;
    let ethNode = {};
    const protocol = this.calcProtocol(this.state.ethereumNode);
    if (protocol) {
      ethNode = {
        [`${protocol}`]: this.state.ethereumNode
      };
    }

    // because we prioritize, lets wipe out all previous connection options but not remove things like timeout.
    const updatedEnv = {
      ...this.props.env,
      "augur-node": this.state.augurNode,
      "ethereum-node": {
        ...this.props.env["ethereum-node"],
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

    // p.submitForm used as a hook for disconnection modal, normally just preventsDefault
    p.submitForm(e);
  }

  render() {
    const { isConnectedThroughWeb3, modal } = this.props;
    const s = this.state;
    const AugurNodeInValid = s.formErrors.augurNode.length > 0;
    const ethereumNodeInValid = s.formErrors.ethereumNode.length > 0;
    const hasConnectionErrors = s.connectErrors.length > 0;
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
          value={s.augurNode}
          placeholder="Enter the augurNode address you would like to connect to."
          onChange={value => this.validateField("augurNode", value)}
          required
        />
        {AugurNodeInValid &&
          s.formErrors.augurNode.map(error => (
            <p key={error} className={Styles.Error}>
              {InputErrorIcon} {error}
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
            value={s.ethereumNode}
            placeholder="Enter the Ethereum Node address you would like to connect to."
            onChange={value => this.validateField("ethereumNode", value)}
            required
          />
        )}
        {!isConnectedThroughWeb3 &&
          ethereumNodeInValid &&
          s.formErrors.ethereumNode.map(error => (
            <p key={error} className={Styles.Error}>
              {InputErrorIcon} {error}
            </p>
          ))}
        {hasConnectionErrors &&
          s.connectErrors.map(error => (
            <p key={error} className={Styles.Error}>
              {InputErrorIcon} {error}
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
