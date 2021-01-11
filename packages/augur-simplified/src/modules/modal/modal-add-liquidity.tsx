import React, { useMemo, useState } from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { Header } from './common';
import { YES_NO, BUY, USDC, SHARES, ApprovalAction, ENTER_AMOUNT, YES_OUTCOME_ID, NO_OUTCOME_ID } from '../constants';
import { OutcomesGrid, AmountInput, InfoNumbers } from '../market/trading-form';
import { ApprovalButton, BuySellButton } from '../common/buttons';
import { ErrorBlock, generateTooltip } from '../common/labels';
import { formatPercent } from '../../utils/format-number';
import { MultiButtonSelection } from '../common/selection';
import classNames from 'classnames';
import { AmmOutcome, MarketInfo } from '../types';
import { doAmmLiquidity, getAmmLiquidity } from '../../utils/contract-calls';
import { useAppStatusStore } from '../stores/app-status';

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
const defaultAddLiquidityBreakdown = [
  {
    label: 'yes shares',
    value: `0`,
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

const fakeYesNoOutcomes = [
  {
    id: 0,
    name: 'Invalid',
    price: '$0',
    isInvalid: true
  },
  {
    id: 1,
    name: 'No',
    price: '$0',
  },
  {
    id: 2,
    name: 'Yes',
    price: '$0',
  },
];

export const REMOVE = 'remove';
export const ADD = 'add';
export const CREATE = 'create';

interface ModalAddLiquidityProps {
  market: MarketInfo;
  liquidityModalType?: string;
  currency?: string;
}

const ModalAddLiquidity = ({
  market,
  liquidityModalType,
  currency = USDC,
}: ModalAddLiquidityProps) => {
  const { userInfo: { balances }, processed : { cashes }, loginAccount } = useAppStatusStore();
  const account = loginAccount?.account
  const amm = market?.amm;

  const [outcomes, setOutcomes] = useState<AmmOutcome[]>(amm ? amm.ammOutcomes : fakeYesNoOutcomes);

  const [showBackView, setShowBackView] = useState(false);
  const [chosenCash, updateCash] = useState<string>(currency);
  const [buttonError, updateButtonError] = useState('');
  // needs to be set by currency picker if amm is null
  const [breakdown, setBreakdown] = useState(defaultAddLiquidityBreakdown);
  const [tradingFeeSelection, setTradingFeeSelection] = useState(
    TRADING_FEE_OPTIONS[0].id
  );

  const createLiquidity = !amm || amm?.liquidity === undefined || amm?.liquidity === "0";
  const percentFormatted = formatPercent(amm?.feePercent).full;
  let modalType = createLiquidity ? CREATE : ADD;
  if (liquidityModalType) modalType = liquidityModalType;
  // eslint-disable-next-line
  const [selectedCash, setSelectedCash] = useState(amm?.cash);
  // get user balance for initial amount, if cash not selected user "0"
  const userCashBalance = selectedCash?.name ? balances[selectedCash?.name]?.balance : "0";
  const [amount, updateAmount] = useState(userCashBalance);
  const [errorMessage, setErrorMessage] = useState<string>(ENTER_AMOUNT)

  const cash = useMemo(() => {
    return cashes && chosenCash ? Object.values(cashes).find(c => c.name === chosenCash) : Object.values(cashes)[0]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenCash])

  const LIQUIDITY_STRINGS = {
    [REMOVE]: {
      header: 'remove liquidity',
      showTradingFee: false,
      amountSubtitle: 'How much do you want to remove?',
      footerText:
        'Need some copy here explaining why the user may recieve some shares when they remove their liquidity and they would need to sell these if possible.',
      receiveTitle: 'What you will recieve',
      receiveBreakdown: async (cash) => {
        if (!account || !market.marketId || !amount || !outcomes || outcomes.length === 0 || !cash) return defaultAddLiquidityBreakdown;
        const priceNo = outcomes[NO_OUTCOME_ID]?.price
        const priceYes = outcomes[YES_OUTCOME_ID]?.price
        const fee = String(amm.feeRaw);
        console.log(account, market.marketId, cash, fee, amount, priceNo, priceYes);
        const results = await getAmmLiquidity(account, amm, market.marketId, cash, fee, amount, priceNo, priceYes);
        setErrorMessage('');
        console.log('results', String(results));

        setBreakdown([
          {
            label: 'yes shares',
            value: `0`,
          },
          {
            label: 'no shares',
            value: '0',
          },
          {
            label: 'liquidity shares',
            value: '0',
          },
        ]);
      },
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
      confirmAction: () => {

      },
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
      currencyName: SHARES,
    },
    [ADD]: {
      header: 'add liquidity',
      showTradingFee: true,
      setOdds: true,
      setOddsTitle: 'Current Odds',
      footerText: `By adding liquidity you'll earn ${percentFormatted} of all trades on this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`,
      receiveTitle: "You'll receive",
      receiveBreakdown: async (cash) => {
        if (!account || !market.marketId || !amount || !outcomes || outcomes.length === 0 || !cash) return defaultAddLiquidityBreakdown;
        const priceNo = outcomes[NO_OUTCOME_ID]?.price
        const priceYes = outcomes[YES_OUTCOME_ID]?.price
        const fee = String(amm.feeRaw);
        console.log(account, market.marketId, cash, fee, amount, priceNo, priceYes);
        const results = await getAmmLiquidity(account, amm, market.marketId, cash, fee, amount, priceNo, priceYes);
        setErrorMessage('');
        console.log('results', String(results));

        setBreakdown([
          {
            label: 'yes shares',
            value: `0`,
          },
          {
            label: 'no shares',
            value: '0',
          },
          {
            label: 'liquidity shares',
            value: '0',
          },
        ]);
      },
      approvalButtonText: 'approve USDC',
      actionButtonText: 'add',
      confirmButtonText: 'confirm add',
      confirmAction: async (cash) => {
        if (!account || !market.marketId || !amount || !outcomes || outcomes.length === 0) return defaultAddLiquidityBreakdown;
        const priceNo = outcomes[NO_OUTCOME_ID]?.price
        const priceYes = outcomes[YES_OUTCOME_ID]?.price
        const fee = String(amm.feeRaw);
        console.log(account, market.marketId, cash, fee, amount, priceNo, priceYes);
        const txResponse = await doAmmLiquidity(account, amm, market.marketId, cash, fee, amount, priceNo, priceYes);
        // TODO: handle transaction response

      },
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
        breakdown: defaultAddLiquidityBreakdown,
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
      currencyName: cash,
    },
    [CREATE]: {
      currencyName: USDC,
      showCurrencyDropdown: true,
      header: 'add liquidity',
      showTradingFee: false,
      setTradingFee: true,
      setOdds: true,
      setOddsTitle: 'Set the odds',
      editableOutcomes: true,
      footerText:
        "By adding initial liquidity you'll earn your set trading fee percentage of all trades on this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
      receiveTitle: "You'll receive",
      receiveBreakdown: async (cash) => {
        if (!account || !market.marketId || !amount || !outcomes || outcomes.length === 0 || !cash) return defaultAddLiquidityBreakdown;
        const priceNo = outcomes[NO_OUTCOME_ID]?.price
        const priceYes = outcomes[YES_OUTCOME_ID]?.price
        const fee = String(tradingFeeSelection);
        console.log(account, market.marketId, cash, fee, amount, priceNo, priceYes);
        const results = await getAmmLiquidity(account, amm, market.marketId, cash, fee, amount, priceNo, priceYes);

        setErrorMessage('');
        console.log('results', String(results));
        return [
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

      },
      approvalButtonText: 'approve USDC',
      actionButtonText: 'enter amount',
      confirmButtonText: 'confirm market liquidity',
      confirmAction: async (cash) => {
        if (!account || !market.marketId || !amount || !outcomes || outcomes.length === 0 || !cash) return defaultAddLiquidityBreakdown;
        const priceNo = outcomes[NO_OUTCOME_ID]?.price
        const priceYes = outcomes[YES_OUTCOME_ID]?.price
        const fee = String(tradingFeeSelection);
        console.log(account, market.marketId, cash, fee, amount, priceNo, priceYes);
        const txResponse = await doAmmLiquidity(account, amm, market.marketId, cash, fee, amount, priceNo, priceYes);
        // handle transaction response

      },
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
        breakdown: defaultAddLiquidityBreakdown,
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

  LIQUIDITY_STRINGS[modalType].receiveBreakdown(cash)

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
            updateInitialAmount={(amount) => updateAmount(amount)}
            initialAmount={amount}
            maxValue={userCashBalance}
            showCurrencyDropdown={LIQUIDITY_STRINGS[modalType].showCurrencyDropdown}
            chosenCash={chosenCash}
            updateCash={updateCash}
            amountError={buttonError}
            updateAmountError={updateButtonError}
          />
          {LIQUIDITY_STRINGS[modalType].setTradingFee && (
            <>
              <ErrorBlock text="Initial liquidity providers are required to set the odds before creating market liquidity." />
              <span
                className={Styles.SmallLabel}
              >
                Set trading fee
                {generateTooltip('Set trading fee', 'tradingFeeInfo')}
              </span>
              <MultiButtonSelection
                options={TRADING_FEE_OPTIONS}
                selection={tradingFeeSelection}
                setSelection={(id) => setTradingFeeSelection(id)}
              />
            </>
          )}
          {createLiquidity && (
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
                editable={createLiquidity}
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
            infoNumbers={breakdown}
          />

          <ApprovalButton
            amm={amm}
            cash={cash}
            actionType={ApprovalAction.ADD_LIQUIDITY}
          />

          <BuySellButton
            action={() => setShowBackView(true)}
            disabled={Boolean(errorMessage)}
            error={buttonError}
            text={errorMessage === '' ? LIQUIDITY_STRINGS[modalType].actionButtonText : errorMessage}
          />
          {LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter && (
            <div className={Styles.FooterText}>
              <span className={Styles.SmallLabel}>
                {LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter.title}
              </span>
              <InfoNumbers
                infoNumbers={
                  breakdown
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
                infoNumbers={
                  LIQUIDITY_STRINGS[modalType].confirmReceiveOverview.breakdown
                }
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
              action={LIQUIDITY_STRINGS[modalType].confirmAction}
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
