import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalReceipt from "modules/modal/components/common/modal-receipt";
import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";
import { MODAL_REVIEW } from "modules/modal/constants/modal-types";

import Styles from "modules/modal/components/common/common.styles";
// if this is a review modal, then apply the overall wrapper css, otherwise it should be wrapped already.
const ModalReview = ({ title, items, buttons, description, type }) => (
  <section
    className={classNames({
      [`${Styles.ModalContainer}`]: type === MODAL_REVIEW
    })}
  >
    <h1>{title}</h1>
    <ModalReceipt items={items} />
    {description.length > 0 &&
      description.map(text => <ModalDescription text={text} key={text} />)}
    <ModalActions buttons={buttons} />
  </section>
);

ModalReview.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  buttons: PropTypes.array.isRequired,
  description: PropTypes.array,
  type: PropTypes.string
};

ModalReview.defaultProps = {
  description: [],
  type: ""
};

export default ModalReview;
