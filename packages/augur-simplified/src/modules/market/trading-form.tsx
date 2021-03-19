import React, { useEffect, useMemo, useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { useSimplifiedStore } from '../stores/simplified';
import {
  AmmExchange,
  AmmOutcome,
  Cash,
  EstimateTradeResult,
  TradingDirection,
} from '../types';
import { BigNumber as BN } from 'bignumber.js';
import {
  Formatter,
  Constants,
  ContractCalls,
  useAppStatusStore,
  useUserStore,
  useCanEnterCashPosition,
  useCanExitCashPosition,
  Components,
} from '@augurproject/augur-comps';
import { useTrackedEvents } from '../../utils/tracker';
import { Slippage } from '../common/slippage';
const { doTrade, estimateEnterTrade, estimateExitTrade } = ContractCalls;
const {
  Icons: { CloseIcon },
  LabelComps: { generateTooltip },
  InputComps: { AmountInput, OutcomesGrid },
  ButtonComps: { ApprovalButton, BuySellButton },
} = Components;
const {
  formatCash,
  formatCashPrice,
  formatPercent,
  formatSimpleShares,
} = Formatter;
const {
  ApprovalAction,
  SHARES,
  YES_OUTCOME_ID,
  INSUFFICIENT_LIQUIDITY,
  ENTER_AMOUNT,
  SETTINGS_SLIPPAGE,
  ERROR_AMOUNT,
  TX_STATUS,
  BUY,
  SELL,
  YES_NO,
} = Constants;
const AVG_PRICE_TIP =
  'The difference between the market price and estimated price due to trade size.';

interface InfoNumber {
  label: string;
  value: string;
  tooltipText?: string;
  tooltipKey?: string;
}

interface InfoNumbersProps {
  infoNumbers: InfoNumber[];
  unedited?: boolean;
}

export const InfoNumbers = ({ infoNumbers, unedited }: InfoNumbersProps) => {
  return (
    <div
      className={classNames(Styles.OrderInfo, {
        [Styles.Populated]: !unedited,
      })}
    >
      {infoNumbers.map((infoNumber) => (
        <div key={infoNumber.label}>
          <span>
            {infoNumber.label}
            {infoNumber.tooltipText &&
              generateTooltip(infoNumber.tooltipText, infoNumber.tooltipKey)}
          </span>
          <span>{infoNumber.value}</span>
        </div>
      ))}
    </div>
  );
};

const getEnterBreakdown = (breakdown: EstimateTradeResult, cash: Cash) => {
  return [
    {
      label: 'Average Price',
      value: !isNaN(Number(breakdown?.averagePrice))
        ? formatCashPrice(breakdown.averagePrice, cash?.name).full
        : '-',
      tooltipText: AVG_PRICE_TIP,
      tooltipKey: 'averagePrice',
    },
    {
      label: 'Estimated Shares',
      value: !isNaN(Number(breakdown?.outputValue))
        ? formatSimpleShares(breakdown.outputValue).full
        : '-',
    },
    {
      label: 'Max Profit',
      value: !isNaN(Number(breakdown?.maxProfit))
        ? formatCash(breakdown.maxProfit, cash?.name).full
        : '-',
    },
    {
      label: 'Estimated Fees (Shares)',
      value: !isNaN(Number(breakdown?.tradeFees))
        ? formatSimpleShares(breakdown.tradeFees).full
        : '-',
    },
  ];
};

const getExitBreakdown = (breakdown: EstimateTradeResult, cash: Cash) => {
  return [
    {
      label: 'Average Price',
      value: !isNaN(Number(breakdown?.averagePrice))
        ? formatCashPrice(breakdown.averagePrice, cash?.name).full
        : '-',
      tooltipText: AVG_PRICE_TIP,
      tooltipKey: 'averagePrice',
    },
    {
      label: `Amount You'll Recieve`,
      value: !isNaN(Number(breakdown?.outputValue))
        ? formatCash(breakdown.outputValue, cash?.name).full
        : '-',
    },
    {
      label: 'Remaining Shares',
      value: !isNaN(Number(breakdown?.remainingShares))
        ? formatSimpleShares(breakdown.remainingShares).full
        : '-',
    },
    {
      label: `Estimated Fees (${cash.name})`,
      value: !isNaN(Number(breakdown?.tradeFees))
        ? formatCash(breakdown.tradeFees, cash?.name).full
        : '-',
    },
  ];
};

const formatBreakdown = (
  isBuy: boolean,
  breakdown: EstimateTradeResult,
  cash: Cash
) =>
  isBuy
    ? getEnterBreakdown(breakdown, cash)
    : getExitBreakdown(breakdown, cash);

interface TradingFormProps {
  amm: AmmExchange;
  marketType?: string;
  initialSelectedOutcome: AmmOutcome;
}

interface CanTradeProps {
  disabled: boolean;
  actionText: string;
  subText?: string | null;
}

const TradingForm = ({
  initialSelectedOutcome,
  marketType = YES_NO,
  amm,
}: TradingFormProps) => {
  const { isLogged } = useAppStatusStore();
  const {
    showTradingForm,
    actions: { setShowTradingForm },
    settings: { slippage },
  } = useSimplifiedStore();
  const {
    loginAccount,
    balances,
    actions: { addTransaction },
  } = useUserStore();
  const [orderType, setOrderType] = useState(BUY);
  const [selectedOutcome, setSelectedOutcome] = useState(
    initialSelectedOutcome
  );
  const { tradingEstimateEvents, tradingEvents } = useTrackedEvents();
  const [breakdown, setBreakdown] = useState<EstimateTradeResult>(null);
  const [amount, setAmount] = useState<string>('');
  const [waitingToSign, setWaitingToSign] = useState(false);
  const ammCash = amm?.cash;
  const outcomes = amm?.ammOutcomes || [];
  const isBuy = orderType === BUY;
  const canExitPosition = useCanExitCashPosition({
    name: ammCash?.name,
    shareToken: ammCash?.shareToken,
  });
  const canEnterPosition = useCanEnterCashPosition(ammCash);
  const isApprovedTrade = isBuy ? canEnterPosition : canExitPosition;
  const hasLiquidity = amm.liquidity !== '0';
  const approvalAction = !isApprovedTrade
    ? isBuy
      ? ApprovalAction.ENTER_POSITION
      : ApprovalAction.EXIT_POSITION
    : null;
  const selectedOutcomeId = selectedOutcome.id;
  const marketShares =
    balances?.marketShares && balances?.marketShares[amm?.id];
  const outcomeSharesRaw = JSON.stringify(marketShares?.outcomeSharesRaw);
  const amountError =
    amount !== '' &&
    (isNaN(Number(amount)) || Number(amount) === 0 || Number(amount) < 0);
  const buttonError = amountError ? ERROR_AMOUNT : '';

  useEffect(() => {
    let isMounted = true;
    function handleShowTradingForm() {
      if (window.innerWidth >= 1200 && showTradingForm && isMounted) {
        setShowTradingForm(false);
        setAmount('');
      }
    }
    window.addEventListener('resize', handleShowTradingForm);
    isMounted && setShowTradingForm(false);
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleShowTradingForm);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const getEstimate = async () => {
      const outputYesShares = selectedOutcomeId === YES_OUTCOME_ID;
      let userBalances = [];
      if (outcomeSharesRaw) {
        userBalances = marketShares?.outcomeSharesRaw;
      }
      const breakdown = isBuy
        ? await estimateEnterTrade(amm, amount, outputYesShares)
        : await estimateExitTrade(amm, amount, outputYesShares, userBalances);

      tradingEstimateEvents(
        isBuy ? BUY : SELL,
        outputYesShares,
        amm?.cash?.name,
        amount,
        breakdown?.outputValue
      );

      isMounted && setBreakdown(breakdown);
    };

    if (amount && Number(amount) > 0) {
      getEstimate();
    } else if (breakdown !== null) {
      isMounted && setBreakdown(null);
    }

    return () => {
      isMounted = false;
    };
  }, [
    orderType,
    selectedOutcomeId,
    amount,
    outcomeSharesRaw,
    amm?.volumeTotal,
    amm?.liquidity,
  ]);

  const userBalance = String(
    useMemo(() => {
      return isBuy
        ? amm?.cash?.name
          ? balances[amm?.cash?.name]?.balance
          : '0'
        : marketShares?.outcomeShares
        ? marketShares?.outcomeShares[selectedOutcomeId]
        : '0';
    }, [orderType, amm?.cash?.name, amm?.id, selectedOutcomeId, balances])
  );

  const canMakeTrade: CanTradeProps = useMemo(() => {
    let actionText = buttonError || orderType;
    let subText = null;
    let disabled = false;
    if (!isLogged) {
      actionText = 'Connect Wallet';
      disabled = true;
    } else if (!hasLiquidity) {
      actionText = 'Liquidity Depleted';
      disabled = true;
    } else if (Number(amount) === 0 || isNaN(Number(amount)) || amount === '') {
      actionText = ENTER_AMOUNT;
      disabled = true;
    } else if (new BN(amount).gt(new BN(userBalance))) {
      actionText = `Insufficient ${isBuy ? ammCash.name : 'Share'} Balance`;
      disabled = true;
    } else if (breakdown === null) {
      actionText = INSUFFICIENT_LIQUIDITY;
      disabled = true;
    } else if (
      new BN(slippage || SETTINGS_SLIPPAGE).lt(
        new BN(breakdown?.slippagePercent)
      )
    ) {
      subText = `(Adjust slippage tolerance to ${Math.ceil(
        Number(breakdown.slippagePercent)
      )}%)`;
      disabled = true;
    } else if (waitingToSign) {
      actionText = "Waiting for Confirmation";
      disabled = true;
      subText = "(Confirm the transaction in your wallet)";
    }

    return {
      disabled,
      actionText,
      subText,
    };
  }, [
    orderType,
    amount,
    buttonError,
    userBalance,
    breakdown?.slippagePercent,
    slippage,
    hasLiquidity,
    waitingToSign
  ]);

  const makeTrade = () => {
    const minOutput = breakdown?.outputValue;
    const percentageOff = new BN(1).minus(new BN(slippage).div(100));
    const worstCaseOutput = String(new BN(minOutput).times(percentageOff));
    const direction = isBuy ? TradingDirection.ENTRY : TradingDirection.EXIT;
    const outputYesShares = selectedOutcomeId === YES_OUTCOME_ID;
    const userBalances = marketShares?.outcomeSharesRaw || [];
    setWaitingToSign(true);
    setShowTradingForm(false);
    tradingEvents(
      isBuy,
      outputYesShares,
      amm?.cash?.name,
      amount,
      worstCaseOutput
    );
    doTrade(
      direction,
      amm,
      worstCaseOutput,
      amount,
      outputYesShares,
      userBalances
    )
      .then((response) => {
        if (response) {
          const { hash } = response;
          setAmount('');
          setWaitingToSign(false);
          addTransaction({
            hash,
            chainId: loginAccount.chainId,
            seen: false,
            status: TX_STATUS.PENDING,
            from: loginAccount.account,
            addedTime: new Date().getTime(),
            message: `${
              direction === TradingDirection.ENTRY ? 'Buy' : 'Sell'
            } Shares`,
            marketDescription: amm?.market?.description,
          });
        }
      })
      .catch((e) => {
        //TODO: handle errors here
        setWaitingToSign(false);
      });
  };

  return (
    <div className={Styles.TradingForm}>
      <div>
        <span
          onClick={() => {
            setOrderType(BUY);
            setBreakdown(null);
            setAmount('');
          }}
          className={classNames({ [Styles.Selected]: isBuy })}
        >
          {BUY}
        </span>
        <span
          onClick={() => {
            setBreakdown(null);
            setOrderType(SELL);
            setAmount('');
          }}
          className={classNames({ [Styles.Selected]: !isBuy })}
        >
          {SELL}
        </span>
        <div>
          <span>fee</span>
          <span>{formatPercent(amm?.feeInPercent).full}</span>
        </div>
        <div
          onClick={() => {
            setShowTradingForm(false);
            setAmount('');
          }}
        >
          {CloseIcon}
        </div>
      </div>
      <div>
        <OutcomesGrid
          outcomes={outcomes}
          selectedOutcome={selectedOutcome}
          setSelectedOutcome={(outcome) => {
            setSelectedOutcome(outcome);
            setAmount('');
          }}
          marketType={marketType}
          orderType={orderType}
          ammCash={ammCash}
          dontFilterInvalid
        />
        <AmountInput
          chosenCash={isBuy ? ammCash?.name : SHARES}
          updateInitialAmount={setAmount}
          initialAmount={amount}
          error={amountError}
          maxValue={userBalance}
          ammCash={ammCash}
          disabled={!hasLiquidity}
          rate={
            !isNaN(Number(breakdown?.ratePerCash))
              ? `1 ${amm?.cash?.name} = ${
                  formatSimpleShares(breakdown?.ratePerCash, {
                    denomination: (v) => `${v} Shares`,
                  }).full
                }`
              : null
          }
          isBuy={orderType === BUY}
        />
        <Slippage />
        <InfoNumbers infoNumbers={formatBreakdown(isBuy, breakdown, ammCash)} />
        {isLogged && !isApprovedTrade && (
          <ApprovalButton
            {...{ amm, cash: ammCash, actionType: approvalAction }}
          />
        )}
        <BuySellButton
          disabled={canMakeTrade.disabled || !isApprovedTrade}
          action={makeTrade}
          text={canMakeTrade.actionText}
          subText={canMakeTrade.subText}
          error={buttonError}
        />
      </div>
    </div>
  );
};

export default TradingForm;
