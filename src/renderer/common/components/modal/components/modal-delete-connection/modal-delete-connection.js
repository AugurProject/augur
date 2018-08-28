import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "./modal-delete-connection.styles.less";

export default class ModalDeleteConnection extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    closeModalFully: PropTypes.func.isRequired,
    keyId: PropTypes.string.isRequired,
    removeConnection: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this)
    this.delete = this.delete.bind(this)
  }

  closeModal(e) {
    this.props.closeModal(e)
    e.stopPropagation()
  }

  delete(e) {
    this.props.removeConnection(this.props.keyId)
    this.props.closeModalFully(e)
    e.stopPropagation()
  }

  render() {
    return (
      <section id="deleteModal" className={Styles.ModalDeleteConnection}>
        <div className={Styles.ModalDeleteConnection__container}>
          <div className={Styles.ModalDeleteConnection__header}>
            Delete Connection
          </div>
          <div className={Styles.ModalDeleteConnection__subheader}>
            Deleting your custom connection will remove it permanently. 
          </div>
          <div className={Styles.ModalDeleteConnection__buttonContainer}>
              <div className={Styles.ModalDeleteConnection__cancel} onClick={this.closeModal}>Cancel</div>
              <div className={Styles.ModalDeleteConnection__save} onClick={this.delete}>Delete</div>
          </div>
        </div>
      </section>
    )
  }
}
