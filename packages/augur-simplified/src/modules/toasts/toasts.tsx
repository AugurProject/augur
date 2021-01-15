import React, { useEffect } from 'react';
import classNames from 'classnames';

import Styles from './toasts.styles.less';
import { CloseIcon, FailedX, ConfirmedCheck } from '../common/icons';
import { ReceiptLink } from '../routes/helpers/links';
import { useAppStatusStore } from '../stores/app-status';
import { TX_STATUS } from '../constants';

export const Toasts = () => {
  const {
    transactions,
    actions: { updateTransaction },
  } = useAppStatusStore();
  const toasts = transactions.sort((a,b) => a.timestamp - b.timestamp)
    .filter(t => !t.seen)
    .filter(t => t.status !== TX_STATUS.PENDING);
  const numToastsToSee = toasts.length;
  return (
    <>
      {numToastsToSee > 0 && (
        <Toast
          toast={toasts.find(t => !t.seen)}
          key={`toast-4-${toasts.find(t => !t.seen).hash}`}
          markAsSeen={(toast) => {
            let updates = toasts;
            const toastIndex= updates.findIndex(t => t.hash === toast.hash);
            const update = updates[toastIndex];
            update.seen = true;
            updateTransaction(update.hash, update);
          }}
        />
      )}
    </>
  );
};


const Toast = ({ toast, markAsSeen }) => {
  const confirmed = toast.status === TX_STATUS.CONFIRMED;

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
      <ReceiptLink hash={toast.hash} />
    </article>
  );
};
