import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import Styles from './toasts.styles.less';
import { CloseIcon, FailedX, ConfirmedCheck } from '../common/icons';
import { ReceiptLink } from '../routes/helpers/links';

const MockToasts = [
  {
    txId: '0xdeadbeef',
    status: 'CONFIRMED',
    marketDescription: "Extra long COVID-19 related market that has a very long name that requires us to cut it off because it's way to big to show on one line cuz it's a massive run on sentance with some bad grammar.",
    message: 'Claimed $24.32 in winnings.',
    lastUpdated: new Date().getTime(),
    seen: false,
  },
  {
    txId: '0xdeadbeef2',
    status: 'FAILED',
    marketDescription: "short market name that won't need to wrap.",
    message: 'Claimed $85.90 in winnings.',
    lastUpdated: new Date().getTime(),
    seen: false,
  }
];

export const Toasts = () => {
  const [toasts, updateToasts] = useState(MockToasts.sort((a, b) => a.lastUpdated - b.lastUpdated).filter(t => !t.seen));
  const numToastsToSee = toasts.length;
  return (
    <>
      {numToastsToSee > 0 && (
        <Toast
          toast={toasts.find(t => !t.seen)}
          key={`toast-4-${toasts.find(t => !t.seen).txId}`}
          markAsSeen={(toast) => {
            let updates = toasts;
            const toastIndex= updates.findIndex(t => t.txId === toast.txId);
            updates[toastIndex].seen = true;
            updates = updates.filter(t => !t.seen);
            updateToasts(updates);
          }}
        />
      )}
    </>
  );
};

const Toast = ({ toast, markAsSeen }) => {
  const confirmed = toast.status === 'CONFIRMED';

  useEffect(() => {
    const curToast = toast;
    if (!curToast.seen) {
      const hide = setTimeout(() => {
        markAsSeen(curToast);
      }, 4000);

      return () => {
        clearTimeout(hide);
      }
    }
    return undefined;
    // eslint-disable-next-line
  }, []);

  return (
    <article
      className={classNames(Styles.Toast, {
        [Styles.Confirmed]: confirmed,
        [Styles.Failed]: !confirmed,
      })}
    >
      <span>
        {confirmed ? ConfirmedCheck : FailedX}{' '}
        {confirmed ? 'Confirmed' : 'Failed'}
      </span>
      <p>{toast.message}</p>
      <h4>{toast.marketDescription}</h4>
      <button onClick={() => markAsSeen(toast)}>{CloseIcon}</button>
      <ReceiptLink txId={toast.txId} />
    </article>
  );
};
