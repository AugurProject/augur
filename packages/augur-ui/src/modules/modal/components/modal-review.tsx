import React from "react";
import classNames from "classnames";

import ModalReceipt from "modules/modal/components/common/modal-receipt";
import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";
import { MODAL_REVIEW } from "modules/common/constants";

import Styles from "modules/modal/components/common/common.styles.less";
// if this is a review modal, then apply the overall wrapper css, otherwise it should be wrapped already.

interface ModalReviewProps {
  title: string;
  items: any[];
  buttons: any[];
  description?: string[];
  type?: string;
}

const ModalReview: React.FC<ModalReviewProps> = ({ title, items, buttons, description, type }) => (
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

ModalReview.defaultProps = {
  description: [],
  type: ""
}

export default ModalReview;
