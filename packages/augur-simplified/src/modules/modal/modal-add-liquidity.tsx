import React, { useState } from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { Header } from './common';
import { YES_NO, BUY, USDC } from '../constants';
import { OutcomesGrid, AmountInput, InfoNumbers } from '../market/trading-form';
import { BuySellButton, SecondaryButton } from '../common/buttons';
import { ErrorBlock } from '../common/labels';
import { formatPercent } from '../../utils/format-number';
import { MultiButtonSelection } from '../common/selection';
import classNames from 'classnames';
import { MarketInfo } from '../types';

const TRADING_FEE_OPTIONS = [
  {
    id: 0,
    label: '0.0%',
    value: 0,
  },
  {
    id: 1,
    label: '0.5%',
    value: 0.5,
  },
  {
    id: 2,
    label: '1%',
    value: 1,
  },
  {
    id: 3,
    label: '2%',
    value: 2,
  },
];

const fakeYesNoOutcomes = [
  {
    id: 0,
    name: 'yes',
    price: '$0',
  },
  {
    id: 1,
    name: 'No',
    price: '$0',
  },
];

export const REMOVE = 'REMOVE';
export const ADD = 'ADD';
export const CREATE = 'CREATE';

interface ModalAddLiquidityProps {
  market: MarketInfo;
  liquidityModalType?: string;
}

