import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalReceipt from "modules/modal/components/common/modal-receipt";
import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";
import { MODAL_REVIEW } from "modules/common-elements/constants";

import Styles from "modules/modal/components/common/common.styles.less";
// if this is a review modal, then apply the overall wrapper css, otherwise it should be wrapped already.

interface ModalReviewProps {
  title: string;
  items: Array<any>;
  buttons: Array<any>;
  description?: Array<string>;
  type?: string;
}

const ModalReview = ({ title, items, buttons, description = [], type = "" }: ModalReviewProps) => (
  <section
    className={classNames({
      [`${Styles.ModalContainer}`]: type === MODAL_REVIEW,
    })}
  >
    <h1>{title}</h1>
    <ModalReceipt items={items} />
    {description.length > 0 &&
      description.map((text) => <ModalDescription text={text} key={text} />)}
    <ModalActions buttons={buttons} />
  </section>
);

export default ModalReview;
