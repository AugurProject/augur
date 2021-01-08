import React, { useEffect, useMemo, useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { BUY, SELL, YES_NO, USDC, ETH } from 'modules/constants';
import { BuySellButton } from '../common/buttons';
import { useAppStatusStore } from '../stores/app-status';
import { CloseIcon, UsdIcon, EthIcon } from 'modules/common/icons';
import { AmmExchange, AmmOutcome, Cash, EstimateEnterTradeResult, EstimateExitTradeResult, TradingDirection } from '../types';
import { formatEther } from '../../utils/format-number';
import { ApprovalButton, TinyButton } from '../common/buttons';
import {
  ApprovalAction,
  SHARES,
  OUTCOME_YES_NAME,
  YES_OUTCOME_ID,
  INSUFFICIENT_LIQUIDITY,
  ENTER_AMOUNT,
  INSUFFICIENT_BALANCE,
} from '../constants';
import { CurrencyDropdown } from '../common/selection';
import { generateTooltip } from '../common/labels';
import { doTrade, estimateEnterTrade, estimateExitTrade } from '../../utils/contract-calls';
import { BigNumber as BN } from 'bignumber.js'

export const DefaultMarketOutcomes = [
  {
    id: 0,
    name: 'yes',
    price: '$0.75',
  },
  {
    id: 1,

    name: 'No',
    price: '$0.25',
  },
  {
    id: 2,
    name: 'Invalid',
    price: '$0.00',
    isInvalid: true,
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
}) => {
  const [customVal, setCustomVal] = useState('');
  return (
    <div
      onClick={onClick}
      className={classNames(Styles.Outcome, {
        [Styles.YesNo]: !outcome.isInvalid && marketType === YES_NO,
        [Styles.Selected]: selected,
        [Styles.Yes]: outcome.name === OUTCOME_YES_NAME,
        [Styles.ShowAllHighlighted]: showAllHighlighted,
        [Styles.nonSelectable]: nonSelectable,
        [Styles.Edited]: customVal !== ''
      })}
    >
      <span>{outcome.name}</span>
      {editable ? (
        <div>
          <span>$</span>
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
          <span>{outcome.price}</span>
        )}
    </div>
  );
};

export const AmountInput = ({
  updateInitialAmount,
  initialAmount,
  maxValue,
  showCurrencyDropdown,
  updateCash,
  chosenCash,
  rate,
}: {
  updateInitialAmount: (string) => void;
  initialAmount: string;
  maxValue: string;
  showCurrencyDropdown?: boolean;
  updateCash?: (string) => void;
  chosenCash: string;
  rate?: string;
}) => {
  const currencyName = chosenCash;
  const [amount, updateAmount] = useState(initialAmount);
  const icon = currencyName === USDC ? UsdIcon : EthIcon;
  const label = currencyName === USDC ? USDC : ETH;
  const showRate = currencyName !== SHARES;
  const prepend = currencyName === USDC ? '$' : '';
  const setMax = () => {
    updateAmount(maxValue);
    updateInitialAmount(maxValue);
  };
  const convRate = `1 ${currencyName} = ${rate} Shares`;
  return (
    <div
      className={classNames(Styles.AmountInput, { [Styles.Rate]: showRate })}
    >
      <span>amount</span>
      <span onClick={setMax}>balance: {formatEther(maxValue).formatted}</span>
      <div
        className={classNames(Styles.AmountInputDropdown, {
          [Styles.Edited]: amount !== '',
        })}
      >
        <span>{prepend}</span>
        <input
          onChange={e => {
            updateAmount(e.target.value);
            updateInitialAmount(e.target.value);
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
          {rate ? convRate : null}
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
}: OutcomesGridProps) => {
  return (
    <div
      className={classNames(Styles.Outcomes, {
        [Styles.YesNo]: marketType === YES_NO,
        [Styles.nonSelectable]: nonSelectable,
      })}
    >
      {outcomes
        .filter(outcome => !outcome.isInvalid)
        .reverse()
        .map((outcome, index) => (
          <Outcome
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
            setEditableValue={price => setEditableValue(price, index)}
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
    userInfo: { balances },
  } = useAppStatusStore();
  const {
    isMobile,
    loginAccount,
    approvals,
    actions: { setShowTradingForm },
  } = useAppStatusStore();
  const [orderType, setOrderType] = useState(BUY);
  const [selectedOutcome, setSelectedOutcome] = useState(
    initialSelectedOutcome
  );
  const [breakdown, setBreakdown] = useState(getEnterBreakdown(null, amm?.cash));
  const [amount, setAmount] = useState<string>("");
  const [tradeEstimates, setTradeEstimates] = useState<TradeEstimates>({})
  const [tradeError, setTradeError] = useState<string>(null);
  const ammCash = amm?.cash;
  const outcomes = amm?.ammOutcomes || [];
  const userCashBalance = amm?.cash?.name
    ? balances[amm?.cash?.name]?.balance
    : '0';

  useEffect(() => {
    let isMounted = true;
    const getEstimate = async () => {
      const outputYesShares = selectedOutcome.id === YES_OUTCOME_ID;
      if (orderType === BUY) {
        const breakdown = await estimateEnterTrade(amm, amount, outputYesShares);
        if (breakdown && breakdown.outputShares !== "0") {
          const { slippagePercent, ratePerCash, outputShares } = breakdown;
          if (isMounted) {
            setBreakdown(getEnterBreakdown(breakdown, amm?.cash))
            setTradeEstimates({ slippagePercent, ratePerCash, outputAmount: outputShares })
            setTradeError(null);
          }
        } else {
          if (isMounted) {
            setTradeError(INSUFFICIENT_LIQUIDITY);
            setBreakdown(getEnterBreakdown(null, amm?.cash))
          }
        }
      } else {
        let userBalances = [];
        const hasShares =
          balances?.marketShares && balances?.marketShares[amm?.id];
        if (hasShares) {
          userBalances = hasShares.outcomeShares;
        }
        const breakdown = await estimateExitTrade(amm, amount, outputYesShares, userBalances);
        if (breakdown && breakdown.outputCash !== "0") {
          const { slippagePercent, ratePerCash, outputCash } = breakdown;

          if (isMounted) {
            setBreakdown(getExitBreakdown(breakdown, amm?.cash))
            setTradeEstimates({ slippagePercent, ratePerCash, outputAmount: outputCash })
            setTradeError(null);
          }
        } else {
          setTradeError(INSUFFICIENT_LIQUIDITY);
          if (isMounted) {
            setBreakdown(getExitBreakdown(null, amm?.cash))
            setTradeError(INSUFFICIENT_LIQUIDITY);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, selectedOutcome.id, amount]);

  const canMakeTrade: CanTradeProps = useMemo(() => {
    let actionText = tradeError || orderType;
    let disabled = false;
    if (Number(amount) === 0 || isNaN(Number(amount)) || amount === '') {
      actionText = ENTER_AMOUNT;
      disabled = true;
    } else if (new BN(amount).gt(new BN(userCashBalance))) {
      actionText = INSUFFICIENT_BALANCE;
      disabled = true;
    }
    return {
      disabled,
      actionText
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, selectedOutcome.id, amount, tradeError, userCashBalance]);

  const makeTrade = () => {
    const minOutput = tradeEstimates?.outputAmount;
    const direction = orderType === BUY ? TradingDirection.ENTRY : TradingDirection.EXIT;
    const outputYesShares = selectedOutcome.id === YES_OUTCOME_ID;
    let userBalances = [];
    const hasShares = balances?.marketShares && balances?.marketShares[amm?.id];
    if (hasShares) {
      userBalances = hasShares.outcomeShares;
    }
    doTrade(direction, amm, minOutput, amount, outputYesShares, userBalances).then(response => {
      console.log('kicked off trade');
    })
      .catch(e => {
        console.error('trade issue', e);
      })
  }

  return (
    <div className={Styles.TradingForm}>
      <div>
        <span
          onClick={() => {
            setOrderType(BUY)
            setBreakdown(getEnterBreakdown(null, amm?.cash))
          }}
          className={classNames({ [Styles.Selected]: BUY === orderType })}
        >
          {BUY}
        </span>
        <span
          onClick={() => {
            setBreakdown(getExitBreakdown(null, amm?.cash))
            setOrderType(SELL)
          }}
          className={classNames({ [Styles.Selected]: SELL === orderType })}
        >
          {SELL}
        </span>
        <div>
          <span>fee</span>
          <span>{amm?.feePercent}</span>
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
        />
        <AmountInput
          chosenCash={ammCash?.name}
          updateInitialAmount={setAmount}
          initialAmount={''}
          maxValue={userCashBalance}
          rate={tradeEstimates?.ratePerCash}
        />
        <InfoNumbers infoNumbers={breakdown} />
        {loginAccount && (
          <ApprovalButton amm={amm} actionType={ApprovalAction.TRADE} />
        )}
        <BuySellButton
          disabled={!approvals?.trade[ammCash?.name] || canMakeTrade.disabled}
          action={makeTrade}
          text={canMakeTrade.actionText}
        />
      </div>
    </div>
  );
};

export default TradingForm;
