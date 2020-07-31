import React from 'react';

import QuadBox from 'modules/portfolio/components/common/quad-box';
import {
  DepositButton,
  TransferButton,
  WithdrawButton,
  ViewTransactionsButton,
  REPFaucetButton,
  DAIFaucetButton,
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
  transfer: Function;
  transactions: Function;
  approval: Function;
  addFunds: Function;
  legacyRepFaucet: Function;
  cashOut: Function;
  targetAddress: string;
  signingEth: number;
  signingWalletNoEth: boolean;
  localLabel: string;
}

export const Transactions = ({
  transactions,
  addFunds,
  transfer,
  showFaucets,
  repFaucet,
  daiFaucet,
  legacyRepFaucet,
  cashOut,
  targetAddress,
  signingEth,
  signingWalletNoEth,
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
          <TransferButton action={transfer} />
        </div>
        {showFaucets && (
          <div>
            <h4>REPv2 for test net</h4>
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
        {showFaucets && signingWalletNoEth && (
          <div>
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
      </div>
    }
  />
);
