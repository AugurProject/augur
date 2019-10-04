import React from 'react';

import { LoadingEllipse } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';

interface LoadingProps {
  shouldClose: boolean;
  message: string;
  callback: Function;
}

export const Loading = ({ shouldClose, callback, message }: LoadingProps) => {
  if (shouldClose) {
    callback();
  }

  return (
    <div className={Styles.Loading}>
      {LoadingEllipse}
      <div>{message}</div>
    </div>
  );
};
