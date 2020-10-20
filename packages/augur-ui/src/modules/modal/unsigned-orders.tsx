/* eslint react/prop-types: 0 */
import React, { useState } from 'react';

import {
  CancelTextButton,
  DefaultButtonProps,
  SubmitTextButton,
  TextIconButton,
  ProcessingButton,
} from 'modules/common/buttons';
import {
  Breakdown,
  ButtonsRow,
  Description,
  DescriptionProps,
  MarketTitle,
  Title,
} from 'modules/modal/common';
import {
  LinearPropertyLabelProps,
  PendingLabel,
  BulkTxLabel,
  ModalLabelNotice,
  TypeLabel,
  ApprovalTxButtonLabel,
} from 'modules/common/labels';
import {
  ADDLIQUIDITY,
  BUY,
  MAX_BULK_ORDER_COUNT,
  THEMES,
} from 'modules/common/constants';
import { formatDai, formatMarketShares } from 'utils/format-number';
import Styles from 'modules/modal/modal.styles.less';
import OpenOrdersTable from 'modules/market/components/market-orders-positions-table/open-orders-table';
import { LiquidityOrder } from 'modules/types';
import { TXEventName } from '@augurproject/sdk-lite';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { usePendingOrdersStore } from 'modules/app/store/pending-orders';
import { sendLiquidityOrder } from 'modules/orders/actions/liquidity-management';
import { Trash } from 'modules/common/icons';
import {
  approvalsNeededToTrade,
  approveToTrade,
} from 'modules/contracts/actions/contractCalls';
import { useEffect } from 'react';

interface UnsignedOrdersProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  description: DescriptionProps;
  breakdown: Array<LinearPropertyLabelProps>;
  loginAccount: object;
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
  scalarDenomination: string;
  numberOfTransactions: number;
  openOrders: boolean;
  insufficientFunds: boolean;
  orders: any;
  zeroXEnabled?: boolean;
  initialProcessing?: boolean;
}

const orderRow = (
  order: LiquidityOrder,
  {
    marketType,
    numTicks,
    maxPrice,
    minPrice,
    outcomes,
    transactionHash,
    marketId,
    zeroXEnabled,
  }: UnsignedOrdersProps
) => {
  const { loginAccount, theme } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;
  const {
    actions: { removeLiquidity },
  } = usePendingOrdersStore();
  const {
    outcomeId,
    outcomeName,
    type,
    quantity,
    price,
    orderEstimate,
    index,
    status,
  } = order;
  const buttons = [
    {
      text: 'cancel',
      action: () => {
        removeLiquidity({
          txParamHash: transactionHash,
          outcomeId,
          orderId: index,
        });
      },
    },
    {
      text: 'submit',
      action: () =>
        sendLiquidityOrder({
          zeroXEnabled,
          marketId,
          marketType,
          order,
          marketOutcomesArray: outcomes,
          minPrice,
          maxPrice,
          numTicks,
          orderId: index,
          loginAccount,
          orderCB: () => {},
          seriesCB: () => {},
          outcome: outcomeId,
        }),
    },
  ];
  return (
    <div key={`${outcomeName}-${price}-${index}`}>
      <span>
        {!isTrading && <TypeLabel type={type} />}
        {outcomeName}
      </span>
      {isTrading && (
        <span className={type === BUY ? Styles.bid : Styles.ask}>{type}</span>
      )}
      <span>{formatMarketShares(marketType, quantity).formatted}</span>
      <span>{formatDai(Number(price)).formatted}</span>
      <span>{formatDai(Number(orderEstimate)).full}</span>
      <div>
        {buttons.map((Button: DefaultButtonProps, index: number) => {
          if (index === 0)
            return isTrading ? (
              <CancelTextButton
                key={Button.text}
                {...Button}
                disabled={status && status !== TXEventName.Failure}
              />
            ) : (
              <TextIconButton
                key={Button.text}
                disabled={status && status !== TXEventName.Failure}
                action={() => Button.action}
                icon={Trash}
                {...Button}
              />
            );
          return isTrading ? (
            <ProcessingButton
              key={Button.text}
              {...Button}
              propsStatus={status}
              submitTextButtton
              disabled={status && status !== TXEventName.Failure}
            />
          ) : (
            <ProcessingButton
              key={Button.text}
              {...Button}
              smallSpinner
              secondaryButton
              tiny
              propsStatus={status}
              disabled={status && status !== TXEventName.Failure}
            />
          );
        })}
      </div>
    </div>
  );
};

