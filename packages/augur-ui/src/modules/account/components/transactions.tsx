import React from 'react';

import QuadBox from 'modules/portfolio/components/common/quad-box';
import {
  DepositButton,
  WithdrawButton,
  ViewTransactionsButton,
  REPFaucetButton,
  DAIFaucetButton,
  FundGSNWalletButton,
  ExternalLinkButton,
} from 'modules/common/buttons';
import { AccountAddressDisplay } from 'modules/modal/common';
import { toChecksumAddress } from 'ethereumjs-util';
import Styles from 'modules/account/components/transactions.styles.less';

interface TransactionsProps {
  showFaucets: boolean;
  repFaucet: Function;
  daiFaucet: Function;
  deposit: Function;
  withdraw: Function;
  transactions: Function;
  approval: Function;
  addFunds: Function;
  legacyRepFaucet: Function;
  fundGsnWallet: Function;
  targetAddress: string;
  signingEth: number;
  gsnCreated: boolean;
  localLabel: string;
}

export const Transactions = ({
  transactions,
  addFunds,
  withdraw,
  showFaucets,
  repFaucet,
  daiFaucet,
  legacyRepFaucet,
  fundGsnWallet,
  targetAddress,
  signingEth,
  gsnCreated,
  localLabel
}: TransactionsProps) => (
  <QuadBox
    title="Transactions"
    content={
      <div className={Styles.Content}>
        <div>
          <h4>Your transactions history</h4>
          <ViewTransactionsButton action={transactions} />
        </div>
        <div>
          <h4>Your funds</h4>
          <DepositButton action={addFunds} />
          <WithdrawButton action={withdraw} />
        </div>
        {!gsnCreated && (
          <div>
            <h4>Fund GSN Wallet</h4>
            <FundGSNWalletButton
              action={fundGsnWallet}
              disabled={signingEth === 0}
              title={signingEth === 0 ? 'Get ETH to fund GSN Wallet' : 'Click to Fund GSN Wallet'}
            />
            <ExternalLinkButton
              URL={!localLabel ? "https://faucet.kovan.network/" : null}
              showNonLink={!!localLabel}
              label={localLabel ? localLabel : "faucet.kovan.network"}
            />
            <AccountAddressDisplay
              copyable
              address={targetAddress ? toChecksumAddress(targetAddress) : 'loading...'}
            />
          </div>
        )}
        {showFaucets && (
          <div>
            <h4>REP for test net</h4>
            <h4>DAI for test net</h4>
            <REPFaucetButton action={repFaucet} />
            <DAIFaucetButton action={daiFaucet} />
          </div>
        )}
        {showFaucets && (
          <div>
            <h4>Legacy REP</h4>
            <REPFaucetButton
              title="Legacy REP Faucet"
              action={legacyRepFaucet}
            />
          </div>
        )}
      </div>
    }
  />
);
