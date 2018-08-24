import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalEditConnection from "../modal-edit-connection/modal-edit-connection";
// import { Close } from "modules/common/components/icons";

// import debounce from "utils/debounce";
// import getValue from "utils/get-value";

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

    // this.updateModalDimensions = this.updateModalDimensions.bind(this);
    // this.debounceUpdateModalDimensions = debounce(
    //   this.updateModalDimensions.bind(this)
    // );
  }

  componentDidMount() {
    this.updateModalDimensions();

   // window.addEventListener("resize", this.debouncedSetQRSize);
  }

  updateModalDimensions() {
    // this.setState({
    //   modalWidth: getValue(this, "modal.clientWidth") || 0,
    //   modalHeight: getValue(this, "modal.clientHeight") || 0
    // });
  }

  render() {
    const { closeModal, modal } = this.props;
    console.log('hi')
    return (
      <section
        ref={modal => {
          this.modal = modal;
        }}
        className={Styles.ModalView}
      >
        <div className={Styles.ModalView__content}>
          {modal.type === TYPES.MODAL_EDIT_CONNECTION && (
            <ModalEditConnection {...modal} />
          )}
        </div>
      </section>
    );
  }
}
