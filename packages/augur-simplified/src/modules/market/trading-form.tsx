import React, { useEffect, useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { BUY, SELL, YES_NO, USDC, ETH } from 'modules/constants';
import { PrimaryButton } from 'modules/common/buttons';
import { useAppStatusStore } from '../stores/app-status';
import { CloseIcon, UsdIcon, EthIcon } from 'modules/common/icons';
import { AmmExchange, AmmOutcome, EstimateEnterTradeResult, EstimateExitTradeResult, TradingDirection } from '../types';
import { formatEther } from '../../utils/format-number';
import { ApprovalButton, TinyButton } from '../common/buttons';
import { ApprovalAction, SHARES, OUTCOME_YES_NAME, YES_OUTCOME_ID } from '../constants';
import { CurrencyDropdown } from '../common/selection';
import { estimateEnterTrade, estimateExitTrade, estimateTrade } from '../../utils/contract-calls';

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
  invalidSelected,
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
        [Styles.Invalid]: outcome.isInvalid,
        [Styles.Yes]: outcome.name === OUTCOME_YES_NAME,
        [Styles.ShowAllHighlighted]: showAllHighlighted,
        [Styles.InvalidSelected]: invalidSelected,
        [Styles.nonSelectable]: nonSelectable,
      })}
    >
      <span>{outcome.name}</span>
      {editable ? (
        <div className={classNames({ [Styles.edited]: customVal !== '' })}>
          <span>$</span>
          <input
            value={customVal}
            onChange={(v) => {
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
  rate
}: {
  updateInitialAmount: (string) => void,
  initialAmount: string,
  maxValue: string,
  showCurrencyDropdown?: boolean,
  updateCash?: (string) => void,
  chosenCash: string,
  rate?: string,
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
  }
  const convRate = `1 ${currencyName} = ${rate} Shares`
  return (
    <div className={classNames(Styles.AmountInput, { [Styles.Rate]: showRate })}>
      <span>amount</span>
      <span onClick={setMax}>balance: {formatEther(maxValue).formatted}</span>
      <div className={classNames(Styles.AmountInputDropdown, { [Styles.Edited]: amount !== '' })}>
        <span>{prepend}</span>
        <input
          onChange={(e) => {
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
            <TinyButton
              action={setMax}
              text="Max" />
          </span>
        )}
        {showCurrencyDropdown && (
          <CurrencyDropdown
            defaultValue={chosenCash}
            onChange={(cash) => updateCash(cash)}
          />
        )}
      </div>
      {showRate && (
        <span className={Styles.RateLabel}>
          <span>Rate</span>{rate ? convRate : null}
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
        .filter((outcome) => !outcome.isInvalid)
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
            invalidSelected={nonSelectable || selectedOutcome?.isInvalid}
            editable={editable}
            setEditableValue={(price) => setEditableValue(price, index)}
          />
        ))}
    </div>
  );
};

interface InfoNumber {
  label: string;
  value: string;
}

interface InfoNumbersProps {
  infoNumbers: InfoNumber[];
}

export const InfoNumbers = ({ infoNumbers }: InfoNumbersProps) => {
  return (
    <div className={Styles.OrderInfo}>
      {infoNumbers.map((infoNumber) => (
        <div key={infoNumber.label}>
          <span>{infoNumber.label}</span>
          <span>{infoNumber.value}</span>
        </div>
      ))}
    </div>
  );
};

const getEnterBreakdown = (breakdown: EstimateEnterTradeResult) => {
  const avg = breakdown?.averagePrice || "$0.00";
  const sharevalue = breakdown?.outputShares || "0.00";
  const winnings = breakdown?.maxProfit || "$0.00"
  const fees = breakdown?.tradeFees || "$0.00"
  return [
    {
      label: 'average price',
      value: avg,
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
}

const getExitBreakdown = (breakdown: EstimateExitTradeResult) => {
  const avg = breakdown?.averagePrice || "$0.00";
  const cash = breakdown?.outputCash || "0.00";
  const remaining = breakdown?.remainingShares || "0.00";
  const fees = breakdown?.estimateFees || "$0.00"
  return [
    {
      label: 'Average Price',
      value: avg,
    },
    {
      label: `Amount You'll Recieve`,
      value: cash,
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
}

interface TradeEstimates {
  slippagePercent?: string;
  ratePerCash?: string
}

interface TradingFormProps {
  amm: AmmExchange,
  marketType?: string,
  initialSelectedOutcome: AmmOutcome,
}

const TradingForm = ({
  initialSelectedOutcome,
  marketType = YES_NO,
  amm,
}: TradingFormProps) => {
  const { userInfo: { balances } } = useAppStatusStore();
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
  const [breakdown, setBreakdown] = useState(getEnterBreakdown(null));
  const [amount, setAmount] = useState<string>("");
  const [tradeEstimates, setTradeEstimates] = useState<TradeEstimates>({})
  const ammCash = amm?.cash;
  const outcomes = amm?.ammOutcomes || [];
  const userCashBalance = amm?.cash?.name ? balances[amm?.cash?.name]?.balance : "0";

  useEffect(() => {
    const getEstimate = async () => {
      const outputYesShares = selectedOutcome.id === YES_OUTCOME_ID;
      if (orderType === BUY) {
        const breakdown = await estimateEnterTrade(amm, amount, outputYesShares);
        if (breakdown) {
          const {slippagePercent, ratePerCash} = breakdown;
          setBreakdown(getEnterBreakdown(breakdown))
          setTradeEstimates({slippagePercent, ratePerCash })
        } else {
          // if no breakdown, means no liquidity
          // TODO: set insufficient liquidity state here
          setBreakdown(getEnterBreakdown(null))
        }
      } else {
        let userBalances = [];
        const hasShares = balances?.marketShares && balances?.marketShares[amm?.id];
        if (hasShares) {
          userBalances = hasShares.outcomeShares;
          console.log('userBalances', userBalances)
        }
        const breakdown = await estimateExitTrade(amm, amount, outputYesShares, userBalances);
        if (breakdown) {
          const {slippagePercent, ratePerCash} = breakdown;
          setBreakdown(getExitBreakdown(breakdown))
          setTradeEstimates({slippagePercent, ratePerCash })
        } else {
          // if no breakdown, means no liquidity
          // TODO: set insufficient liquidity state here
          setBreakdown(getExitBreakdown(null))
        }
      }
    }
    if (orderType && selectedOutcome.id && amount && Number(amount) > 0) {
      getEstimate()
    } else {
      orderType === BUY ? setBreakdown(getEnterBreakdown(null)) : setBreakdown(getExitBreakdown(null));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, selectedOutcome.id, amount]);

  return (
    <div className={Styles.TradingForm}>
      <div>
        <span
          onClick={() => {
            setOrderType(BUY)
            setBreakdown(getEnterBreakdown(null))
          }}
          className={classNames({ [Styles.Selected]: BUY === orderType })}
        >
          {BUY}
        </span>
        <span
          onClick={() => {
            setBreakdown(getExitBreakdown(null))
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
        <InfoNumbers
          infoNumbers={breakdown}
        />
        {loginAccount && (
          <ApprovalButton amm={amm} actionType={ApprovalAction.TRADE} />
        )}
        <PrimaryButton
          disabled={!approvals?.trade[ammCash?.name]}
          text={orderType}
        />
      </div>
    </div>
  );
};

export default TradingForm;
