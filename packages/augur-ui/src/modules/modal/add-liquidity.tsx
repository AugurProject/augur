import React, { useState, useMemo } from 'react';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { CloseButton } from 'modules/common/buttons';
import Styles from 'modules/modal/modal.styles.less';
import { Title, ButtonsRow } from 'modules/modal/common';
import { Trash } from 'modules/common/icons';
import {
  addPendingOrder,
  removePendingOrder,
} from 'modules/orders/actions/pending-order-management';
import { usePendingOrdersStore } from 'modules/app/store/pending-orders';
import { startOrderSending } from 'modules/orders/actions/liquidity-management';
import { convertToOdds, convertToNormalizedPrice } from 'utils/get-odds';
import { formatDai } from 'utils/format-number';
import { SquareDropdown } from 'modules/common/selection';
import { BetslipInput } from 'modules/trading/common';
import { PrimaryButton } from 'modules/common/buttons';

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

export const ModalAddLiquidity = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
  const [odds, setOdds] = useState('');
  const [wager, setWager] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState(1);
  const {
    pendingLiquidityOrders,
    actions: { addLiquidity, removePendingOrder },
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
  const checkWager = (newVal) => ({checkError: false, errorMessage: null });
  const errorMessage = null;
  const modifyBet = v => console.log('modifyBet', v);

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
            action={() => console.log('place bet clicked')}
            text="Place Bet"
          />
        </section>
        <div>
          <ul key={`tableheader`}>
            <li>Outcome</li>
            <li>Wager</li>
            <li>Odds</li>
            <li>
              <button onClick={() => console.log('cancel all orders')}>
                {Trash}Cancel All
              </button>
            </li>
          </ul>
          <ul>
            <li>{outcomesFormatted[1].description}</li>
            <li>{formatDai(100000, { bigUnitPostfix: true }).full}</li>
            <li>
              {
                convertToOdds(
                  convertToNormalizedPrice({ price: '1.5', min, max })
                ).full
              }
            </li>
            <li>
              <button onClick={() => console.log('cancel order')}>
                {Trash}
              </button>
            </li>
          </ul>
        </div>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
