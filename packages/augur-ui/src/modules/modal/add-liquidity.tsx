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
import {
  updateTradeCost
} from 'modules/trades/actions/update-trade-cost-shares';
import { createBigNumber } from 'utils/create-big-number';

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
    },
  } = modal;
  const orderBook = pendingLiquidityOrders[txParamHash] || {};
  const [odds, setOdds] = useState('');
  const [wager, setWager] = useState('');
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
  const checkWager = newVal => ({ checkError: false, errorMessage: null });
  const errorMessage = null;
  const modifyBet = v => {
    v.odds ? setOdds(v.odds) : setWager(v.wager);
  };
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
          />
          <BetslipInput
            label="Wager"
            value={wager}
            valueKey="wager"
            modifyBet={modifyBet}
            errorCheck={checkWager}
            orderErrorMessage={errorMessage}
          />
          <BetslipInput
            label="Odds"
            value={odds}
            valueKey="odds"
            modifyBet={modifyBet}
            errorCheck={checkWager}
            orderErrorMessage={errorMessage}
            noForcedText
          />
          <PrimaryButton
            action={() => {
              const limitPrice = convertOddsToPrice(odds).roundedFormatted;
              const orderShares = '10';
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
                  order.outcome = outcomesFormatted[curOutcome];
                  order.outcomeId = curOutcome;
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
          />
        </section>
        <div>
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
          {Object.keys(orderBook).map(outcomeId => {
            const displayingOutcome = outcomesFormatted[outcomeId];
            return (orderBook[outcomeId] || []).map((order, orderId, array) => {
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
        </div>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
