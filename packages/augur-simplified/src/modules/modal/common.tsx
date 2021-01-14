import React from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { CloseIcon } from '../common/icons';
import { useAppStatusStore } from '../stores/app-status';

export const Header = ({ title, subtitle }) => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <div className={Styles.Header}>
      <span>{title}</span>
      {subtitle?.value && (
        <div>
          <span>{subtitle.label}</span>
          <span>{subtitle.value}</span>
        </div>
      )}
      <button onClick={() => closeModal()}>{CloseIcon}</button>
    </div>
  );
};