const ModalAddLiquidity = ({
  market,
  liquidityModalType,
}: ModalAddLiquidityProps) => {
  const [outcomes, setOutcomes] = useState(fakeYesNoOutcomes);
  const [showBackView, setShowBackView] = useState(false);
  const [amount, updateAmount] = useState('');

  const [tradingFeeSelection, setTradingFeeSelection] = useState(
    TRADING_FEE_OPTIONS[0].id
  );
  const { amm } = market;
  const createLiquidity = !amm;
  const percentFormatted = formatPercent(amm?.feePercent).full;
  let modalType = createLiquidity ? CREATE : ADD;
  if (liquidityModalType) modalType = liquidityModalType;

  const RECEIVE_BREAKDOWN_FAKE_DATA = [
    {
      label: 'yes shares',
      value: `${amount === '' ? 0 : amount}`,
    },
    {
      label: 'no shares',
      value: '0',
    },
    {
      label: 'liquidity shares',
      value: '0',
    },
  ];

  const LIQUIDITY_STRINGS = {
    [REMOVE]: {
      header: 'remove liquidity',
      showTradingFee: false,
      amountSubtitle: 'How much do you want to remove?',
      footerText:
        'Need some copy here explaining why the user may recieve some shares when they remove their liquidity and they would need to sell these if possible.',
      receiveTitle: 'What you will recieve',
      receiveBreakdown: [
        {
          label: 'yes shares',
          value: '0.00',
        },
        {
          label: 'no shares',
          value: '0.00',
        },
        {
          label: 'USDC',
          value: '$0.00',
        },
        {
          label: 'Fees Earned',
          value: '$0.00 USDC',
        },
      ],
      liquidityDetailsFooter: {
        title: 'Market Liquidity Details',
        breakdown: [
          {
            label: 'Trading fee',
            value: '1.0%',
          },
          {
            label: 'your share of the liquidity pool',
            value: '0.05%',
          },
          {
            label: 'your total fees earned',
            value: '$0.50 USDC',
          },
        ],
      },
      approvalButtonText: 'approve shares spend',
      actionButtonText: 'enter amount',
      confirmButtonText: 'confirm remove',
      confirmOverview: {
        title: 'What you are Removing',
        breakdown: [
          {
            label: 'liquidity shares',
            value: '10.06',
          },
        ],
      },
      confirmReceiveOverview: {
        title: 'What you will recieve',
        breakdown: [
          {
            label: 'yes shares',
            value: '0.00',
          },
          {
            label: 'no shares',
            value: '1.72 ($0.94)',
          },
          {
            label: 'USDC',
            value: '$9.06 USDC',
          },
          {
            label: 'Fees Earned',
            value: '$0.50 USDC',
          },
        ],
      },
    },
    [ADD]: {
      header: 'add liquidity',
      showTradingFee: true,
      setOdds: true,
      setOddsTitle: 'Current Odds',
      footerText: `By adding liquidity you'll earn ${percentFormatted} of all trades on this this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`,
      receiveTitle: "You'll receive",
      receiveBreakdown: RECEIVE_BREAKDOWN_FAKE_DATA,
      approvalButtonText: 'approve USDC',
      actionButtonText: 'add',
      confirmButtonText: 'confirm add',
      confirmOverview: {
        title: 'What you are depositing',
        breakdown: [
          {
            label: 'amount',
            value: '10.00 USDC',
          },
        ],
      },
      confirmReceiveOverview: {
        title: 'What you will receive',
        breakdown: RECEIVE_BREAKDOWN_FAKE_DATA,
      },
      marketLiquidityDetails: {
        title: 'Market liquidity details',
        breakdown: [
          {
            label: 'trading fee',
            value: '1.0%',
          },
          {
            label: 'your share of the pool',
            value: '100%',
          },
        ],
      },
    },
    [CREATE]: {
      header: 'add liquidity',
      showTradingFee: false,
      setTradingFee: true,
      setOdds: true,
      setOddsTitle: 'Set the odds',
      editableOutcomes: true,
      footerText:
        "By adding initial liquidity you'll earn your set trading fee percentage of all trades on this this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
      receiveTitle: "You'll receive",
      receiveBreakdown: RECEIVE_BREAKDOWN_FAKE_DATA,
      approvalButtonText: 'approve USDC',
      actionButtonText: 'enter amount',
      confirmButtonText: 'confirm market liquidity',
      confirmOverview: {
        title: 'What you are depositing',
        breakdown: [
          {
            label: 'amount',
            value: '10.00 USDC',
          },
        ],
      },
      confirmReceiveOverview: {
        title: 'What you will receive',
        breakdown: RECEIVE_BREAKDOWN_FAKE_DATA,
      },
      marketLiquidityDetails: {
        title: 'market liquidity details',
        breakdown: [
          {
            label: 'trading fee',
            value: '1.0%',
          },
          {
            label: 'your share of the pool',
            value: '100%',
          },
        ],
      },
    },
  };
  return (
    <section
      className={classNames(Styles.ModalAddLiquidity, {
        [Styles.showBackView]: showBackView,
        [Styles.Remove]: modalType === REMOVE,
      })}
    >
      {!showBackView ? (
        <>
          <Header
            title={LIQUIDITY_STRINGS[modalType].header}
            subtitle={{
              label: 'trading fee',
              value: LIQUIDITY_STRINGS[modalType].showTradingFee
                ? percentFormatted
                : null,
            }}
          />
          {LIQUIDITY_STRINGS[modalType].amountSubtitle && (
            <span className={Styles.SmallLabel}>
              {LIQUIDITY_STRINGS[modalType].amountSubtitle}
            </span>
          )}
          <AmountInput
            currencyName={USDC}
            updateInitialAmount={(amount) => updateAmount(amount)}
            initialAmount={amount}
          />
          {LIQUIDITY_STRINGS[modalType].setTradingFee && (
            <>
              <ErrorBlock text="Initial liquidity providers are required to set the odds before creating market liquidity." />
              <span className={Styles.SmallLabel}>Set trading fee</span>
              <MultiButtonSelection
                options={TRADING_FEE_OPTIONS}
                selection={tradingFeeSelection}
                setSelection={(id) => setTradingFeeSelection(id)}
              />
            </>
          )}
          {LIQUIDITY_STRINGS[modalType].setOdds && (
            <>
              <span className={Styles.SmallLabel}>
                {LIQUIDITY_STRINGS[modalType].setOddsTitle}
              </span>
              <OutcomesGrid
                outcomes={outcomes}
                selectedOutcome={null}
                setSelectedOutcome={() => null}
                marketType={YES_NO}
                orderType={BUY}
                nonSelectable
                editable={LIQUIDITY_STRINGS[modalType].editableOutcomes}
                setEditableValue={(price, index) => {
                  const newOutcomes = outcomes;
                  newOutcomes[index].price = price;
                  setOutcomes(newOutcomes);
                }}
              />
            </>
          )}

          <span className={Styles.SmallLabel}>
            {LIQUIDITY_STRINGS[modalType].receiveTitle}
          </span>
          <InfoNumbers
            infoNumbers={LIQUIDITY_STRINGS[modalType].receiveBreakdown}
          />
          <BuySellButton
            text={LIQUIDITY_STRINGS[modalType].approvalButtonText}
          />
          <SecondaryButton
            action={() => setShowBackView(true)}
            text={LIQUIDITY_STRINGS[modalType].actionButtonText}
          />
          {LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter && (
            <div className={Styles.FooterText}>
              <span className={Styles.SmallLabel}>
                {LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter.title}
              </span>
              <InfoNumbers
                infoNumbers={
                  LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter.breakdown
                }
              />
            </div>
          )}
          <div className={Styles.FooterText}>
            {LIQUIDITY_STRINGS[modalType].footerText}
          </div>
        </>
      ) : (
        <>
          <div className={Styles.Header} onClick={() => setShowBackView(false)}>
            Back
          </div>
          <div className={Styles.MarketTitle}>
            <span>Market</span>
            <span>{market.description}</span>
          </div>
          <section>
            <span className={Styles.SmallLabel}>
              {LIQUIDITY_STRINGS[modalType].confirmOverview.title}
            </span>
            <InfoNumbers
              infoNumbers={
                LIQUIDITY_STRINGS[modalType].confirmOverview.breakdown
              }
            />
          </section>

          <section>
            <span className={Styles.SmallLabel}>
              {LIQUIDITY_STRINGS[modalType].confirmReceiveOverview.title}
            </span>
            <InfoNumbers
              infoNumbers={LIQUIDITY_STRINGS[
                modalType
              ].confirmReceiveOverview.breakdown}
            />
          </section>
          {LIQUIDITY_STRINGS[modalType].marketLiquidityDetails && (
            <section>
              <span className={Styles.SmallLabel}>
                {LIQUIDITY_STRINGS[modalType].marketLiquidityDetails.title}
              </span>
              <InfoNumbers
                infoNumbers={
                  LIQUIDITY_STRINGS[modalType].marketLiquidityDetails.breakdown
                }
              />
            </section>
          )}

          <BuySellButton
            text={LIQUIDITY_STRINGS[modalType].confirmButtonText}
          />
          <div className={Styles.FooterText}>
            Need some copy here explaining why the user will get shares and that
            they may recieve some shares when they remove their liquidity.
          </div>
        </>
      )}
    </section>
  );
};

export default ModalAddLiquidity;
