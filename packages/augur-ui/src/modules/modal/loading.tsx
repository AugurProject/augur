import React, { useState, useEffect } from 'react';

import { LoadingEllipse, DirectionArrow } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import CommentStyles from 'modules/modal/common.styles.less';
import { CloseButton, ExternalLinkButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';

const FIFTEEN_SECONDS = 15000;

export const Loading = () => {
  const { isLogged, ethToDaiRate, modal, loginAccount, actions: {closeModal} } = useAppStatusStore();
  const shouldClose = isLogged && loginAccount.meta && !loginAccount.meta.preloaded && ethToDaiRate;
  const {
    message,
    callback,
    showMetaMaskHelper,
    showCloseAfterDelay,
    showLearnMore
  } = modal;
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
        <article onClick={() => setshowHelper(false)} className={CommentStyles.ModalMetaMaskFinder}>
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
