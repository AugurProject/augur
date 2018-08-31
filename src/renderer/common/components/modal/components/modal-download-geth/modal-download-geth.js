import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "./modal-download-geth.styles.less";

export default class ModalDownloadGeth extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this)
    this.download = this.download.bind(this)
  }

  closeModal(e) {
    this.props.closeModal(e)
    e.stopPropagation()
  }

  download(e) {
    this.props.download(e)
    e.stopPropagation()
  }

  render() {
    return (
      <section id="gethModal" className={Styles.ModalDownloadGeth}>
        <div className={Styles.ModalDownloadGeth__container}>
          <div className={Styles.ModalDownloadGeth__header}>
            Approve Geth Light Node Use?
          </div>
          <div className={Styles.ModalDownloadGeth__subheader}>
            Connecting to Local (Light Node) requires you to use Geth Light Node. For your convenience, we have provided a version.
          </div>
          <div className={Styles.ModalDownloadGeth__buttonContainer}>
              <div className={Styles.ModalDownloadGeth__cancel} onClick={this.closeModal}>Cancel</div>
              <div className={Styles.ModalDownloadGeth__save} onClick={this.download}>Download</div>
          </div>
        </div>
      </section>
    )
  }
}
