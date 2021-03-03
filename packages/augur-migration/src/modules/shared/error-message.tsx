import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';

import Styles from './error-message.styles.less';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { PARA_CONFIG } from '../stores/constants';
import { useUserStore } from '../stores/user';

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


export const NetworkMismatchBanner = () => {
  const { loginAccount } = useUserStore();
  const { error } = useWeb3React();
  const { networkId } = PARA_CONFIG;
  const { chainId } = loginAccount || {};
  const isNetworkMismatch = useMemo(
    () => !!chainId && String(networkId) !== String(chainId),
    [chainId, networkId]
  );
  const unsupportedChainIdError = error && error instanceof UnsupportedChainIdError;

  useEffect(() => {
    // in the event of an error, scroll to top to force banner to be seen.
    if (isNetworkMismatch || unsupportedChainIdError) {
      document.getElementById('mainContent')?.scrollTo(0, 0);
      window.scrollTo(0, 1);
    }
  }, [isNetworkMismatch, unsupportedChainIdError]);

  return (
    <>
      {(isNetworkMismatch || unsupportedChainIdError) && (
        <article
          className={Styles.NetworkMismatch}
        >
          You're connected to an unsupported network
        </article>
      )}
    </>
  );
};