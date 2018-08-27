import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "./modal-edit-connection.styles.less";

export default class ModalEditConnection extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    initialConnection: PropTypes.object,
    addUpdateConnection: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      connection: {
        name: '',
        https: '',
        ws: '',
        userCreated: true
      },
    };

    this.closeModal = this.closeModal.bind(this)
    this.updateField = this.updateField.bind(this)
    this.saveConnection = this.saveConnection.bind(this)
  }

  saveConnection(e) {
    console.log(this.state.connection)
    this.props.addUpdateConnection(this.state.connection.name, this.state.connection)
    this.closeModal(e)
  }

  updateField(name, value) {
    // need to validate
    const { connection } = this.state
    connection[name] = value
    this.setState({connection: connection})
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const { initialConnection } = this.props;
    const { connection } = this.state

    return (
      <section id="editModal" className={Styles.ModalEditConnection}>
        <div>{initialConnection ? 'Edit Connection' : 'Add Connection'}</div>
        <div>
            Connection Name
        </div>
        <div>
            <input 
                onChange={e => {
                  this.updateField("name", e.target.value);
                }} 
                value={connection.name}
            />
        </div>
        <div>
            HTTP Endpoint
        </div>
        <div>
            <input 
                onChange={e => {
                  this.updateField("https", e.target.value);
                }}
                value={connection.https} 
                placeholder="http(s)://" 
            />
        </div>
        <div>
            Websocket Endpoint
        </div>
        <div>
            <input 
                onChange={e => {
                  this.updateField("ws", e.target.value);
                }}
                value={connection.ws} 
                placeholder="ws://"
            />
        </div>
        <div>
            <div onClick={this.closeModal}>Cancel</div>
            <div onClick={this.saveConnection}>Save Connection</div>
        </div>
      </section>
    )
  }
}
