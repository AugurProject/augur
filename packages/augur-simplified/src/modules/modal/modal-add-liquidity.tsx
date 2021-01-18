import React, { useEffect, useMemo, useState } from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { Header } from './common';
import {
  YES_NO,
  BUY,
  USDC,
  SHARES,
  ApprovalAction,
  ENTER_AMOUNT,
  YES_OUTCOME_ID,
  NO_OUTCOME_ID,
  CREATE,
  ADD,
  REMOVE,
  LIQUIDITY_STRINGS,
  CONNECT_ACCOUNT,
  SET_PRICES,
  TX_STATUS,
  INSUFFICIENT_BALANCE,
} from '../constants';
import { OutcomesGrid, AmountInput, InfoNumbers } from '../market/trading-form';
import { ApprovalButton, BuySellButton } from '../common/buttons';
import { ErrorBlock, generateTooltip } from '../common/labels';
import {
  convertDisplayShareAmountToOnChainShareAmount,
  formatPercent,
  convertOnChainSharesToDisplayShareAmount,
} from '../../utils/format-number';
import { MultiButtonSelection } from '../common/selection';
import classNames from 'classnames';
import {
  AddLiquidityBreakdown,
  AmmOutcome,
  Cash,
  LiquidityBreakdown,
  MarketInfo,
} from '../types';
import {
  checkConvertLiquidityProperties,
  doAmmLiquidity,
  doRemoveAmmLiquidity,
  getAmmLiquidity,
  getRemoveLiquidity,
} from '../../utils/contract-calls';
import { useAppStatusStore } from '../stores/app-status';
import { BigNumber as BN } from 'bignumber.js';

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
    price: '0',
    isInvalid: true,
  },
  {
    id: 1,
    name: 'No',
    price: '0',
  },
  {
    id: 2,
    name: 'Yes',
    price: '0',
  },
];

const getRemoveLiquidityBreakdown = (
  breakdown: LiquidityBreakdown,
  cash: Cash
) => {
  return [
    {
      label: 'yes shares',
      value: breakdown.yesShares,
    },
    {
      label: 'no shares',
      value: breakdown.noShares,
    },
    {
      label: `${cash?.name || 'collateral'}`,
      value: breakdown.cashAmount,
    },
  ];
};

const getAddAdditionBreakdown = (breakdown: AddLiquidityBreakdown) => {
  return [
    {
      label: 'yes shares',
      value: breakdown.yesShares,
    },
    {
      label: 'no shares',
      value: breakdown.noShares,
    },
    {
      label: 'liquidity shares',
      value: breakdown.lpTokens,
    },
  ];
};
interface ModalAddLiquidityProps {
  market: MarketInfo;
  liquidityModalType: string;
  currency?: string;
}

export const updateTxStatus = (txResponse, updateTransaction) => {
  if (txResponse.confirmations > 0) {
    // TODO temp workaround
    const tx =
      window.appStatus.transactions ||
      JSON.parse(window.localStorage.getItem('transactions'));
    const updateTxState = tx.find(
      (tx) => tx.hash === txResponse.transactionHash
    );
    if (updateTxState) {
      updateTxState.status = TX_STATUS.CONFIRMED;
      updateTransaction(txResponse.transactionHash, updateTxState);
    }
  }
};

