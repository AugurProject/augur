/* eslint react/prop-types: 0 */
import React from "react";

import {
  DefaultButtonProps,
  CancelTextButton,
  SubmitTextButton,
} from "modules/common/buttons";
import {
  Title,
  DescriptionProps,
  Description,
  ButtonsRow,
  MarketTitle,
  Breakdown,
} from "modules/modal/common";
import {
  LinearPropertyLabelProps,
} from "modules/common/labels";
import { BID, CATEGORICAL } from "modules/common/constants";
import { formatShares, formatEther } from "utils/format-number";
import Styles from "modules/modal/modal.styles.less";
import OpenOrdersTable from "modules/market/components/market-orders-positions-table/open-orders-table";

interface UnsignedOrdersProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  description: DescriptionProps;
  breakdown: Array<LinearPropertyLabelProps>;
  loginAccount: object;
  bnAllowance: object;
  header: Array<string>;
  liquidity: object;
  marketTitle: string;
  marketId: string;
  numTicks: string;
  minPrice: object;
  maxPrice: object;
  outcomes: Array<string>;
  marketType: string;
  sendLiquidityOrder: Function;
  removeLiquidityOrder: Function;
  scalarDenomination: string;
  openOrders: boolean;
}

interface Order {
  outcomeName: string;
  type: string;
  quantity: string;
  price: string;
  orderEstimate: string;
  index: number;
}

const orderRow = (order: Order, props: UnsignedOrdersProps) => {
  const { outcomeName, type, quantity, price, orderEstimate, index } = order;
  const {
    removeLiquidityOrder,
    sendLiquidityOrder,
    marketId,
    marketType,
    numTicks,
    maxPrice,
    minPrice,
    outcomes,
    bnAllowance,
    loginAccount,
  } = props;
  const outcomeId = marketType === CATEGORICAL ? outcomeName : 1;
  const buttons = [
    {
      text: "cancel",
      action: () =>
        removeLiquidityOrder({
          marketId,
          outcomeId,
          orderId: index,
        }),
    },
    {
      text: "submit",
      action: () =>
        sendLiquidityOrder({
          marketId,
          marketType,
          order,
          marketOutcomesArray: outcomes,
          minPrice,
          maxPrice,
          numTicks,
          orderId: index,
          bnAllowance,
          loginAccount,
          orderCB: () => {},
          seriesCB: () => {},
          outcome: outcomeId,
        }),
    },
  ];
  return (
    <div key={`${outcomeName}-${price}-${index}`}>
      <span>{outcomeName}</span>
      <span className={type === BID ? Styles.bid : Styles.ask}>{type}</span>
      <span>{formatShares(quantity).formatted}</span>
      <span>{formatEther(Number(price)).formatted}</span>
      <span>{formatEther(Number(orderEstimate)).formatted}</span>
      <div>
        {buttons.map((Button: DefaultButtonProps, index: number) => {
          if (index === 0)
            return <CancelTextButton key={Button.text} {...Button} />;
          return <SubmitTextButton key={Button.text} {...Button} />;
        })}
      </div>
    </div>
  );
};

export const UnsignedOrders = (props: UnsignedOrdersProps) => (
  <div className={Styles.Orders}>
    <Title title={props.title} closeAction={props.closeAction} />
    <main>
      {/*
        // @ts-ignore */}
      <Description description={props.description} />
      <MarketTitle title={props.marketTitle} />
      {props.header && (
        <div className={Styles.Orders__header}>
          {props.header.map((headerLabel: string) => (
            <span key={headerLabel}>{headerLabel}</span>
          ))}
        </div>
      )}
      {props.outcomes && (
        <section>
          {props.outcomes.map((outcome: string) =>
            props.liquidity[outcome].map((order: Order) =>
              orderRow(order, props)
            )
          )}
        </section>
      )}
      {props.openOrders && (
        // @ts-ignore
        <OpenOrdersTable openOrders={props.orders} />
      )}
      {props.breakdown && <Breakdown rows={props.breakdown} short />}
    </main>
    <ButtonsRow buttons={props.buttons} />
  </div>
);
