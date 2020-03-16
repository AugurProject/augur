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
  LinearPropertyLabelProps, PendingLabel, BulkTxLabel, InsufficientModalLabel,
} from "modules/common/labels";
import { BUY } from "modules/common/constants";
import { formatShares, formatDai } from "utils/format-number";
import Styles from "modules/modal/modal.styles.less";
import OpenOrdersTable from "modules/market/components/market-orders-positions-table/open-orders-table";
import { LiquidityOrder } from "modules/types";
import { TXEventName } from "@augurproject/sdk";
import { DISMISSABLE_NOTICE_BUTTON_TYPES, DismissableNotice } from "modules/reporting/common";

interface UnsignedOrdersProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  description: DescriptionProps;
  breakdown: Array<LinearPropertyLabelProps>;
  loginAccount: object;
  bnAllowance: object;
  needsApproval: boolean;
  header: Array<string>;
  liquidity: object;
  marketTitle: string;
  marketId: string;
  transactionHash: string;
  numTicks: string;
  minPrice: object;
  maxPrice: object;
  outcomes: Array<string>;
  marketType: string;
  sendLiquidityOrder: Function;
  removeLiquidityOrder: Function;
  scalarDenomination: string;
  submitAllTxCount: number;
  openOrders: boolean;
  insufficientFunds: boolean;
}

const orderRow = (order: LiquidityOrder, props: UnsignedOrdersProps) => {
  const { outcomeId, outcomeName, type, quantity, price, orderEstimate, index, status } = order;
  const {
    removeLiquidityOrder,
    sendLiquidityOrder,
    marketType,
    numTicks,
    maxPrice,
    minPrice,
    outcomes,
    needsApproval,
    bnAllowance,
    loginAccount,
    transactionHash,
    marketId,
  } = props;
  const buttons = [
    {
      text: "cancel",
      action: () =>
        removeLiquidityOrder({
          transactionHash,
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
      <span className={type === BUY ? Styles.bid : Styles.ask}>{type}</span>
      <span>{formatShares(quantity).formatted}</span>
      <span>{formatDai(Number(price)).formatted}</span>
      <span>{formatDai(Number(orderEstimate)).formatted}</span>
      <span>{status && <PendingLabel status={status} />}</span>
      <div>
        {buttons.map((Button: DefaultButtonProps, index: number) => {
          if (index === 0)
            return <CancelTextButton key={Button.text} {...Button} disabled={status && status !== TXEventName.Failure} />;
          return <SubmitTextButton key={Button.text} {...Button} disabled={status && status !== TXEventName.Failure} />;
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
          {props.header.map((headerLabel: string, index) => (
            <span key={headerLabel+index}>{headerLabel}</span>
          ))}
        </div>
      )}
      {props.outcomes && (
        <section>
          {props.outcomes.map((outcome: string) =>
            props.liquidity[outcome].map((order: LiquidityOrder) =>
              orderRow(order, props)
            )
          )}
        </section>
      )}
      {props.openOrders && (
        // @ts-ignore
        <OpenOrdersTable relative openOrders={props.orders} marketId={props.marketId} />
      )}
      {props.breakdown && <Breakdown rows={props.breakdown} short />}
    </main>
    <BulkTxLabel buttonName={"Submit All"} count={props.submitAllTxCount} needsApproval={props.needsApproval}/>
    {props.insufficientFunds && <InsufficientModalLabel
      show
      buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
      title={`You do not have enough DAI to place ${props.submitAllTxCount > 1 ? 'these orders' : 'this order'}`}
    />}
    <ButtonsRow buttons={props.buttons} />
  </div>
);
