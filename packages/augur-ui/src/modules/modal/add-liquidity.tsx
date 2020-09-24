import React, { useState, useMemo, useRef } from 'react';
import { useAppStatusStore } from 'modules/app/store/app-status';
import Styles from 'modules/modal/modal.styles.less';
import { Title, ButtonsRow } from 'modules/modal/common';
import { Trash } from 'modules/common/icons';
import { SELL } from 'modules/common/constants';
import { usePendingOrdersStore } from 'modules/app/store/pending-orders';
import { startOrderSending } from 'modules/orders/actions/liquidity-management';
import {
  convertOddsToPrice,
  convertToOdds,
  convertToNormalizedPrice,
} from 'utils/get-odds';
import { formatDai } from 'utils/format-number';
import { SquareDropdown } from 'modules/common/selection';
import { BetslipInput } from 'modules/trading/common';
import { PrimaryButton } from 'modules/common/buttons';
import { updateTradeCost } from 'modules/trades/actions/update-trade-cost-shares';
import { createBigNumber } from 'utils/create-big-number';
import * as classNames from 'classnames';

const getOutcomeOptions = outcomesFormatted => {
  const options = outcomesFormatted
    .filter(({ isInvalid }) => !isInvalid)
    .map(formattedOutcome => {
      return {
        label: formattedOutcome.description,
        value: formattedOutcome.id,
      };
    });
  return options;
};

const getTrade = ({ marketId, outcomeId, limitPrice, numShares, callback }) => {
  updateTradeCost({
    marketId,
    outcomeId,
    limitPrice,
    numShares,
    side: SELL,
    selfTrade: false,
    callback,
  });
};

