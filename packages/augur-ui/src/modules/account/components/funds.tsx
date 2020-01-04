import React from 'react';
import classNames from 'classnames';

import { MovementLabel, LinearPropertyLabel } from 'modules/common/labels';
import { DaiLogoIcon } from 'modules/common/icons';
import {
  AVAILABLE_TRADING_BALANCE,
  TOTAL_FROZEN_FUNDS,
  TOTAL_ACCOUNT_VALUE_IN_DAI,
} from 'modules/common/constants';
import { SizeTypes } from 'modules/types';

import Styles from 'modules/account/components/funds.styles.less';

export interface FundsProps {
  totalFrozenFunds: string;
  totalAvailableTradingBalance: string;
  totalAccountValue: string;
  realizedPLPercent: string;
}

const Funds = ({
  totalFrozenFunds,
  totalAvailableTradingBalance,
  totalAccountValue,
  realizedPLPercent,
}: FundsProps) => {
  const tradingBalanceFrozenFunds = [
    {
      title: AVAILABLE_TRADING_BALANCE,
      value: totalAvailableTradingBalance,
    },
    {
      title: TOTAL_FROZEN_FUNDS,
      value: totalFrozenFunds,
    },
  ];

  return (
    <section className={Styles.Funds}>
      <div>{TOTAL_ACCOUNT_VALUE_IN_DAI}</div>
      <MovementLabel
        showColors
        size={SizeTypes.LARGE}
        showPlusMinus
        showPercent
        showIcon
        showBrackets
        value={Number(realizedPLPercent)}
      />
      <div>
        {totalAccountValue}
        {DaiLogoIcon}
      </div>

      <FundDataRow
        className={Styles.BalanceFrozenFunds}
        columns={tradingBalanceFrozenFunds}
        showDaiLogo
        linear
      />
    </section>
  );
};

export interface FundDataRowProps {
  className: string;
  columns: Array<any>;
  showRepLogo?: boolean;
  showDaiLogo?: boolean;
  linear?: boolean;
}

const FundDataRow = (props: FundDataRowProps) => {
  const { columns, showRepLogo, showDaiLogo, linear } = props;

  const rows = columns.map((value: any) => (
    <>
      {linear && (
        <span className={props.className}>
          <LinearPropertyLabel value={value.value} label={value.title} />
          <div>{showDaiLogo ? DaiLogoIcon : null}</div>
        </span>
      )}
      {!linear && (
        <div>
          <div>{value.title}</div>
          <div>
            {value.value}
            {showDaiLogo ? DaiLogoIcon : null}
          </div>
        </div>
      )}
    </>
  ));

  return (
    <div
      className={classNames(props.className, {
        [Styles.Linear]: linear,
      })}
    >
      {rows[0]}
      {rows[1]}
    </div>
  );
};

export default Funds;
