import React from 'react';
import classNames from 'classnames';

import Styles from './error-message.styles.less';

interface ErrorMessageProps {
  type?: string;
  message: string;
}

export const ErrorMessage = ({ type, message }: ErrorMessageProps) => {
  return (
    <span
      className={classNames(Styles.ErrorMessage, {
        [Styles.error]: type === 'error',
      })}
    >
      {message}
    </span>
  );
};
