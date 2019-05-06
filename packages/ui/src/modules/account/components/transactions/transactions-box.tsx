import React from "react";

import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import {
  DepositButton,
  WithdrawButton,
  ViewTransactionsButton,
  REPFaucetButton
} from "modules/common-elements/buttons";
import Styles from "modules/account/components/transactions/transactions-box.styles";

interface TransactionsBoxProps {
  isMainnet: boolean;
  eth: number | string;
  rep: number | string;
  gasPrice: string;
  repFaucet: Function;
  deposit: Function;
  withdraw: Function;
  transactions: Function;
}

export const TransactionsBox = (props: TransactionsBoxProps) => (
  <QuadBox
    title="Transactions"
    content={
      <div className={Styles.TransactionsBoxContent}>
        <p>Your transactions history</p>
        <ViewTransactionsButton action={props.transactions} />
        <p>Your wallet</p>
        <DepositButton action={props.deposit} />
        <WithdrawButton action={props.withdraw} />
        {!props.isMainnet && (
          <div>
            <p>REP for test net</p>
            <REPFaucetButton action={props.repFaucet} />
          </div>
        )}
      </div>
    }
  />
);
