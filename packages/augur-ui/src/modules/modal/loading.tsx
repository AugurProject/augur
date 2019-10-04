import React, { useState } from 'react';

import ModalMetaMaskFinder from './components/common/modal-metamask-finder';
import { LoadingEllipse } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';

interface LoadingProps {
  shouldClose: boolean;
  message: string;
  showMetaMaskHelper: boolean;
  callback: Function;
}

export const Loading = ({ showMetaMaskHelper, shouldClose, callback, message }: LoadingProps) => {
  if (shouldClose) {
    callback();
  }

  const [showHelper, setshowHelper] = useState(showMetaMaskHelper);

  return (
    <div className={Styles.Loading}>
      {showHelper && <ModalMetaMaskFinder handleClick={() => setshowHelper(false)} />}
      {LoadingEllipse}
      <div>{message}</div>
    </div>
  );
};
