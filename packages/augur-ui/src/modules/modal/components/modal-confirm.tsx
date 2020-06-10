import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Styles from 'modules/modal/common.styles.less';

type ModalAction = (...args: Array<any>) => any;

interface ModalConfirm {
  closeModal: ModalAction;
  description: Array<string>;
  title: string;
  submitAction: ModalAction;
  cancelButtonText?: string;
  submitButtonText?: string;
  cancelAction?: ModalAction;
}

const ModalConfirm = ({
  closeModal,
  description,
  title,
  submitAction,
  cancelButtonText = 'cancel',
  submitButtonText = 'submit',
  cancelAction,
}: ModalConfirm) => (
  <section className={Styles.ModalContainer}>
    <h1>{title}</h1>
    {description.map(text => (
      <p key={text} className={Styles.Description}>
        {ReactHtmlParser(text)}
      </p>
    ))}
    <div className={Styles.ActionButtons}>
      <button
        className={Styles.Secondary}
        onClick={() => cancelAction || closeModal}
      >
        {cancelButtonText}
      </button>
      <button
        className={Styles.Primary}
        onClick={() => submitAction()}
      >
        {submitButtonText}
      </button>
    </div>
  </section>
);

export default ModalConfirm;
