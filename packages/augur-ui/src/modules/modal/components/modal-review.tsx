import React from 'react';
import classNames from 'classnames';
import ReactHtmlParser from "react-html-parser";
import ModalActions from 'modules/modal/components/common/modal-actions';
import { MODAL_REVIEW } from 'modules/common/constants';

import Styles from 'modules/modal/components/common/common.styles.less';
// if this is a review modal, then apply the overall wrapper css, otherwise it should be wrapped already.

interface ModalReviewProps {
  title: string;
  items: any[];
  buttons: any[];
  description?: string[];
  type?: string;
}

const ModalReview: React.FC<ModalReviewProps> = ({
  title,
  items,
  buttons,
  description,
  type,
}) => (
  <section
    className={classNames({
      [`${Styles.ModalContainer}`]: type === MODAL_REVIEW,
    })}
  >
    <h1>{title}</h1>
    <ul className={Styles.Receipt}>
      {items.map(item => (
        <li key={item.label}>
          <label>{item.label}</label>
          <span>
            {item.value}
            {item.denomination !== '' && <span>{item.denomination}</span>}
          </span>
        </li>
      ))}
    </ul>
    {description.length > 0 &&
      description.map(text => (
        <p key={text} className={Styles.Description}>
          {ReactHtmlParser(text)}
        </p>
      ))}
    <ModalActions buttons={buttons} />
  </section>
);

ModalReview.defaultProps = {
  description: [],
  type: '',
};

export default ModalReview;
