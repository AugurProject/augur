import React from "react";
import classNames from "classnames";

import {
  MovementLabel,
  LinearPropertyLabel,
} from "modules/common-elements/labels";
import { DaiLogoIcon, RepLogoIcon } from "modules/common-elements/icons";
import {
  AVAILABLE_TRADING_BALANCE,
  TOTAL_FROZEN_FUNDS,
  REP_BALANCE,
  REP_STAKED,
  TOTAL_ACCOUNT_VALUE_IN_ETH,
} from "modules/common-elements/constants";

import Styles from "modules/account/components/funds.styles";

export interface FundsProps {
  repStaked: number;
  repBalance: string;
  totalFrozenFunds: string;
  totalAvailableTradingBalance: string;
  totalAccountValue: string;
  realizedPLPercent: string;
}

const Funds = (props: FundsProps) => {
  const {
    totalFrozenFunds,
    totalAvailableTradingBalance,
    totalAccountValue,
    repBalance,
    repStaked,
    realizedPLPercent
  } = props;

  const tradingBalanceFrozenFunds = [
    {
      title: AVAILABLE_TRADING_BALANCE,
      value: totalAvailableTradingBalance
    },
    {
      title: TOTAL_FROZEN_FUNDS,
      value: totalFrozenFunds
    }
  ];

  const repBalanceStaked = [
    {
      title: REP_BALANCE,
      value: repBalance
    },
    {
      title: REP_STAKED,
      value: repStaked
    }
  ];

  return (
    <section className={Styles.Funds}>
      <div>{TOTAL_ACCOUNT_VALUE_IN_ETH}</div>
      <MovementLabel
        showColors
        size="large"
        showPlusMinus
        showPercent
        showIcon
        showBrackets
        value={realizedPLPercent}
      />
      <div>
        {totalAccountValue}
        {DaiLogoIcon}
      </div>

      <FundDataRow
        className={Styles.BalanceFrozenFunds}
        columns={tradingBalanceFrozenFunds}
        showDaiLogo
        changeForMobile
      />
      <div>
        <FundDataRow
          className={Styles.RepBalanceStaked}
          columns={repBalanceStaked}
          showRepLogo
        />
      </div>
    </section>
  );
};

export interface FundDataRowProps {
  className: string;
  columns: Array<any>;
  showRepLogo?: boolean;
  showDaiLogo?: boolean;
  changeForMobile?: boolean;
}

const FundDataRow = (props: FundDataRowProps) => {
  const { columns, showRepLogo, showDaiLogo, changeForMobile } = props;

  const rows = columns.map((value: any) => (
    <>
      {changeForMobile && (
        <span className={classNames(props.className, Styles.ShowOnMobile)}>
          <LinearPropertyLabel value={value.value} label={value.title} />
          <div>{showDaiLogo ? DaiLogoIcon : null}</div>
        </span>
      )}
      <div className={classNames({ [Styles.HideOnMobile]: changeForMobile })}>
        <div>{value.title}</div>
        <div>
          {value.value}
          {showDaiLogo ? DaiLogoIcon : null}
        </div>
      </div>
    </>
  ));

  return (
    <div
      className={classNames(props.className, {
        [Styles.ChangeForMobile]: changeForMobile
      })}
    >
      {rows[0]}
      {showRepLogo ? <div>{RepLogoIcon}</div> : null}
      {rows[1]}
    </div>
  );
};

export default Funds;
