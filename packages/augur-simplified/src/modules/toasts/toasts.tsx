import React, { useState } from 'react';
import classNames from 'classnames';

import Styles from './toasts.styles.less';
import { CloseIcon, FailedX, ConfirmedCheck } from '../common/icons';
import { ReceiptLink } from '../routes/helpers/links';

export const Toasts = () => {
  const [confirmed, setConfirmed] = useState(true);
  return (
    <article
      className={classNames(Styles.Toast, {
        [Styles.Confirmed]: confirmed,
        [Styles.Failed]: !confirmed,
      })}
    >
      <span>{confirmed ? ConfirmedCheck : FailedX} {confirmed ? 'Confirmed' : 'Failed'}</span>
      <p>Claimed $24.32 in winnings.</p>
      <button onClick={() => setConfirmed(!confirmed)}>{CloseIcon}</button>
      <ReceiptLink txId="0xdeadbeef" />
    </article>
  );
};
