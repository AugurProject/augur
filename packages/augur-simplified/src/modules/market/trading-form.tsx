import React, { useEffect, useMemo, useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { BUY, SELL, YES_NO, USDC, ETH } from 'modules/constants';
import { BuySellButton } from '../common/buttons';
import { useAppStatusStore } from '../stores/app-status';
import { CloseIcon, UsdIcon, EthIcon } from 'modules/common/icons';
import { AmmExchange, AmmOutcome, Cash, EstimateEnterTradeResult, EstimateExitTradeResult, TradingDirection } from '../types';
import { formatDai, formatEther, formatPercent } from '../../utils/format-number';
import { ApprovalButton, TinyButton } from '../common/buttons';
import {
  ApprovalAction,
  SHARES,
  OUTCOME_YES_NAME,
  YES_OUTCOME_ID,
  INSUFFICIENT_LIQUIDITY,
  ENTER_AMOUNT,
  INSUFFICIENT_BALANCE,
  SETTINGS_SLIPPAGE,
  OVER_SLIPPAGE,
  ERROR_AMOUNT,
  TX_STATUS,
} from '../constants';
import { CurrencyDropdown } from '../common/selection';
import { generateTooltip } from '../common/labels';
import { doTrade, estimateEnterTrade, estimateExitTrade } from '../../utils/contract-calls';
import { BigNumber as BN } from 'bignumber.js'
import { updateTxStatus } from '../modal/modal-add-liquidity';
import { LinkIcon } from '../common/icons';

export const DefaultMarketOutcomes = [
  {
    id: 0,
    name: 'Invalid',
    price: '$0.00',
    isInvalid: true,
  },
  {
    id: 1,
    name: 'No',
    price: '$0.25',
  },
  {
    id: 2,
    name: 'yes',
    price: '$0.75',
  },
];

const PLACEHOLDER = '0';

const Outcome = ({
  outcome,
  marketType,
  selected,
  onClick,
  showAllHighlighted,
  nonSelectable,
  editable,
  setEditableValue,
  ammCash,
  showAsButton,
  invalidSelected,
  currency
}) => {
  const [customVal, setCustomVal] = useState('');
  const formattedPrice = formatDai(outcome.price);
  return (
    <div
      onClick={() => outcome.isInvalid ? null : onClick()}
      className={classNames(Styles.Outcome, {
        [Styles.YesNo]: !outcome.isInvalid && marketType === YES_NO,
        [Styles.Selected]: selected,
        [Styles.Yes]: outcome.name === OUTCOME_YES_NAME,
        [Styles.ShowAllHighlighted]: showAllHighlighted,
        [Styles.nonSelectable]: nonSelectable,
        [Styles.Edited]: customVal !== '',
        [Styles.showAsButton]: showAsButton,
        [Styles.Invalid]: outcome.isInvalid,
        [Styles.InvalidSelected]: invalidSelected,
      })}
    >
      <span>{outcome.name}</span>
      {editable ? (
        <div>
          <span>{currency === USDC ? '$0.' : '0.'}</span>
          <input
            value={customVal}
            onChange={v => {
              setCustomVal(v.target.value);
              setEditableValue(v.target.value);
            }}
            placeholder={PLACEHOLDER}
          />
        </div>
      ) : (
        <>
          {!outcome.isInvalid && <span>{ammCash?.name === USDC ? formattedPrice.full : formattedPrice.formatted}</span>}
          {outcome.isInvalid && LinkIcon}
        </>
        )}
    </div>
  );
};

interface AmountInputProps {
  updateInitialAmount: (string) => void;
  initialAmount: string;
  maxValue: string;
  showCurrencyDropdown?: boolean;
  updateCash?: (string) => void;
  chosenCash: string;
  rate?: string;
  amountError?: string;
  updateAmountError?: Function;
}

export const AmountInput = ({
  updateInitialAmount,
  initialAmount,
  maxValue,
  showCurrencyDropdown,
  updateCash,
  chosenCash,
  rate,
  updateAmountError
}: AmountInputProps) => {
  const currencyName = chosenCash;
  const [amount, updateAmount] = useState(initialAmount);
  const icon = currencyName === USDC ? UsdIcon : EthIcon;
  const label = currencyName === USDC ? USDC : ETH;
  const showRate = Boolean(rate);
  const prepend = currencyName === USDC ? '$' : '';
  const setMax = () => {
    updateAmount(maxValue);
    updateInitialAmount(maxValue);
  };
  const errorCheck = (value) => {
    let returnError = '';
    if (value !== '' && (isNaN(value) || Number(value) === 0 || Number(value) < 0)) {
      returnError = ERROR_AMOUNT;
    }
    updateAmountError(returnError);
  }
  useEffect(() => updateAmount(initialAmount), [initialAmount])
  useEffect(() => errorCheck(amount), [amount, maxValue])
  return (
    <div
      className={classNames(Styles.AmountInput, { [Styles.Rate]: showRate })}
    >
      <span>amount</span>
      <span onClick={setMax}>balance: {formatEther(maxValue).formatted}</span>
      <div
        className={classNames(Styles.AmountInputDropdown, {
          [Styles.Edited]: amount !== '',
          [Styles.showCurrencyDropdown]: showCurrencyDropdown
        })}
      >
        <span>{prepend}</span>
        <input
          onChange={e => {
            updateAmount(e.target.value);
            updateInitialAmount(e.target.value);
            errorCheck(e.target.value);
          }}
          value={amount}
          placeholder="0"
        />
        {!!currencyName && currencyName !== SHARES && !showCurrencyDropdown && (
          <span className={Styles.CurrencyLabel}>
            {icon} {label}
          </span>
        )}
        {currencyName === SHARES && !showCurrencyDropdown && (
          <span className={Styles.SharesLabel}>
            Shares
            <TinyButton action={setMax} text="Max" />
          </span>
        )}
        {showCurrencyDropdown && (
          <CurrencyDropdown
            defaultValue={chosenCash}
            onChange={cash => updateCash(cash)}
          />
        )}
      </div>
      {showRate && (
        <span className={Styles.RateLabel}>
          <span>Rate</span>
          {rate}
        </span>
      )}
    </div>
  );
};

interface OutcomesGridProps {
  outcomes: AmmOutcome[];
  selectedOutcome?: AmmOutcome;
  setSelectedOutcome: Function;
  marketType: string;
  orderType?: string;
  showAllHighlighted?: boolean;
  nonSelectable?: boolean;
  editable?: boolean;
  setEditableValue?: Function;
  ammCash: Cash;
  showAsButtons?: boolean;
  dontFilterInvalid?: boolean;
  currency: string;
}
export const OutcomesGrid = ({
  outcomes,
  selectedOutcome,
  setSelectedOutcome,
  marketType,
  showAllHighlighted,
  nonSelectable,
  editable,
  setEditableValue,
  ammCash,
  showAsButtons,
  dontFilterInvalid,
  currency
}: OutcomesGridProps) => {
  return (
    <div
      className={classNames(Styles.Outcomes, {
        [Styles.YesNo]: marketType === YES_NO,
        [Styles.nonSelectable]: nonSelectable,
        [Styles.showAsButtons]: showAsButtons
      })}
    >
      {outcomes
        .filter(outcome => dontFilterInvalid ? true : !outcome.isInvalid)
        .reverse().map((outcome, index) => (
          <Outcome
            currency={currency}
            key={outcome.id}
            selected={
              selectedOutcome &&
              (outcome.id === selectedOutcome.id ||
                (showAllHighlighted && !outcome.isInvalid))
            }
            nonSelectable={nonSelectable}
            showAllHighlighted={showAllHighlighted}
            outcome={outcome}
            onClick={() => setSelectedOutcome(outcome)}
            marketType={marketType}
            editable={editable}
            setEditableValue={price => setEditableValue(price, outcome.id)}
            ammCash={ammCash}
            showAsButton={showAsButtons}
            invalidSelected={selectedOutcome?.isInvalid}
          />
        ))}
    </div>
  );
};

interface InfoNumber {
  label: string;
  value: string;
  tooltipText?: string;
  tooltipKey?: string;
}

interface InfoNumbersProps {
  infoNumbers: InfoNumber[];
}

export const InfoNumbers = ({ infoNumbers }: InfoNumbersProps) => {
  return (
    <div className={Styles.OrderInfo}>
      {infoNumbers.map(infoNumber => (
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

const getEnterBreakdown = (breakdown: EstimateEnterTradeResult, cash: Cash) => {
  const avg = breakdown?.averagePrice || "$0.00";
  const sharevalue = breakdown?.outputShares || "0.00";
  const winnings = breakdown?.maxProfit || "$0.00"
  const fees = breakdown?.tradeFees || "$0.00"
  return [
    {
      label: 'average price',
      value: avg,
      tooltipText: 'tooltip copy',
      tooltipKey: 'averagePrice',
    },
    {
      label: 'shares bought',
      value: sharevalue,
    },
    {
      label: 'max winnings',
      value: winnings,
    },
    {
      label: 'Estimated Fees',
      value: fees,
    },
  ];
};

const getExitBreakdown = (breakdown: EstimateExitTradeResult, cash: Cash) => {
  const avg = breakdown?.averagePrice || "$0.00";
  const cashValue = breakdown?.outputCash || "0.00";
  const remaining = breakdown?.remainingShares || "0.00";
  const fees = breakdown?.estimateFees || "$0.00"
  return [
    {
      label: 'Average Price',
      value: avg,
      tooltipText: 'tooltip copy',
      tooltipKey: 'averagePrice',
    },
    {
      label: `Amount You'll Recieve`,
      value: cashValue,
    },
    {
      label: 'Remaining Shares',
      value: remaining,
    },
    {
      label: 'Estimated Fees',
      value: fees,
    },
  ];
};

interface TradeEstimates {
  slippagePercent?: string;
  ratePerCash?: string;
  outputAmount?: string;
}

interface TradingFormProps {
  amm: AmmExchange;
  marketType?: string;
  initialSelectedOutcome: AmmOutcome;
}

interface CanTradeProps {
  disabled: boolean;
  actionText: string;
}

interface CanTradeProps {
  disabled: boolean;
  actionText: string;
}

const TradingForm = ({
  initialSelectedOutcome,
  marketType = YES_NO,
  amm,
}: TradingFormProps) => {
  const {
    isMobile,
    loginAccount,
    approvals,
    actions: { addTransaction, updateTransaction, setShowTradingForm },
    settings: { slippage },
    userInfo: { balances },
  } = useAppStatusStore();
  const [orderType, setOrderType] = useState(BUY);
  const [selectedOutcome, setSelectedOutcome] = useState(
    initialSelectedOutcome
  );
  const [buttonError, updateButtonError] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [breakdown, setBreakdown] = useState(getEnterBreakdown(null, amm?.cash));
  const [amount, setAmount] = useState<string>("");
  const [tradeEstimates, setTradeEstimates] = useState<TradeEstimates>({})

  const ammCash = amm?.cash;
  const outcomes = amm?.ammOutcomes || [];

  useEffect(() => {
    let isMounted = true;

    if (loginAccount?.account && approvals) {
      if (orderType === BUY ) {
        if (approvals?.trade?.enter[ammCash?.name]) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } else if (orderType === SELL) {
        if (approvals?.trade?.exit[ammCash?.name]) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    }

    const getEstimate = async () => {
      const outputYesShares = selectedOutcome.id === YES_OUTCOME_ID;
      if (orderType === BUY) {
        const breakdown = await estimateEnterTrade(amm, amount, outputYesShares);
        if (breakdown && breakdown.outputShares !== "0") {
          const { slippagePercent, ratePerCash: rate, outputShares } = breakdown;
          if (isMounted) {
            setBreakdown(getEnterBreakdown(breakdown, amm?.cash))
            const ratePerCash = `1 ${amm?.cash?.name} = ${rate}`;
            setTradeEstimates({ slippagePercent, ratePerCash, outputAmount: outputShares })
            updateButtonError('');
          }
        } else {
          if (isMounted) {
            updateButtonError(INSUFFICIENT_LIQUIDITY);
            setBreakdown(getEnterBreakdown(null, amm?.cash))
          }
        }
      } else {
        let userBalances = [];
        const hasShares =
          balances?.marketShares && balances?.marketShares[amm?.id];
        if (hasShares) {
          userBalances = hasShares.outcomeSharesRaw;
        }
        const breakdown = await estimateExitTrade(amm, amount, outputYesShares, userBalances);
        if (breakdown && breakdown.outputCash !== "0") {
          const { slippagePercent, ratePerCash: rate, outputCash } = breakdown;

          if (isMounted) {
            setBreakdown(getExitBreakdown(breakdown, amm?.cash))
            const ratePerCash = `1 ${amm?.cash?.name} = ${rate}`;
            setTradeEstimates({ slippagePercent, ratePerCash, outputAmount: outputCash })
            updateButtonError('');
          }
        } else {
          updateButtonError(INSUFFICIENT_LIQUIDITY);
          if (isMounted) {
            setBreakdown(getExitBreakdown(null, amm?.cash))
            updateButtonError(INSUFFICIENT_LIQUIDITY);
          }
        }
      }
    };
    if (orderType && selectedOutcome.id && amount && Number(amount) > 0) {
      getEstimate();
    } else {
      orderType === BUY ? setBreakdown(getEnterBreakdown(null, amm?.cash)) : setBreakdown(getExitBreakdown(null, amm?.cash));
    }
    return () => {
      isMounted = false;
    }
  }, [orderType, selectedOutcome.id, amount, approvals, amm, loginAccount?.account, amm?.cash, ammCash?.name, balances?.marketShares]);

  const userBalance = useMemo(() => {
    return orderType === BUY ? amm?.cash?.name
      ? balances[amm?.cash?.name]?.balance
      : '0' : balances?.marketShares && balances?.marketShares[amm?.id] &&
        balances?.marketShares[amm?.id].outcomeShares ?
        balances?.marketShares[amm?.id].outcomeShares[selectedOutcome.id]
        : "0"

  }, [orderType, amm?.cash?.name, amm?.id, selectedOutcome.id, balances]);

  const canMakeTrade: CanTradeProps = useMemo(() => {
    let actionText = buttonError || orderType;
    let disabled = false;
    if (Number(amount) === 0 || isNaN(Number(amount)) || amount === '') {
      actionText = ENTER_AMOUNT;
      disabled = true;
    } else if (new BN(amount).gt(new BN(userBalance))) {
      actionText = INSUFFICIENT_BALANCE;
      disabled = true;
    } else if (new BN(slippage || SETTINGS_SLIPPAGE).lt(new BN(tradeEstimates?.slippagePercent))) {
      actionText = OVER_SLIPPAGE;
      disabled = true;
    }

    return {
      disabled,
      actionText
    }
  }, [orderType, amount, buttonError, userBalance, tradeEstimates, slippage]);

  const makeTrade = () => {
    const minOutput = tradeEstimates?.outputAmount;
    const percentageOff = new BN(1).minus(new BN(slippage).div(100));
    const worstCaseOutput = String(new BN(minOutput).times(percentageOff));
    const direction = orderType === BUY ? TradingDirection.ENTRY : TradingDirection.EXIT;
    const outputYesShares = selectedOutcome.id === YES_OUTCOME_ID;
    let userBalances = [];
    const hasShares = balances?.marketShares && balances?.marketShares[amm?.id];
    if (hasShares) {
      userBalances = hasShares.outcomeShares;
    }
    doTrade(direction, amm, worstCaseOutput, amount, outputYesShares, userBalances)
    .then(response => {
      if (response) {
        const { hash } = response;
        addTransaction({
          hash,
          chainId: loginAccount.chainId,
          seen: false,
          status: TX_STATUS.PENDING,
          from: loginAccount.account,
          addedTime: new Date().getTime(),
          message: `${direction === TradingDirection.ENTRY ? 'Enter' : 'Exit'} Trade`,
          marketDescription: amm?.market?.description,
        });
        response.wait().then(response => updateTxStatus(response, updateTransaction));
      }
    })
    .catch(e => {
      //TODO: handle errors here
    });
  }

  return (
    <div className={Styles.TradingForm}>
      <div>
        <span
          onClick={() => {
            setOrderType(BUY)
            setBreakdown(getEnterBreakdown(null, ammCash))
          }}
          className={classNames({ [Styles.Selected]: BUY === orderType })}
        >
          {BUY}
        </span>
        <span
          onClick={() => {
            setBreakdown(getExitBreakdown(null, ammCash))
            setOrderType(SELL)
          }}
          className={classNames({ [Styles.Selected]: SELL === orderType })}
        >
          {SELL}
        </span>
        <div>
          <span>fee</span>
          <span>{formatPercent(amm?.feeDecimal).full}</span>
        </div>
        {isMobile && (
          <div onClick={() => setShowTradingForm(false)}>{CloseIcon}</div>
        )}
      </div>
      <div>
        <OutcomesGrid
          outcomes={outcomes}
          selectedOutcome={selectedOutcome}
          setSelectedOutcome={setSelectedOutcome}
          marketType={marketType}
          orderType={orderType}
          ammCash={ammCash}
          dontFilterInvalid
          currency={orderType === BUY ? ammCash?.name : SHARES}
        />
        <AmountInput
          chosenCash={orderType === BUY ? ammCash?.name : SHARES}
          updateInitialAmount={setAmount}
          initialAmount={''}
          maxValue={userBalance}
          rate={tradeEstimates?.ratePerCash}
          updateAmountError={updateButtonError}
        />
        <InfoNumbers infoNumbers={breakdown} />
        {loginAccount && !isApproved && orderType === BUY && (
          <ApprovalButton amm={amm} cash={ammCash} actionType={ApprovalAction.ENTER_POSITION} />
        )}
        {loginAccount && !isApproved && orderType === SELL && (
          <ApprovalButton amm={amm} cash={ammCash} actionType={ApprovalAction.EXIT_POSITION} />
        )}
        <BuySellButton
          disabled={canMakeTrade.disabled || !isApproved}
          action={makeTrade}
          text={canMakeTrade.actionText}
          error={buttonError}
        />
      </div>
    </div>
  );
};

export default TradingForm;