export const ModalAddLiquidity = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
  const {
    pendingLiquidityOrders,
    actions: { addLiquidity, removeLiquidity, clearAllMarketLiquidity },
  } = usePendingOrdersStore();
  const {
    market: {
      transactionHash: txParamHash,
      outcomesFormatted,
      id: marketId,
      description,
      minPriceBigNumber: min,
      maxPriceBigNumber: max,
      tickSize,
    },
  } = modal;
  const orderBook = pendingLiquidityOrders[txParamHash] || {};
  const [errorMessage, setErrorMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const odds = useRef(null);
  const oddsValidation = useRef({ checkError: false, errorMessage: null, warningMessage: null });
  const wager = useRef(null);
  const wagerValidation = useRef({ checkError: false, errorMessage: null });
  const shares = useRef('10');
  const [selectedOutcome, setSelectedOutcome] = useState(1);
  const options = useMemo(() => getOutcomeOptions(outcomesFormatted), [
    outcomesFormatted,
  ]);
  const defaultOutcome = useMemo(
    () => options.find(({ value }) => value === selectedOutcome).value,
    [options, selectedOutcome]
  );
  const buttons = [
    {
      text: 'Place orders',
      action: () => {
        startOrderSending({ marketId });
        closeModal();
      },
    },
    {
      text: 'Cancel',
      action: () => {
        closeModal();
      },
    },
  ];
  const checkWager = newVal => {
    wager.current = newVal;
    wagerValidation.current.checkError = false;
    wagerValidation.current.errorMessage = null;
    const formattedDai = formatDai(isNaN(Number(newVal)) ? 0 : newVal);
    if (
      formattedDai.value <= 0
    ) {
      wagerValidation.current.checkError = true;
      wagerValidation.current.errorMessage = `Your wager must be a number above $0.00`;
    }
    checkSharesAssignMessage();
    return {
      checkError: wagerValidation.current.checkError,
      errorMessage: wagerValidation.current.errorMessage,
    };
  };

  const checkOdds = newVal => {
    odds.current = newVal;
    oddsValidation.current.checkError = false;
    oddsValidation.current.errorMessage = null;
    oddsValidation.current.warningMessage = null;
    if (!!newVal) {
      const normalizedPrice = convertOddsToPrice(odds.current);
      const priceBN = createBigNumber(normalizedPrice.roundedFormatted);
      const maxValid = max.minus(tickSize);
      if (!isNaN(normalizedPrice.formatted) && normalizedPrice.rounded !== normalizedPrice.formatted && !(priceBN.gt(maxValid) || priceBN.lt(tickSize))) {
        const displayOdds = convertToOdds(
          convertToNormalizedPrice({
            price: normalizedPrice.roundedFormatted,
            min,
            max,
          })
        ).full;
        oddsValidation.current.warningMessage = `Your odds will actually be ${displayOdds} due to current system limitations.`;
      }
      if (isNaN(normalizedPrice.formatted) || priceBN.gt(maxValid) || priceBN.lt(tickSize)) {
        const minOdds = convertToOdds(
          convertToNormalizedPrice({
            price: tickSize,
            min,
            max,
          })
        ).full;
        const maxOdds = convertToOdds(
          convertToNormalizedPrice({
            price: maxValid.toFixed(),
            min,
            max,
          })
        ).full;
        oddsValidation.current.checkError = true;
        oddsValidation.current.errorMessage = `Odds must be between ${minOdds} and ${maxOdds}`;
      }
    }
    checkSharesAssignMessage();
    return {
      checkError: oddsValidation.current.checkError,
      errorMessage: oddsValidation.current.errorMessage,
    };
  };

  const checkSharesAssignMessage = () => {
    const oddsMessage = oddsValidation.current.errorMessage;
    const wagerMessage = wagerValidation.current.errorMessage;
    // TODO: after matic, refactor this out as it shouldn't be needed anymore.
    let shareAmountMessage = null;
    const total = wager.current
      ? createBigNumber(formatDai(wager.current).formatted)
      : wager.current;
    const price = odds.current
      ? createBigNumber(convertOddsToPrice(odds.current).roundedFormatted)
      : odds.current;
    if (!oddsMessage && !wagerMessage && price && total) {
      const marketRange = max.minus(min);
      const askPrice = marketRange.minus(price);
      const curNumShares = total.dividedBy(askPrice);
      const numSharesMod = curNumShares.modulo(10);
      const isValidShares = numSharesMod.eq(0);
      const sharesLessMod = curNumShares.minus(numSharesMod);
      const tenShareCost = createBigNumber(10).times(askPrice);
      if (!isValidShares) {
        const lowerTo = sharesLessMod.times(askPrice);
        const raiseTo = lowerTo.plus(tenShareCost);
        const customPart = lowerTo.gt(0)
          ? `Raise total to ${formatDai(raiseTo).full} or lower total to ${
              formatDai(lowerTo).full
            }`
          : `Raise total to ${formatDai(raiseTo).full}.`;
          shareAmountMessage = `This amount will fail due to system limitaitons. ${customPart}`;
      } else {
        shares.current = curNumShares.toFixed();
      }
    }
    const warningToSet = oddsValidation.current.warningMessage || null;
    const messageToSet =
      oddsMessage || wagerMessage || shareAmountMessage || null;
    if (errorMessage !== messageToSet) {
      setErrorMessage(messageToSet);
    }
    if (warningToSet !== warningMessage) {
      setWarningMessage(warningToSet);
    }
  };
  const modifyBet = v => {};
  const notEmpty = Object.keys(orderBook).length > 0;
  return (
    <div className={Styles.AddLiquidityModal}>
      <Title title="Add more liquidity" closeAction={() => closeModal()} />
      <main>
        <h2>{description}</h2>
        <span>
          Small text indicating why the user should add more liquidity to this
          market?
        </span>
        <section>
          <SquareDropdown
            defaultValue={defaultOutcome}
            options={options}
            onChange={setSelectedOutcome}
            large
          />
          <BetslipInput
            label="Wager"
            value={wager.current}
            valueKey="wager"
            modifyBet={modifyBet}
            errorCheck={checkWager}
            orderErrorMessage={wagerValidation.current.errorMessage}
          />
          <BetslipInput
            label="Odds"
            value={odds.current}
            valueKey="odds"
            modifyBet={modifyBet}
            errorCheck={checkOdds}
            orderErrorMessage={oddsValidation.current.errorMessage}
            noForcedText
          />
          <PrimaryButton
            action={() => {
              const limitPrice = convertOddsToPrice(odds.current)
                .roundedFormatted;
              const orderShares = shares.current;
              const curOutcome = selectedOutcome;
              const curOutcomeArray = orderBook[curOutcome]
                ? orderBook[curOutcome]
                : [];
              const index = curOutcomeArray.findIndex(
                arrOrder => arrOrder.limitPrice === limitPrice
              );
              const numShares =
                index >= 0
                  ? createBigNumber(orderShares).plus(
                      curOutcomeArray[index].numShares
                    )
                  : orderShares;
              getTrade({
                marketId,
                outcomeId: selectedOutcome,
                limitPrice,
                numShares,
                callback: (err, trade) => {
                  const order = trade;
                  order.price = createBigNumber(trade.limitPrice);
                  order.quantity = createBigNumber(trade.numShares);
                  order.outcomeName = outcomesFormatted[curOutcome].description;
                  order.outcomeId = curOutcome;
                  order.orderEstimate = order.totalCost.formatted;
                  if (index >= 0) {
                    curOutcomeArray[index] = order;
                  } else {
                    curOutcomeArray.push(order);
                  }
                  const liquidityOrders = {
                    ...orderBook,
                    [curOutcome]: curOutcomeArray,
                  };
                  addLiquidity({
                    txParamHash,
                    liquidityOrders,
                  });
                },
              });
            }}
            text="Add offer"
            disabled={errorMessage}
          />
          {errorMessage && <span>{errorMessage}</span>}
          {warningMessage && <p>{warningMessage}</p>}
        </section>
        <div className={classNames({ [Styles.notEmpty]: notEmpty })}>
          <ul key={`tableheader`}>
            <li>Outcome</li>
            <li>Wager</li>
            <li>Odds</li>
            <li>
              <button onClick={() => clearAllMarketLiquidity({ txParamHash })}>
                {Trash}Cancel All
              </button>
            </li>
          </ul>
          <section className={classNames({ [Styles.notEmpty]: notEmpty })}>
            {Object.keys(orderBook).map(outcomeId => {
              const displayingOutcome = outcomesFormatted[outcomeId];
              return (orderBook[outcomeId] || []).map((order, orderId) => {
                const key = `${order.limitPrice}-${displayingOutcome.id}`;
                return (
                  <ul key={key}>
                    <li>{displayingOutcome.description}</li>
                    <li>
                      {
                        formatDai(order.totalCost.roundedFormatted, {
                          bigUnitPostfix: true,
                        }).full
                      }
                    </li>
                    <li>
                      {
                        convertToOdds(
                          convertToNormalizedPrice({
                            price: order.limitPrice,
                            min,
                            max,
                          })
                        ).full
                      }
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          removeLiquidity({ txParamHash, outcomeId, orderId });
                        }}
                      >
                        {Trash}
                      </button>
                    </li>
                  </ul>
                );
              });
            })}
          </section>
        </div>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
