import React from 'react';
import { Link } from 'react-router-dom';

import makePath from 'modules/routes/helpers/make-path';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET, MARKET_ID_PARAM_NAME } from 'modules/constants';
import { useAppStatusStore } from 'modules/stores/app-status';

interface MarketLinkProps {
  id: string;
  ammId?: string;
  children?: any;
}

const RECEIPT_LINKS = {
  [42]: 'kovan.etherscan.com?t=',
  [1]: 'www.etherscan.com?t=',
};

export const MarketLink = ({ id, ammId, children }: MarketLinkProps) => {
  const idString = `${id}${ammId ? '-' + ammId : ''}`;
  return (
    <Link
      data-testid={`link-${idString}`}
      to={{
        pathname: makePath(MARKET),
        search: makeQuery({
          [MARKET_ID_PARAM_NAME]: idString,
        }),
      }}
    >
      {children}
    </Link>
  );
};

export const ExternalLink = ({ URL, label }) => (
  <a href={URL} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
);

export const RecieptLink = ({ txId, label = 'Receipt' }) => {
  const { paraConfig: { networkId } } = useAppStatusStore();
  const URL = `${RECEIPT_LINKS[networkId] || RECEIPT_LINKS[1]}${txId}`;
  return <ExternalLink {...{ URL, label }} />;
};
