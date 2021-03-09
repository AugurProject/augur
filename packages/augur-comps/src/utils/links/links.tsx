import React from 'react';
import { Link } from 'react-router-dom';

import makePath from './make-path';
import makeQuery from './make-query';
import { MARKET, MARKETS, MARKET_ID_PARAM_NAME } from '../constants';
import { PARA_CONFIG } from '../../stores/constants';

interface MarketLinkProps {
  id: string;
  ammId?: string;
  children?: any;
  dontGoToMarket?: boolean;
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
export const createMarketAmmId = (id, ammId) => {
  return `${id}${ammId ? '-' + ammId : ''}`;
};

export const MarketLink = ({
  id,
  ammId,
  dontGoToMarket,
  children,
}: MarketLinkProps) => {
  const idString = createMarketAmmId(id, ammId);
  return (
    <>
      {!dontGoToMarket ? (
        <Link
          data-testid={`link-${idString}`}
          to={
            !dontGoToMarket
              ? {
                  pathname: makePath(MARKET),
                  search: makeQuery({
                    [MARKET_ID_PARAM_NAME]: idString,
                  }),
                }
              : null
          }
        >
          {children}
        </Link>
      ) : (
        <section>{children}</section>
      )}
    </>
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
  hash: string;
  label?: string;
}

export const ReceiptLink = ({ hash, label = 'View Txn' }: ReceiptLinkProps) => {
  const URL = `${RECEIPT_LINKS[PARA_CONFIG.networkId] || RECEIPT_LINKS[1]}${hash}`;
  return <ExternalLink {...{ URL, label }} />;
};

interface AccountLinkProps {
  account: string;
  short?: boolean;
}

export const AddressLink = ({ account, short = false }: AccountLinkProps) => {
  const label = short
    ? `${account.slice(0, 6)}...${account.slice(38, 42)}`
    : account;
  const URL = `${ADDRESS_LINKS[PARA_CONFIG.networkId] || ADDRESS_LINKS[1]}${account}`;
  return <ExternalLink {...{ URL, label }} />;
};
