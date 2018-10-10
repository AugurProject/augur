import React from "react";

import { CreateMarketEdit } from "modules/common/components/icons";

import ValueDenomination from "modules/common/components/value-denomination/value-denomination";
import classNames from "classnames";
import getValue from "utils/get-value";
import { CATEGORICAL } from "modules/markets/constants/market-types";
import { MARKET, BUY, LIMIT, SELL } from "modules/transactions/constants/types";

import Styles from "modules/trading/components/trading--confirm/trading--confirm.styles";

const MarketTradingConfirm = p => {
  const numShares = getValue(p, "trade.numShares");
  const limitPrice = getValue(p, "trade.limitPrice");
  const tradingFees = getValue(p, "trade.totalFee");
  const potentialEthProfit = getValue(p, "trade.potentialEthProfit");
  const potentialProfitPercent = getValue(p, "trade.potentialProfitPercent");
  const potentialEthLoss = getValue(p, "trade.potentialEthLoss");
  const potentialLossPercent = getValue(p, "trade.potentialLossPercent");
  const totalCost = getValue(p, "trade.totalCost");
  const shareCost = getValue(p, "trade.shareCost");
  const { doNotCreateOrders } = p;
  return (
    <section className={Styles.TradingConfirm}>
      <div className={Styles.TradingConfirm__header}>
        {!p.isMobile && (
          <div
            className={
              p.selectedNav === BUY
                ? Styles.TradingConfirm_arrow_buy
                : Styles.TradingConfirm_arrow_sell
            }
          />
        )}
        {!p.isMobile && <h2>Confirm {p.selectedNav} order?</h2>}
        {p.isMobile && (
          <h2
            className={classNames({
              [`${Styles.order__buy}`]: p.selectedNav === BUY,
              [`${Styles.order__sell}`]: p.selectedNav === SELL
            })}
          >
            Confirm {p.selectedNav} order?
          </h2>
        )}
        <span>
          <button onClick={p.prevPage}>{CreateMarketEdit}</button>
        </span>
      </div>
      <ul className={Styles.TradingConfirm__details}>
        {!p.isMobile &&
          p.market.marketType === CATEGORICAL && (
            <li>
              <span>Outcome</span>
              <span>{p.selectedOutcome.name}</span>
            </li>
          )}
        {p.orderType === MARKET && (
          <li>
            <span>Total Cost</span>
            <span>
              <ValueDenomination
                formatted={totalCost ? totalCost.formatted : "0"}
              />{" "}
              ETH
            </span>
          </li>
        )}
        {p.orderType === LIMIT && (
          <li>
            <span>Quantity</span>
            <span>{numShares} Shares</span>
          </li>
        )}
        {p.orderType === LIMIT && (
          <li>
            <span>Limit Price</span>
            <span>{limitPrice} ETH</span>
          </li>
        )}
        <li>
          <span>Fee</span>
          <span>
            {tradingFees ? tradingFees.formattedValue : "0"} <span>ETH</span>
          </span>
        </li>
      </ul>
      {p.orderType === LIMIT && (
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Est. Cost</span>
          </li>
          <li>
            <span>
              <ValueDenomination
                formatted={totalCost ? totalCost.fullPrecision : "0"}
              />{" "}
              <span>ETH</span>
            </span>
            <span>
              <ValueDenomination
                formatted={shareCost ? shareCost.fullPrecision : "0"}
              />{" "}
              <span>Shares</span>
            </span>
          </li>
        </ul>
      )}
      {p.orderType === MARKET && (
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Quantity</span>
            <span>{p.marketQuantity}</span>
          </li>
        </ul>
      )}
      <ul className={Styles.TradingConfirm__potential}>
        <li>
          <span>Potential Profit</span>
          <span>
            <ValueDenomination
              formatted={
                potentialEthProfit
                  ? potentialEthProfit.formattedValue.toString()
                  : "0"
              }
            />{" "}
            <span>
              ETH (
              {potentialProfitPercent ? potentialProfitPercent.formatted : "0"}
              %)
            </span>
          </span>
        </li>
        <li>
          <span>Potential Loss</span>
          <span>
            <span>
              <ValueDenomination
                formatted={
                  potentialEthLoss
                    ? potentialEthLoss.formattedValue.toString()
                    : "0"
                }
              />{" "}
              <span>
                ETH (
                {potentialLossPercent ? potentialLossPercent.formatted : "0"}
                %)
              </span>
            </span>
          </span>
        </li>
      </ul>
      <div className={Styles.TradingConfirmation__actions}>
        <button
          className={Styles["TradingConfirmation__button--back"]}
          onClick={p.prevPage}
        >
          Back
        </button>
        <button
          className={Styles["TradingConfirmation__button--submit"]}
          onClick={e => {
            e.preventDefault();
            p.market.onSubmitPlaceTrade(
              p.selectedOutcome.id,
              (err, tradeGroupID) => {
                // onSent/onFailed CB
                if (!err) {
                  p.showOrderPlaced();
                }
              },
              res => {
                // onComplete CB
              },
              doNotCreateOrders
            );
            p.prevPage(e, true);
          }}
        >
          Confirm {p.selectedNav}
        </button>
      </div>
    </section>
  );
};

export default MarketTradingConfirm;
