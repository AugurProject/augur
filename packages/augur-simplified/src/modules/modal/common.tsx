import React from 'react';

import Styles from './modal.styles.less';
import { Icons, useAppStatusStore } from '@augurproject/augur-comps';

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
      <button onClick={() => closeModal()}>{Icons.CloseIcon}</button>
    </div>
  );
};