const ModalAddLiquidity = ({
  market,
  liquidityModalType,
  currency,
}: ModalAddLiquidityProps) => {
  const {
    userInfo: { balances },
    approvals,
    processed: { cashes },
    loginAccount,
    actions: { closeModal, addTransaction, updateTransaction },
  } = useAppStatusStore();
  const account = loginAccount?.account;

  let amm = market?.amm;
  const mustSetPrices =
    !amm || amm?.liquidity === undefined || amm?.liquidity === '0';
  const modalType = liquidityModalType;

  const [outcomes, setOutcomes] = useState<AmmOutcome[]>(
    amm ? amm.ammOutcomes : fakeYesNoOutcomes
  );
  const [showBackView, setShowBackView] = useState(false);
  const [chosenCash, updateCash] = useState<string>(currency ? currency : USDC);
  const [buttonError, updateButtonError] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  // needs to be set by currency picker if amm is null
  const [breakdown, setBreakdown] = useState(defaultAddLiquidityBreakdown);
  const [estimatedLpAmount, setEstimatedLpAmount] = useState<string>('0');
  const [tradingFeeSelection, setTradingFeeSelection] = useState<number>(
    TRADING_FEE_OPTIONS[2].id
  );

  const cash = useMemo(() => {
    return cashes && chosenCash
      ? Object.values(cashes).find((c) => c.name === chosenCash)
      : Object.values(cashes)[0];
  }, [chosenCash]);

  const userTokenBalance = cash?.name ? balances[cash?.name]?.balance : '0';
  const shareBalance =
    balances &&
    balances.lpTokens &&
    balances.lpTokens[amm?.id] &&
    balances.lpTokens[amm?.id]?.balance;
  const userMaxAmount = modalType === REMOVE ? shareBalance : userTokenBalance;

  const [amount, updateAmount] = useState(userMaxAmount);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const percentFormatted = useMemo(() => {
    const feeOption = TRADING_FEE_OPTIONS.find(
      (t) => t.id === tradingFeeSelection
    );
    const feePercent = LIQUIDITY_STRINGS[modalType].setFees
      ? feeOption.value
      : amm?.feeDecimal;
    return formatPercent(feePercent).full;
  }, [tradingFeeSelection, amm?.feeDecimal, modalType]);

  const userPercentOfPool = useMemo(() => {
    let userPercent = '100';
    const rawSupply = amm?.totalSupply;
    if (rawSupply) {
      if (modalType === ADD) {
        const displaySupply = convertOnChainSharesToDisplayShareAmount(
          rawSupply,
          cash?.decimals
        );
        userPercent = String(
          new BN(estimatedLpAmount)
            .plus(new BN(shareBalance || '0'))
            .div(new BN(displaySupply).plus(new BN(estimatedLpAmount)))
            .times(new BN(100))
        );
      } else if (modalType === REMOVE) {
        const userBalanceLpTokens =
          balances && balances.lpTokens && balances.lpTokens[amm?.id];
        const userAmount = userBalanceLpTokens?.rawBalance || '0';
        const estUserAmount = convertDisplayShareAmountToOnChainShareAmount(
          amount,
          cash?.decimals
        );
        userPercent = String(
          new BN(userAmount || '0')
            .minus(new BN(estUserAmount))
            .div(new BN(rawSupply).minus(new BN(estUserAmount)))
        );
      }
    }

    return formatPercent(userPercent).full;
  }, [
    amm?.totalSupply,
    amount,
    balances,
    shareBalance,
    estimatedLpAmount,
    amm?.id,
    cash?.decimals,
    modalType,
  ]);

  useEffect(() => {
    LIQUIDITY_METHODS[modalType].receiveBreakdown();

    if (account && approvals) {
      if (modalType === REMOVE) {
        if (approvals?.liquidity?.remove[cash?.name]) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } else if (modalType === ADD) {
        if (approvals?.liquidity?.add[cash?.name]) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    }
  }, [
    account,
    amount,
    tradingFeeSelection,
    cash,
    outcomes[YES_OUTCOME_ID]?.price,
    outcomes[NO_OUTCOME_ID]?.price,
  ]);

  const InputFormError = useMemo(() => {
    if (errorMessage) return errorMessage;
    if (!amount || amount === '0') return ENTER_AMOUNT;
    if (!account) return CONNECT_ACCOUNT;
    if (new BN(amount).gt(new BN(userMaxAmount))) return INSUFFICIENT_BALANCE;
    if (modalType === CREATE) {
      const yesPrice = outcomes[YES_OUTCOME_ID].price;
      const noPrice = outcomes[NO_OUTCOME_ID].price;
      if (
        yesPrice === '0' ||
        !yesPrice ||
        noPrice === '0' ||
        !noPrice ||
        noPrice === '0.00' ||
        yesPrice === '0.00'
      ) {
        return SET_PRICES;
      }
    }
  }, [
    errorMessage,
    buttonError,
    modalType,
    outcomes[YES_OUTCOME_ID]?.price,
    outcomes[NO_OUTCOME_ID]?.price,
    amount,
    account,
    userMaxAmount,
  ]);

  const LIQUIDITY_METHODS = {
    [REMOVE]: {
      footerText:
        'Need some copy here explaining why the user may recieve some shares when they remove their liquidity and they would need to sell these if possible.',
      receiveBreakdown: async () => {
        const fee = String(amm.feeRaw);
        const properties = checkConvertLiquidityProperties(
          account,
          market.marketId,
          amount,
          fee,
          outcomes,
          cash,
          amm
        );
        if (!properties) {
          return defaultAddLiquidityBreakdown;
        }
        const results = await getRemoveLiquidity(
          properties.marketId,
          cash,
          fee,
          amount
        );
        if (!results) {
          setErrorMessage('Estimation error');
          return defaultAddLiquidityBreakdown;
        }
        setErrorMessage('');
        setBreakdown(getRemoveLiquidityBreakdown(results, cash));
      },
      liquidityDetailsFooter: {
        breakdown: [
          {
            label: 'Trading fee',
            value: `${percentFormatted}`,
          },
          {
            label: 'your share of the liquidity pool',
            value: `${userPercentOfPool}`,
          },
          {
            label: 'your total fees earned',
            value: '-',
          },
        ],
      },
      confirmAction: async () => {
        if (!account || !market.marketId || !amount || !cash)
          return defaultAddLiquidityBreakdown;
        const fee = String(amm.feeRaw);
        const properties = checkConvertLiquidityProperties(
          account,
          market.marketId,
          amount,
          fee,
          outcomes,
          cash,
          amm
        );
        if (!properties) {
          return defaultAddLiquidityBreakdown;
        }
        doRemoveAmmLiquidity(
          properties.marketId,
          properties.cash,
          properties.fee,
          properties.amount
        )
          .then((response) => {
            const { hash } = response;
            addTransaction({
              hash,
              chainId: loginAccount.chainId,
              seen: false,
              status: TX_STATUS.PENDING,
              from: account,
              addedTime: new Date().getTime(),
              message: `Remove Liquidity`,
              marketDescription: market.description,
            });
            response
              .wait()
              .then((response) => updateTxStatus(response, updateTransaction));
          })
          .catch((e) => {
            //TODO: handle errors here
          });
        closeModal();
      },
      confirmOverview: {
        breakdown: [
          {
            label: 'liquidity shares',
            value: `${amount}`,
          },
        ],
      },
      confirmReceiveOverview: {
        breakdown: [
          ...breakdown,
          {
            label: 'Fees Earned',
            value: '-',
          },
        ],
      },
    },
    [ADD]: {
      footerText: `By adding liquidity you'll earn ${percentFormatted} of all trades on this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`,
      receiveBreakdown: async () => {
        const fee = amm.feeRaw;
        const properties = checkConvertLiquidityProperties(
          account,
          market.marketId,
          amount,
          fee,
          outcomes,
          cash,
          amm
        );
        if (!properties) {
          return defaultAddLiquidityBreakdown;
        }
        const results = await getAmmLiquidity(
          properties.account,
          properties.amm,
          properties.marketId,
          properties.cash,
          properties.fee,
          properties.amount,
          properties.priceNo,
          properties.priceYes
        );
        if (!results) {
          setErrorMessage('Estimation error');
          return defaultAddLiquidityBreakdown;
        }
        setErrorMessage('');
        setBreakdown(getAddAdditionBreakdown(results));
        setEstimatedLpAmount(results.lpTokens);
      },
      approvalButtonText: `approve ${chosenCash}`,
      confirmAction: async () => {
        const fee = amm.feeRaw;
        const properties = checkConvertLiquidityProperties(
          account,
          market.marketId,
          amount,
          fee,
          outcomes,
          cash,
          amm
        );
        if (!properties) {
          return defaultAddLiquidityBreakdown;
        }
        setErrorMessage('');
        const hasLiquidity =
          amm !== null && amm?.id !== undefined && amm?.liquidity !== '0';
        doAmmLiquidity(
          properties.account,
          properties.amm,
          properties.marketId,
          properties.cash,
          properties.fee,
          properties.amount,
          hasLiquidity,
          properties.priceNo,
          properties.priceYes
        )
          .then((response) => {
            const { hash } = response;
            addTransaction({
              hash,
              chainId: loginAccount.chainId,
              from: account,
              seen: false,
              status: TX_STATUS.PENDING,
              addedTime: new Date().getTime(),
              message: `Add Liquidity`,
              marketDescription: market.description,
            });
            response
              .wait()
              .then((response) => updateTxStatus(response, updateTransaction));
          })
          .catch((e) => {
            // TODO: handle error here
          });
        closeModal();
      },
      confirmOverview: {
        breakdown: [
          {
            label: 'amount',
            value: `${amount} ${amm?.cash?.name}`,
          },
        ],
      },
      confirmReceiveOverview: {
        breakdown: breakdown,
      },
      marketLiquidityDetails: {
        breakdown: [
          {
            label: 'trading fee',
            value: `${percentFormatted}`,
          },
          {
            label: 'your share of the pool',
            value: `${userPercentOfPool}`,
          },
        ],
      },
      currencyName: `${chosenCash}`,
    },
    [CREATE]: {
      currencyName: `${chosenCash}`,
      footerText:
        "By adding initial liquidity you'll earn your set trading fee percentage of all trades on this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
      receiveBreakdown: async () => {
        const feeSelected = TRADING_FEE_OPTIONS.find(
          (t) => t.id === tradingFeeSelection
        );
        const fee = market?.amm?.feeRaw
          ? market?.amm?.feeRaw
          : String(feeSelected ? feeSelected.value : '0');
        const properties = checkConvertLiquidityProperties(
          account,
          market.marketId,
          amount,
          fee,
          outcomes,
          cash,
          amm
        );
        if (!properties) {
          return defaultAddLiquidityBreakdown;
        }
        const results = await getAmmLiquidity(
          properties.account,
          properties.amm,
          properties.marketId,
          properties.cash,
          properties.fee,
          properties.amount,
          properties.priceNo,
          properties.priceYes
        );
        if (!results) {
          setErrorMessage('Estimation error');
          return defaultAddLiquidityBreakdown;
        }
        setErrorMessage('');
        setBreakdown(getAddAdditionBreakdown(results));
      },
      approvalButtonText: `approve ${chosenCash}`,
      confirmAction: async () => {
        const feeSelected = TRADING_FEE_OPTIONS.find(
          (t) => t.id === tradingFeeSelection
        );
        const fee = market?.amm?.feeRaw
          ? market?.amm?.feeRaw
          : String(feeSelected ? feeSelected.value : '0');
        const properties = checkConvertLiquidityProperties(
          account,
          market.marketId,
          amount,
          fee,
          outcomes,
          cash,
          amm
        );
        if (!properties) {
          return defaultAddLiquidityBreakdown;
        }
        await doAmmLiquidity(
          properties.account,
          properties.amm,
          properties.marketId,
          properties.cash,
          properties.fee,
          properties.amount,
          false,
          properties.priceNo,
          properties.priceYes
        )
          .then((response) => {
            const { hash } = response;
            addTransaction({
              hash,
              chainId: loginAccount.chainId,
              from: account,
              seen: false,
              status: TX_STATUS.PENDING,
              addedTime: new Date().getTime(),
              message: `Add Liquidity`,
              marketDescription: market.description,
            });
            response
              .wait()
              .then((response) => updateTxStatus(response, updateTransaction));
          })
          .catch((e) => {
            // TODO: handle error
          });
        closeModal();
      },
      confirmOverview: {
        breakdown: [
          {
            label: 'amount',
            value: `${amount} ${cash?.name}`,
          },
        ],
      },
      confirmReceiveOverview: {
        breakdown: breakdown,
      },
      marketLiquidityDetails: {
        breakdown: [
          {
            label: 'trading fee',
            value: `${percentFormatted}`,
          },
          {
            label: 'your share of the pool',
            value: `${userPercentOfPool}`,
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
          {!LIQUIDITY_STRINGS[modalType].cantEditAmount && (
            <>
              {LIQUIDITY_STRINGS[modalType].amountSubtitle && (
                <span className={Styles.SmallLabel}>
                  {LIQUIDITY_STRINGS[modalType].amountSubtitle}
                </span>
              )}
              <AmountInput
                updateInitialAmount={(amount) => updateAmount(amount)}
                initialAmount={modalType === REMOVE ? '' : amount}
                maxValue={userMaxAmount}
                showCurrencyDropdown={!currency}
                chosenCash={modalType === REMOVE ? SHARES : chosenCash}
                updateCash={updateCash}
                updateAmountError={updateButtonError}
              />
            </>
          )}
          {LIQUIDITY_STRINGS[modalType].setFees && (
            <>
              <ErrorBlock text="Initial liquidity providers are required to set the starting prices before adding market liquidity." />
              <span className={Styles.SmallLabel}>
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
          {!LIQUIDITY_STRINGS[modalType].hideCurrentOdds && (
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
                editable={mustSetPrices}
                setEditableValue={(price, index) => {
                  const newOutcomes = outcomes;
                  newOutcomes[index].price = price;
                  setOutcomes(newOutcomes);
                }}
                ammCash={cash}
              />
            </>
          )}
          <span className={Styles.SmallLabel}>
            {LIQUIDITY_STRINGS[modalType].receiveTitle}
          </span>
          <InfoNumbers infoNumbers={breakdown} />

          <ApprovalButton
            amm={amm}
            cash={cash}
            actionType={
              modalType !== REMOVE
                ? ApprovalAction.ADD_LIQUIDITY
                : ApprovalAction.REMOVE_LIQUIDITY
            }
          />

          <BuySellButton
            action={() => setShowBackView(true)}
            disabled={!isApproved || Boolean(InputFormError)}
            error={buttonError}
            text={
              !InputFormError
                ? buttonError
                  ? buttonError
                  : LIQUIDITY_STRINGS[modalType].actionButtonText
                : InputFormError
            }
          />
          {LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter && (
            <div className={Styles.FooterText}>
              <span className={Styles.SmallLabel}>
                {LIQUIDITY_STRINGS[modalType].liquidityDetailsFooter.title}
              </span>
              <InfoNumbers
                infoNumbers={
                  LIQUIDITY_METHODS[modalType].liquidityDetailsFooter.breakdown
                }
              />
            </div>
          )}
          <div className={Styles.FooterText}>
            {LIQUIDITY_METHODS[modalType].footerText}
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
                LIQUIDITY_METHODS[modalType].confirmOverview.breakdown
              }
            />
          </section>

          <section>
            <span className={Styles.SmallLabel}>
              {LIQUIDITY_STRINGS[modalType].confirmReceiveOverview.title}
            </span>
            <InfoNumbers
              infoNumbers={
                LIQUIDITY_METHODS[modalType].confirmReceiveOverview.breakdown
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
                  LIQUIDITY_METHODS[modalType].marketLiquidityDetails.breakdown
                }
              />
            </section>
          )}
          <BuySellButton
            text={LIQUIDITY_STRINGS[modalType].confirmButtonText}
            action={LIQUIDITY_METHODS[modalType].confirmAction}
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
