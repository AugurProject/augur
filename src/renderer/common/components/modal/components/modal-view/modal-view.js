import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalEditConnection from "../../containers/modal-edit-connection";
import ModalDeleteConnection from "../../containers/modal-delete-connection";
import * as TYPES from "../../constants/modal-types";
import Styles from "./modal-view.styles.less";

export default class ModalView extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modalWidth: 0,
      modalHeight: 0
    };

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const { modal } = this.props;

    if (modal.type === TYPES.MODAL_DELETE_CONNECTION) {
      return (
        <section
          id="modal"
          ref={modal => {
            this.modal = modal;
          }}
          className={
            classNames(
              Styles.ModalView, 
              {[Styles.ModalView__hide]: (Object.keys(modal).length === 0)},
            )
          }
        >
          <div onClick={this.closeModal} className={Styles.ModalView__close} />
          <div className={Styles.ModalView__content}>
            <ModalEditConnection closeModal={this.closeModal} {...modal} />
            <div className={Styles.ModalView__smallBg}>
              <ModalDeleteConnection closeModal={this.closeModal} {...modal} />
            </div>
          </div>
        </section>
      )
    }
    return (
      <section
        id="modal"
        ref={modal => {
          this.modal = modal;
        }}
        className={
          classNames(
            Styles.ModalView, 
            {[Styles.ModalView__hide]: (Object.keys(modal).length === 0)},
            {[Styles.ModalView__small]: (modal.type === TYPES.MODAL_DELETE_CONNECTION)},
          )
        }
      >
        { modal.type === TYPES.MODAL_EDIT_CONNECTION && <div onClick={this.closeModal} className={Styles.ModalView__close} /> }
        <div className={Styles.ModalView__content}>
          {modal.type === TYPES.MODAL_EDIT_CONNECTION && (
            <ModalEditConnection closeModal={this.closeModal} {...modal} />
          )}
        </div>
      </section>
    );
  }
}
