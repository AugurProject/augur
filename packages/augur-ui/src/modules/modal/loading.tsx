import React, { useState, useEffect } from 'react';

import { LoadingEllipse, DirectionArrow } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import { CloseButton, ExternalLinkButton } from 'modules/common/buttons';

interface LoadingProps {
  shouldClose: boolean;
  message: string;
  showMetaMaskHelper: boolean;
  callback: Function;
  closeModal: Function;
  showCloseAfterDelay?: boolean;
  showLearnMore?: boolean;
}

const FIFTEEN_SECONDS = 15000;

export const Loading = ({
  showMetaMaskHelper,
  shouldClose,
  callback,
  message,
  closeModal,
  showCloseAfterDelay,
  showLearnMore,
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
      }, FIFTEEN_SECONDS);
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
        <article onClick={() => setshowHelper(false)} className={Styles.ModalMetaMaskFinder}>
          <div>
            <img src="images/metamask-help.png" />
          </div>
          <div>Click the Metamask logo to open your wallet</div>
          <div>{DirectionArrow}</div>
        </article>
      )}
      {LoadingEllipse}
      <div>
        {message}
        { showLearnMore && <ExternalLinkButton URL='https://docs.augur.net/' label={'Learn More'} /> }
      </div>

      { showAbandon && <CloseButton action={() => closeModal()} />}
    </div>
  );
};
