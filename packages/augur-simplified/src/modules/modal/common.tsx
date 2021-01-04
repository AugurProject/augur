import React from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { CloseIcon } from '../common/icons';
import { useAppStatusStore } from '../stores/app-status';

export const Header = ({ title }) => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <div className={Styles.Header}>
      <span>{title}</span>
      <button onClick={() => closeModal()}>{CloseIcon}</button>
    </div>
  );
};
