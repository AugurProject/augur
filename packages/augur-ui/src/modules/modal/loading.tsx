import React, { useState, useEffect } from 'react';

import ModalMetaMaskFinder from './components/common/modal-metamask-finder';
import { LoadingEllipse } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import { CloseButton } from 'modules/common/buttons';

interface LoadingProps {
  shouldClose: boolean;
  message: string;
  showMetaMaskHelper: boolean;
  callback: Function;
  closeModal: Function;
  showCloseAfterDelay?: boolean;
}

const ONE_MINUTES = 60000;

export const Loading = ({
  showMetaMaskHelper,
  shouldClose,
  callback,
  message,
  closeModal,
  showCloseAfterDelay,
}: LoadingProps) => {
  if (shouldClose) {
    callback();
  }

  const [showHelper, setshowHelper] = useState(showMetaMaskHelper);
  const [showAbandon, setshowAbandon] = useState(false);
  let timeoutId = null;

  useEffect(() => {
    if (showCloseAfterDelay) {
      timeoutId = setTimeout(() => {
        setshowAbandon(true);
      }, ONE_MINUTES);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className={Styles.Loading}>
      {showHelper && (
        <ModalMetaMaskFinder handleClick={() => setshowHelper(false)} />
      )}
      {LoadingEllipse}
      <div>{message}</div>
      { showAbandon && <CloseButton action={() => closeModal()} />}
    </div>
  );
};
