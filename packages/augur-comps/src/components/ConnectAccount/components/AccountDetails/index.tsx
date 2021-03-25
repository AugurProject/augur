import React, {useEffect, useState} from 'react';
import {CheckCircle, XCircle} from 'react-feather';
import CopyHelper from './CopyHelper';
import {getEtherscanLink, shortenAddress} from '../../utils';
import {injected, walletlink} from '../../connectors';
import {SUPPORTED_WALLETS} from '../../constants';
import {useActiveWeb3React} from '../../hooks';
import Styles from './index.less';
import classNames from 'classnames';
import {TinyButton} from '../../../common/buttons';
import {Spinner} from '../../../common/spinner';
import {GetWalletIcon} from '../../../common/get-wallet-icon';
import {AbstractConnector} from '@web3-react/abstract-connector';
import { TX_STATUS } from '../../../../utils/constants';
import { LinkIcon } from '../../../common/icons';
import { ChainId } from '@uniswap/sdk';

export interface AccountCardProps {
  account: string;
  connector: AbstractConnector;
  connectorName: string;
  chainId: ChainId;
}

const AccountCard = ({
  account,
  connector,
  connectorName,
  chainId,
}: AccountCardProps) => {
  return (
    <div className={Styles.AccountCard}>
      <div>
        <span>{connectorName}</span>
      </div>
      <div>
        <GetWalletIcon
          connector={connector}
          account={account}
          showPortisButton
        />
        <h3>{account && shortenAddress(account)}</h3>
      </div>
      <div>
        {account && (
          <CopyHelper toCopy={account} copyText='Copy Address' />
        )}
        {chainId && account && (
          <TinyButton
            href={getEtherscanLink(chainId, account, 'address')}
            icon={LinkIcon}
            text='View on Etherscan'
          />
        )}
      </div>
    </div>
  )
}

const GetStatusIcon = (transactionStatus: string) => {
  if (transactionStatus === 'PENDING') {
    return <span><Spinner /></span>;
  } else if (transactionStatus === 'FAILURE') {
    return <span className={Styles.Failure}><XCircle size={16} /></span>;
  } else if (transactionStatus === 'CONFIRMED') {
    return <span className={Styles.Success}><CheckCircle size={16} /></span>;
  } else {
    return null;
  }
};

const Transaction = ({label, link, status, chainId}) => (
  <div>
    <span>{label}</span>
    {link && <a
      href={getEtherscanLink(chainId, link, 'transaction')}
      target='_blank'
      rel='noopener noreferrer'
    >
      {LinkIcon}
    </a>}
    {!link && <div/>}
    {GetStatusIcon(status)}
  </div>
);


const Transactions = ({transactions, removeTransaction, chainId}) => {
  const [clear, setClear ] = useState(false);
  const [userTransactions, setUserTransactions ] = useState(transactions.sort((a,b) => b.timestamp - a.timestamp));

  useEffect(() => {
    const handleClear = () => {
      // Remove all transaction that aren't PENDING
      const transactionsToRemove = transactions
        .filter(tx => [TX_STATUS.CONFIRMED, TX_STATUS.FAILURE].includes(tx.status))
        .map(tx => tx.hash);

      setUserTransactions(userTransactions.filter(tx => !transactionsToRemove.includes(tx.hash)).sort((a,b) => b.timestamp - a.timestamp))
      if (transactionsToRemove) {
        transactionsToRemove.forEach(tx => {
          removeTransaction(tx);
        });
        setClear(false);
      }
    }

    if (clear) {
      handleClear();
    }
  }, [removeTransaction, transactions, clear, setClear, userTransactions]);

  const canClear = userTransactions.filter(tx => [TX_STATUS.CONFIRMED, TX_STATUS.FAILURE].includes(tx.status)).length > 0;

  return userTransactions.length === 0 ? (
    <span>Your Transactions will appear here</span>
  ) : (
    <div className={Styles.Transactions}>
      <div>
        <span>Recent Transactions</span>
        <span onClick={() => canClear ? setClear(true) : null}>{canClear && 'Clear All'}</span>
      </div>
      <div className={Styles.TransactionList}>
        {
          userTransactions.map(({message, hash, status}, index) => (
            <Transaction
              key={index}
              label={message}
              link={hash}
              status={status}
              chainId={chainId}
            />
          ))
        }
      </div>
    </div>
  )
}

const formatConnectorName = (connector) => {
  const ethereum = window['ethereum']
  const isMetaMask = !!(ethereum && ethereum.isMetaMask)
  return 'Connected with ' + Object.keys(SUPPORTED_WALLETS)
    .filter(
      k =>
        SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
    )
    .map(k => SUPPORTED_WALLETS[k].name)[0];
}

export interface AccountDetailsProps {
  openOptions: Function;
  darkMode: boolean;
  transactions: object[];
  removeTransaction: Function;
  logout: Function;
}

export const AccountDetails = ({
  openOptions,
  darkMode,
  transactions,
  removeTransaction,
  logout,
}: AccountDetailsProps) => {
  const { chainId, account, connector } = useActiveWeb3React();
  const [connectorName, setConnectorName] = useState(formatConnectorName(connector));
  const { deactivate } = useActiveWeb3React();

  useEffect(() => {
    setConnectorName(formatConnectorName(connector));
  }, [account, connector, transactions]);

  return (
    <div className={classNames(Styles.AccountDetails, {
      [Styles.DarkMode]: darkMode
    })}>
      <section className={Styles.Content}>
        <AccountCard
          account={account}
          connector={connector}
          connectorName={connectorName}
          chainId={chainId}
        />
      </section>
      <section>
        <TinyButton
          action={() => openOptions()}
          text='Switch Wallet'
        />
        {connector !== injected && connector !== walletlink && (
          <TinyButton
            action={() => (connector as any).close()}
            text='Sign Out'
          />
        )}
        {connector === injected && connector !== walletlink && (
          <TinyButton
            action={() => {
              logout();
              // setTimeout allows lastUser localStorage to be cleared before calling deactivate,
              // otherwise the autologin seems to overide our deactivate call.
              setTimeout(() => {
                deactivate();
              });
            }}
            text='Sign Out'
          />
        )}
      </section>
      <footer>
        <Transactions chainId={chainId} removeTransaction={removeTransaction} transactions={transactions} />
      </footer>
    </div>
  )
}