export const UnsignedOrders = ({
  marketType,
  numTicks,
  maxPrice,
  minPrice,
  outcomes,
  transactionHash,
  marketId,
  title,
  closeAction,
  liquidity,
  openOrders,
  orders,
  breakdown,
  numberOfTransactions,
  needsApproval,
  insufficientFunds,
  buttons,
  marketTitle,
  header,
  description,
  initialProcessing,
}: UnsignedOrdersProps) => {
  const { loginAccount, gasPriceInfo, zeroXEnabled } = useAppStatusStore();
  const [processing, setProcessing] = useState(initialProcessing);
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!processing) setProcessing(initialProcessing);
  }, [initialProcessing]);

  const actionForSubmitAllButton = async () => {
    setProcessing(true);
    await buttons[0].action();
    setProcessing(false);
  };

  const submitAllTxCount = !zeroXEnabled
    ? Math.ceil(numberOfTransactions / MAX_BULK_ORDER_COUNT)
    : numberOfTransactions;

  const newButtons = [
    {
      ...buttons[0],
      text: processing ? 'Processing...' : buttons[0].text,
      disabled: !isApproved || buttons[0].disabled || processing,
      action: actionForSubmitAllButton,
    },
    {
      ...buttons[1],
    },
  ];

  return (
    <div className={Styles.Orders}>
      <Title title={title} closeAction={closeAction} />
      <main>
        {/*
          // @ts-ignore */}
        <Description description={description} />
        <MarketTitle title={marketTitle} />
        {!openOrders && (
          <div>
            {header && (
              <div className={Styles.OrdersHeader}>
                {header.map((headerLabel: string, index) => (
                  <span key={headerLabel + index}>{headerLabel}</span>
                ))}
              </div>
            )}
            {outcomes && (
              <section>
                {outcomes.map((outcome: string) =>
                  (liquidity[outcome] || []).map((order: LiquidityOrder) =>
                    orderRow(order, {
                      marketType,
                      numTicks,
                      maxPrice,
                      minPrice,
                      outcomes,
                      transactionHash,
                      marketId,
                      zeroXEnabled,
                    })
                  )
                )}
              </section>
            )}
          </div>
        )}
        {openOrders && (
          // @ts-ignore
          <OpenOrdersTable relative openOrders={orders} marketId={marketId} />
        )}
        {breakdown && <Breakdown rows={breakdown} short />}
      </main>
      <ApprovalTxButtonLabel
        className={Styles.MultipleTransactions}
        ignore={Boolean(process.env.REPORTING_ONLY)}
        title={'Approve to create orders'}
        buttonName={'Approve'}
        checkApprovals={approvalsNeededToTrade}
        doApprovals={() => approveToTrade(loginAccount.address)}
        account={loginAccount.address}
        userEthBalance={loginAccount.balances.eth}
        gasPrice={gasPrice}
        approvalType={ADDLIQUIDITY}
        isApprovalCallback={value => {
          value && setIsApproved(value);
        }}
      />
      <BulkTxLabel
        buttonName="Submit All"
        count={submitAllTxCount}
        needsApproval={needsApproval}
      />
      {insufficientFunds && (
        <ModalLabelNotice
          show
          buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
          title={`You do not have enough DAI to place ${
            submitAllTxCount > 1 ? 'these orders' : 'this order'
          }`}
        />
      )}
      <ButtonsRow buttons={newButtons} />
    </div>
  );
};
