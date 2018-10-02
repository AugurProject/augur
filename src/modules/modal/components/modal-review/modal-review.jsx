import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalReceipt from "modules/modal/components/common/modal-receipt";
import ModalActions from "modules/modal/components/common/modal-actions";
import { MODAL_REVIEW } from "modules/modal/constants/modal-types";

import Styles from "modules/modal/components/common/common.styles";
// if this is a review modal, then apply the overall wrapper css, otherwise it should be wrapped already.
const ModalReview = p => (
  <section
    className={classNames({
      [`${Styles.ModalContainer}`]: p.type === MODAL_REVIEW
    })}
  >
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
