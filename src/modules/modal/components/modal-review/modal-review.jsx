import React from "react";
import PropTypes from "prop-types";

import ModalReceipt from "modules/modal/components/common/modal-receipt";
import ModalActions from "modules/modal/components/common/modal-actions";

import Styles from "modules/modal/components/common/common.styles";

const ModalReview = p => (
  <section className={Styles.ModalReview}>
    <h1>{p.title}</h1>
    <ModalReceipt items={p.items} />
    <ModalActions buttons={p.buttons} />
  </section>
);

ModalReview.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  buttons: PropTypes.array.isRequired
};

export default ModalReview;
