import React from 'react';

import QuadBox from 'modules/portfolio/components/common/quad-box';
import {
  DepositButton,
  WithdrawButton,
  ViewTransactionsButton,
  REPFaucetButton,
  DAIFaucetButton,
  ApprovalButton,
} from 'modules/common/buttons';
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
}

export const Transactions = ({
  transactions,
  addFunds,
  withdraw,
  showFaucets,
  repFaucet,
  daiFaucet,
  legacyRepFaucet,
}: TransactionsProps) => (
  <QuadBox
    title="Transactions"
    content={
      <div className={Styles.Content}>
        <p>Your transactions history</p>
        <ViewTransactionsButton action={transactions} />
        <p>Your account</p>
        <DepositButton action={addFunds} />
        <WithdrawButton action={withdraw} />
        {showFaucets && (
          <div>
            <p>REP for test net</p>
            <REPFaucetButton action={repFaucet} />
          </div>
        )}
        {showFaucets && (
          <div>
            <p>Legacy REP</p>
            <REPFaucetButton
              title="Legacy REP Faucet"
              action={legacyRepFaucet}
            />
          </div>
        )}
        {showFaucets &&  (
          <div>
            <p>DAI for test net</p>
            <DAIFaucetButton action={daiFaucet} />
          </div>
        )}
      </div>
    }
  />
);
