import React, {useEffect, useState} from 'react';
import {CheckCircle, ExternalLink as LinkIcon, XCircle} from 'react-feather';
import CopyHelper from './CopyHelper';
import {getEtherscanLink, shortenAddress} from '../../utils';
import {injected, walletlink} from '../../connectors';
import {ReactComponent as Close} from '../../assets/x.svg';
import {SUPPORTED_WALLETS} from '../../constants';
import {useActiveWeb3React} from '../../hooks';
import Styles from 'modules/ConnectAccount/components/AccountDetails/index.less';
import classNames from 'classnames';
import {TinyButton} from 'modules/common/buttons';
import {Spinner} from 'modules/common/spinner';
import {GetWalletIcon} from 'modules/common/get-wallet-icon';
import {AbstractConnector} from '@web3-react/abstract-connector';

interface AccountCardProps {
  account: string;
  connector: AbstractConnector;
  connectorName: string;
  chainId: string;
  switchWalletAction: Function;
}

const AccountCard = ({
  account,
  connector,
  connectorName,
  chainId,
  switchWalletAction
}: AccountCardProps) => {
  return (
    <div className={Styles.AccountCard}>
      <div>
        <span>{connectorName}</span>
        {connector !== injected && connector !== walletlink && (
          <TinyButton
            action={() => (connector as any).close()}
            text='Disconnect'
          />
        )}
        <TinyButton
          action={() => switchWalletAction()}
          text='Switch Wallet'
        />
      </div>
      <div>
        <GetWalletIcon
          connector={connector}
          account={account}
          showPortisButton={true}
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
            icon={<LinkIcon size={16} />}
            text='View on Etherscan'
          />
        )}
      </div>
    </div>
  )
}

const GetStatusIcon = (transactionStatus: string) => {
  if (transactionStatus === 'pending') {
    return <span><Spinner /></span>;
  } else if (transactionStatus === 'failure') {
    return <span className={Styles.Failure}><XCircle size={16} /></span>;
  } else if (transactionStatus === 'success') {
    return <span className={Styles.Success}><CheckCircle size={16} /></span>;
  } else {
    return null;
  }
};

const Transaction = ({label, link, status}) => (
  <div>
    <span>{label}</span>
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
    >
      <LinkIcon />
    </a>
    {GetStatusIcon(status)}
  </div>
);

const Transactions = ({transactions}) => {
  return transactions.length === 0 ? ( // TODO: wire up transactions
    <span>Your Transactions will appear here</span>
  ) : (
    <div className={Styles.Transactions}>
      <div>
        <span>Recent Transactions</span>
        <span>Clear all</span>
      </div>
      <div className={Styles.TransactionList}>
        {
          transactions.map(({label, link, status}) => (
            <Transaction
              label={label}
              link={link}
              status={status}
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

interface AccountDetailsProps {
  toggleWalletModal: Function;
  openOptions: Function;
  darkMode: boolean;
}

const AccountDetails = ({
  toggleWalletModal,
  openOptions,
  darkMode,
}: AccountDetailsProps) => {
  const { chainId, account, connector } = useActiveWeb3React();
  const [connectorName, setConnectorName] = useState(formatConnectorName(connector));

  const mockTransactions = [{
    label: 'Work in progress @ 0.40',
    link: '',
    status: 'success',
  }, {
    label: 'Buy 100 yes @ 0.40',
    link: '',
    status: 'failure',
  }, {
    label: 'Buy 100 yes @ 0.40',
    link: '',
    status: 'pending',
  }];

  useEffect(() => {
    setConnectorName(formatConnectorName(connector));
  }, [account, connector]);

  return (
    <div className={classNames(Styles.AccountDetails, {
      [Styles.DarkMode]: darkMode
    })}>
      <header>
        <h2>Account</h2>
        <span onClick={() => toggleWalletModal()}>
          <Close/>
        </span>
      </header>
      <section className={Styles.Content}>
        <AccountCard
          account={account}
          connector={connector}
          connectorName={connectorName}
          chainId={chainId}
          switchWalletAction={openOptions}
        />
      </section>
      <footer>
        <Transactions transactions={mockTransactions} />
      </footer>
    </div>
  )
}

export default AccountDetails;
