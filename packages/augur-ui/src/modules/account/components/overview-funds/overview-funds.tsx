import React from "react";
import classNames from "classnames";

import {
  MovementLabel,
  LinearPropertyLabel
} from "modules/common-elements/labels";
import { EthIcon, RepLogoIcon } from "modules/common-elements/icons";
import {
  AVAILABLE_TRADING_BALANCE,
  TOTAL_FROZEN_FUNDS,
  REP_BALANCE,
  REP_STAKED,
  TOTAL_ACCOUNT_VALUE_IN_ETH
} from "modules/common-elements/constants";

import Styles from "modules/account/components/overview-funds/overview-funds.styles";

export interface OverviewFundsProps {
  repStaked: number;
  repBalance: string;
  totalFrozenFunds: string;
  totalAvailableTradingBalance: string;
  totalAccountValue: string;
  realizedPLPercent: string;
}

const OverviewFunds = (props: OverviewFundsProps) => {
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
    <div className={Styles.OverviewFundsContent}>
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
        {EthIcon}
      </div>

      <FundDataRow
        className={Styles.BalanceFrozenFunds}
        columns={tradingBalanceFrozenFunds}
        showRepLogo={false}
        showEthLogo
        changeForMobile
      />
      <div className={Styles.RepBalanceStaked__container}>
        <FundDataRow
          className={Styles.RepBalanceStaked}
          columns={repBalanceStaked}
          showRepLogo
          showEthLogo={false}
        />
      </div>
    </div>
  );
};

export interface FundDataRowProps {
  className: string;
  columns: Array<any>;
  showRepLogo: boolean;
  showEthLogo: boolean;
  changeForMobile: boolean;
}

const FundDataRow = (props: FundDataRowProps) => {
  const { columns, showRepLogo, showEthLogo, changeForMobile } = props;

  const rows = columns.map((value: any) => (
    <>
      {changeForMobile && (
        <span className={classNames(props.className, Styles.ShowOnMobile)}>
          <LinearPropertyLabel value={value.value} label={value.title} />
          <div>{showEthLogo ? EthIcon : null}</div>
        </span>
      )}
      <div className={classNames({ [Styles.HideOnMobile]: changeForMobile })}>
        <div>{value.title}</div>
        <div>
          {value.value}
          {showEthLogo ? EthIcon : null}
        </div>
      </div>
    </>
  ));

  return (
    <div
      className={classNames(props.className, {
        [Styles.OverviewFunds__changeForMobile]: changeForMobile
      })}
    >
      {rows[0]}
      {showRepLogo ? <div>{RepLogoIcon}</div> : null}
      {rows[1]}
    </div>
  );
};

export default OverviewFunds;
