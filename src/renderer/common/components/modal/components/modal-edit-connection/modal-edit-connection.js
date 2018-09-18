import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "./modal-edit-connection.styles.less";
import ModalDeleteConnection from "../../containers/modal-delete-connection";

export default class ModalEditConnection extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    initialConnection: PropTypes.object,
    addUpdateConnection: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    connections: PropTypes.object.isRequired,
    updateConfig: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      connection: {
        name: (props.initialConnection ? props.initialConnection.name : ''),
        http: (props.initialConnection ? props.initialConnection.http : ''),
        ws: (props.initialConnection ? props.initialConnection.ws : ''),
        userCreated: true,
        selected: this.props.initialConnection ? this.props.initialConnection.selected : false,
      },
      validations: {},
      showDelete: false,
    };

    this.closeModal = this.closeModal.bind(this)
    this.updateField = this.updateField.bind(this)
    this.saveConnection = this.saveConnection.bind(this)
    this.delete = this.delete.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialConnection !== this.props.initialConnection) {
      const connection = {
        name: this.props.initialConnection ? this.props.initialConnection.name : '',
        http: this.props.initialConnection ? this.props.initialConnection.http : '',
        name: this.props.initialConnection ? this.props.initialConnection.ws : '',
        userCreated: true,
        selected: this.props.initialConnection ? this.props.initialConnection.selected : false,
      }
      this.setState({connection: connection})
    }
  }

  saveConnection(e) {
    const key = this.props.initialConnection ? this.props.initialConnection.key : this.state.connection.name
    if (!this.props.initialConnection) { // for add new animation
      this.props.updateConfig({animateKey: this.state.connection.name})
    }
    this.props.addUpdateConnection(key, this.state.connection)
    this.closeModal(e)
    e.stopPropagation()
  }

  validateField(name, value) {
    const { connections } = this.props
    let { validations, disableButton } = this.state
    const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

    if (name === 'name') {
      const nameRepeat = (Object.values(connections || [])).find(network => network.name.toLowerCase() === value.toLowerCase())
      if (nameRepeat) {
        validations[name] = 'Name already in use'
      } else {
        delete validations[name]
      }
    } else if (name === 'http') {
      if (value !== '' && !value.match(urlRegex)) {
        validations[name] = 'Not a valid HTTP Endpoint'
      } else {
        delete validations[name]
      }
    } else if (name === 'ws') {
      if (value !== '' && !value.match(urlRegex)) {
        validations[name] = 'Not a valid Websocket Endpoint'
      } else {
        delete validations[name]
      }
    }

    this.setState({validations})
  }

  updateField(name, value) {
    this.validateField(name, value)
    const { connection } = this.state
    connection[name] = value
    this.setState({connection: connection})
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  delete(e) {
    this.setState({showDelete: !this.state.showDelete})
    e.stopPropagation()
  }

  render() {
    const { initialConnection } = this.props;
    const {
      connection,
      validations,
      showDelete,
    } = this.state

    let enableButton = (connection.name !== '' && (connection.ws !== '' || connection.http !== '' ))
    if ( validations.name ) {
      enableButton = false
    }
    return (
      <section id="editModal" className={Styles.ModalEditConnection}>
        { initialConnection &&
          <div
            className={classNames(Styles.ModalEditConnection__smallBg, {
              [Styles['ModalEditConnection__smallBg-show']]: showDelete
            })}
          >
            <ModalDeleteConnection closeModal={this.delete} closeModalFully={this.closeModal} keyId={initialConnection.key} />
          </div>
        }

        <div className={Styles.ModalEditConnection__container}>
          <div className={Styles.ModalEditConnection__header}>
            <div className={Styles.ModalEditConnection__title}> { initialConnection ? 'Edit Connection' : 'Add Connection' } </div>
            { initialConnection &&
              <div className={Styles.ModalEditConnection__delete} onClick={this.delete} />
            }
          </div>
          <div className={Styles.ModalEditConnection__subheader}>
            Only one endpoint (HTTP or Websocket) is required.
          </div>
          <div className={Styles.ModalEditConnection__label}>
              Connection Name
          </div>
          <div className={Styles.ModalEditConnection__inputContainer}>
              <input
                  onChange={e => {
                    this.updateField("name", e.target.value);
                  }}
                  className={classNames(Styles.ModalEditConnection__input, {
                     [Styles['ModalEditConnection__inputError']]: validations.name
                  })}
                  value={connection.name}
              />
              {validations.name &&
                <div className={Styles.ModalEditConnection__errorMessage}>{validations.name}</div>
              }
          </div>
          <div className={Styles.ModalEditConnection__label}>
              HTTP(S) Endpoint
          </div>
          <div className={Styles.ModalEditConnection__inputContainer}>
              <input
                  onChange={e => {
                    this.updateField("http", e.target.value);
                  }}
                  value={connection.http}
                  className={classNames(Styles.ModalEditConnection__input, {
                     [Styles['ModalEditConnection__inputError']]: validations.http
                  })}
                  placeholder="http(s)://"
              />
              {validations.http &&
                <div className={Styles.ModalEditConnection__errorMessage}>{validations.http}</div>
              }
          </div>
          <div className={Styles.ModalEditConnection__label}>
              Websocket Endpoint
          </div>
          <div className={Styles.ModalEditConnection__inputContainer}>
              <input
                  onChange={e => {
                    this.updateField("ws", e.target.value);
                  }}
                  value={connection.ws}
                  className={classNames(Styles.ModalEditConnection__input, {
                     [Styles['ModalEditConnection__inputError']]: validations.ws
                  })}
                  placeholder="ws://"
              />
              {validations.ws &&
                <div className={Styles.ModalEditConnection__errorMessage}>{validations.ws}</div>
              }
          </div>
          <div className={Styles.ModalEditConnection__buttonContainer}>
              <div className={Styles.ModalEditConnection__cancel} onClick={this.closeModal}>Cancel</div>
              <button className={Styles.ModalEditConnection__save} onClick={this.saveConnection} disabled={!enableButton}>Save Connection</button>
          </div>
        </div>
      </section>
    )
  }
}
