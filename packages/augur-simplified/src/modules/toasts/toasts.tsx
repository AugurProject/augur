import React from 'react';
import Styles from './toasts.styles.less';
import { CloseIcon } from '../common/icons';
import { ReceiptLink } from '../routes/helpers/links';
// import { useAppStatusStore } from '../stores/app-status';

export const Toasts = () => {
  return (
    <article className={Styles.Toast}>
      <span>Confirmed</span>
      <p>Claimed $24.32 in winnings.</p>
      <button onClick={() => console.log('close toast')}>{CloseIcon}</button>
      <ReceiptLink txId="0xdeadbeef" />
    </article>
  );
};