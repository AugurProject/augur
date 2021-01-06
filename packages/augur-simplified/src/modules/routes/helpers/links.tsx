import React from 'react';
import { Link } from 'react-router-dom';

import makePath from 'modules/routes/helpers/make-path';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET, MARKETS, MARKET_ID_PARAM_NAME } from 'modules/constants';
import { useAppStatusStore } from 'modules/stores/app-status';

interface MarketLinkProps {
  id: string;
  ammId?: string;
  children?: any;
}

const RECEIPT_LINKS = {
  42: 'https://kovan.etherscan.io/tx/',
  1: 'https://etherscan.io/tx/',
};

const ADDRESS_LINKS = {
  42: 'https://kovan.etherscan.io/address/',
  1: 'https://etherscan.io/address/',
};

export const MarketsLink = ({ children, id }: MarketLinkProps) => (
  <Link
    data-testid={`marketsLink-${id}`}
    to={{
      pathname: makePath(MARKETS),
    }}
  >
    {children}
  </Link>
);

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

interface ExternalLinkProps {
  URL: string;
  label: string;
}

export const ExternalLink = ({ URL, label }: ExternalLinkProps) => (
  <a
    key={`${URL}-${label}`}
    href={URL}
    target="_blank"
    rel="noopener noreferrer"
  >
    {label}
  </a>
);

interface ReceiptLinkProps {
  txId: string;
  label?: string;
}

export const ReceiptLink = ({ txId, label = 'Receipt' }: ReceiptLinkProps) => {
  const {
    paraConfig: { networkId },
  } = useAppStatusStore();
  const URL = `${RECEIPT_LINKS[networkId] || RECEIPT_LINKS[1]}${txId}`;
  return <ExternalLink {...{ URL, label }} />;
};

interface AccountLinkProps {
  account: string;
}

export const AddressLink = ({ account }: AccountLinkProps) => {
  const {
    paraConfig: { networkId },
  } = useAppStatusStore();
  const URL = `${ADDRESS_LINKS[networkId] || ADDRESS_LINKS[1]}${account}`;
  return <ExternalLink {...{ URL, label: account }} />;
};
