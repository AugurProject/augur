import React from 'react';

import Styles from './modal.styles.less';
import * as Icons from '../common/icons';

const { CloseIcon } = Icons;

export const Header = ({
  title,
  subtitle = { value: null, label: null },
  closeModal,
}) => {
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
