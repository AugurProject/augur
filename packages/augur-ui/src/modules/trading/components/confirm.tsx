import React, { useEffect } from 'react';
import classNames from 'classnames';
import {
  SCALAR,
  BUY,
  BUYING,
  SELLING,
  BUYING_BACK,
  SELLING_OUT,
  WARNING,
  ERROR,
  UPPER_FIXED_PRECISION_BOUND,
  ZERO,
  WALLET_STATUS_VALUES,
  INVALID_OUTCOME_ID,
  HELP_CENTER,
  CREATEAUGURWALLET,
  TRANSACTIONS,
  GWEI_CONVERSION,
  MODAL_INITIALIZE_ACCOUNT,
} from 'modules/common/constants';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/trading/components/confirm.styles.less';
import {
  XIcon,
  ExclamationCircle,
  InformationIcon,
  QuestionIcon,
} from 'modules/common/icons';
import {
  formatGasCostToEther,
  formatShares,
  formatNumber,
} from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { Trade, MarketData, OutcomeFormatted } from 'modules/types';
import {
  LinearPropertyLabel,
  EthReserveNotice,
  TransactionFeeLabelToolTip,
  EthReserveAutomaticTopOff,
} from 'modules/common/labels';
import { ExternalLinkButton, ProcessingButton } from 'modules/common/buttons';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { TXEventName } from '@augurproject/sdk-lite';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { useTradingStore } from 'modules/trading/store/trading';

interface MessageButton {
  action: Function;
  text: string;
}

interface Message {
  header: string;
  type: string;
  message: string;
  button?: MessageButton;
  link?: string;
  callback?: Function;
}

interface ConfirmProps {
  market: MarketData;
  trade: Trade;
  selectedOutcome: OutcomeFormatted;
  tradingTutorial?: boolean;
  initialLiquidity?: boolean;
  postOnlyOrder?: boolean;
  allowPostOnlyOrder?: boolean;
}

const MessageContainer = ({
  header,
  type,
  message,
  button = null,
  link = null,
  callback = () => {},
}: Message) => (
  <div
    className={classNames(Styles.MessageContainer, {
      [Styles.Error]: type === ERROR,
    })}
  >
    {type === ERROR ? ExclamationCircle : InformationIcon}
    <span>{header}</span>
    <div>
      {message}
      {link && <ExternalLinkButton URL={link} label="LEARN MORE" />}
    </div>
    {button && (
      <ProcessingButton
        text={button.text}
        action={button.action}
        queueName={TRANSACTIONS}
        queueId={CREATEAUGURWALLET}
      />
    )}
    {type !== ERROR && !button && (
      <button onClick={() => callback()}>{XIcon}</button>
    )}
  </div>
);

export const Confirm = ({
  market,
  trade,
  selectedOutcome,
  tradingTutorial,
  initialLiquidity,
}: ConfirmProps) => {
  const {
    env: {
      ui: { reportingOnly: disableTrading },
    },
    newMarket,
    pendingQueue,
    loginAccount: {
      balances: { eth },
      allowance: allowanceBigNumber,
    },
    gsnEnabled,
    walletStatus,
    gasPriceInfo,
    actions: { setModal },
  } = useAppStatusStore();
  const {
    orderProperties: { postOnlyOrder, allowPostOnlyOrder },
  } = useTradingStore();
  let availableDai = totalTradingBalance();
  if (initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }

  const sweepStatus = pendingQueue[TRANSACTIONS]?.[CREATEAUGURWALLET]?.status;
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const availableEth = createBigNumber(eth);
  const { id: selectedOutcomeId, description: outcomeName } = selectedOutcome;
  const {
    marketType,
    maxPriceBigNumber: maxPrice,
    minPriceBigNumber: minPrice,
    scalarDenomination = '',
  } = market;
  const {
    gasLimit,
    limitPrice,
    numShares,
    loopLimit,
    potentialDaiProfit,
    potentialDaiLoss,
    totalCost,
    shareCost,
    side,
    orderShareProfit,
    orderShareTradingFee,
    numFills,
    sharesFilled,
    selfTrade,
  } = trade;
  const isScalar = marketType === SCALAR;
  const isBuy = side === BUY;
  const hasFills = numFills > 0;

  useEffect(() => {
    if (
      walletStatus === WALLET_STATUS_VALUES.CREATED &&
      sweepStatus === TXEventName.Success
    ) {
      removePendingTransaction(CREATEAUGURWALLET);
    }
  }, []);

  const gasCostInEth = gasLimit
    ? createBigNumber(
        formatGasCostToEther(
          gasLimit,
          { decimalsRounded: 4 },
          createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
        )
      )
    : ZERO;

  const messages = (() => {
    let numTrades = loopLimit ? Math.ceil(numFills / loopLimit) : numFills;
    numTrades = isNaN(numTrades) ? 0 : numTrades;
    let messages: Message | null = null;

    const gasCostDai = gsnEnabled
      ? getGasInDai(Number(createBigNumber(gasLimit))).fullPrecision
      : '0';

    if (isScalar && selectedOutcomeId === INVALID_OUTCOME_ID) {
      messages = {
        header: null,
        type: WARNING,
        message: `Percentages are determind by denomination range, rounding may occur. `,
        link: HELP_CENTER,
      };
    }
    // multiple transaction warnings
    if (!tradingTutorial) {
      if (numTrades > 1) {
        messages = {
          header: 'MULTIPLE TRANSACTIONS',
          type: WARNING,
          message: `This trade will take ${numTrades} Transactions${
            createBigNumber(potentialDaiLoss?.value || 0).gt(
              allowanceBigNumber || 0
            )
              ? ' and approvals.'
              : '.'
          }`,
        };
      }
      // self trade warning
      if (selfTrade) {
        messages = {
          header: 'CONSUMING OWN ORDER',
          type: WARNING,
          message: 'You are trading against one of your existing orders',
        };
      }
      // unprofitable error
      if (
        numTrades > 0 &&
        ((potentialDaiProfit?.value !== 0 &&
          createBigNumber(gasCostDai).gt(potentialDaiProfit?.value || 0)) ||
          (orderShareProfit?.value !== 0 &&
            createBigNumber(gasCostDai).gt(orderShareProfit?.value || 0)))
      ) {
        messages = {
          header: 'UNPROFITABLE TRADE',
          type: ERROR,
          message: `Est. TX Fee is higher than profit`,
        };
      }

      if (totalCost) {
        // GAS error in DAI [Gsn]
        if (gsnEnabled && createBigNumber(gasCostDai).gte(availableDai)) {
          messages = {
            header: 'Insufficient DAI',
            type: ERROR,
            message: `You do not have enough funds to place this order. ${gasCostDai} DAI required for gas.`,
          };
        }

        // GAS error in ETH
        if (!gsnEnabled && gasCostInEth.gte(availableEth)) {
          messages = {
            header: 'Insufficient ETH',
            type: ERROR,
            message: `You do not have enough funds to place this order. ${gasCostInEth.toFixed()} ETH required for gas.`,
          };
        }

        if (
          createBigNumber(potentialDaiLoss?.fullPrecision || 0).gt(availableDai)
        ) {
          messages = {
            header: 'Insufficient DAI',
            type: ERROR,
            message: 'You do not have enough DAI to place this order',
          };
        }
      }

      // Show when GSN wallet activation is successful
      if (
        walletStatus === WALLET_STATUS_VALUES.CREATED &&
        sweepStatus === TXEventName.Success &&
        hasFills
      ) {
        messages = {
          header: 'Confirmed',
          type: WARNING,
          message: 'You can now place your trade',
          callback: () => {
            removePendingTransaction(CREATEAUGURWALLET);
            // clearErrorMessage();
          },
        };
      } else if (
        walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE &&
        hasFills
      ) {
        // Show if OpenOrder and GSN wallet still needs to be activated
        messages = {
          header: '',
          type: WARNING,
          message: 'Activation of your account is needed',
          button: {
            text: 'Activate Account',
            action: () =>
              setModal({
                type: MODAL_INITIALIZE_ACCOUNT,
              }),
          },
        };
      }

      if (!allowPostOnlyOrder) {
        messages = {
          header: 'POST ONLY ORDER',
          type: ERROR,
          message: `Can not match existing order.`,
        };
      }

      if (disableTrading) {
        messages = {
          header: 'Reporting Only',
          type: WARNING,
          message: 'Trading is disabled',
        };
      }
    }

    return messages;
  })();

  const limitPricePercentage = (isBuy
    ? createBigNumber(limitPrice)
    : maxPrice.minus(createBigNumber(limitPrice))
  )
    .dividedBy(maxPrice.minus(minPrice).abs())
    .times(100)
    .toFixed(0);

  const gasCostDai = gsnEnabled
    ? getGasInDai(Number(createBigNumber(gasLimit)))
    : formatNumber(0);

  const tooltip = isScalar
    ? `You believe the outcome of this event will be ${
        isBuy ? 'greater' : 'less'
      }
  than ${limitPrice} ${scalarDenomination}`
    : `You believe ${outcomeName} has a ${
        isBuy ? 'greater' : 'less'
      } than ${limitPricePercentage}% chance to occur.`;

  let newOrderAmount = formatShares('0').rounded;
  if (numShares && totalCost.fullPrecision && shareCost.fullPrecision) {
    newOrderAmount = isScalar
      ? formatShares(createBigNumber(numShares).minus(shareCost.fullPrecision))
          .rounded
      : formatShares(
          createBigNumber(numShares).minus(shareCost.fullPrecision),
          {
            decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
          }
        ).rounded;
  } else if (sharesFilled && sharesFilled.fullPrecision) {
    newOrderAmount = sharesFilled.rounded;
  }

  const notProfitable =
    (orderShareProfit && createBigNumber(orderShareProfit?.value).lte(0)) ||
    (potentialDaiLoss?.value > 0 &&
      potentialDaiProfit &&
      potentialDaiProfit?.value <= 0);
  return (
    <section className={Styles.TradingConfirm}>
      {!initialLiquidity && shareCost?.value !== 0 && (
        <div className={Styles.details}>
          <div className={Styles.properties}>Closing Position</div>
          <div
            className={classNames(Styles.AggregatePosition, {
              [Styles.long]: isBuy,
              [Styles.short]: !isBuy,
            })}
          >
            {`${isBuy ? BUYING_BACK : SELLING_OUT}
              ${shareCost.fullPrecision}
              Shares @ ${limitPrice}`}
          </div>
          <LinearPropertyLabel
            label="Market OI Fee"
            value={orderShareTradingFee}
            showDenomination={true}
          />
          {gasCostDai?.roundedValue.gt(0) > 0 && hasFills && (
            <TransactionFeeLabelToolTip
              isError={createBigNumber(gasCostDai?.value).gt(
                createBigNumber(orderShareProfit?.value)
              )}
              gasCostDai={gasCostDai}
            />
          )}
          <LinearPropertyLabel
            label="Profit Less Fees"
            value={orderShareProfit}
            accentValue={notProfitable}
            showDenomination={true}
          />
        </div>
      )}
      {!initialLiquidity && newOrderAmount !== '0' && (
        <div className={Styles.details}>
          <div
            className={classNames(Styles.properties, Styles.TooltipContainer)}
          >
            New Position
            <span className={Styles.Tooltip}>
              <label
                className={classNames(
                  TooltipStyles.TooltipHint,
                  Styles.TooltipHint
                )}
                data-tip
                data-for="tooltip--confirm"
                data-iscapture
              >
                {QuestionIcon}
              </label>
              <ReactTooltip
                id="tooltip--confirm"
                className={TooltipStyles.Tooltip}
                effect="solid"
                place="top"
                type="light"
                event="mouseover mouseenter"
                eventOff="mouseleave mouseout scroll mousewheel blur"
              >
                <p>{tooltip}</p>
              </ReactTooltip>
            </span>
          </div>
          <div
            className={classNames(Styles.AggregatePosition, {
              [Styles.long]: isBuy,
              [Styles.short]: !isBuy,
            })}
          >
            {`${isBuy ? BUYING : SELLING}
              ${newOrderAmount}
              Shares @ ${limitPrice}`}
          </div>
          <LinearPropertyLabel
            label="Max Profit"
            value={potentialDaiProfit}
            showDenomination
          />
          <LinearPropertyLabel
            label="Max Loss"
            value={potentialDaiLoss}
            showDenomination
          />

          {gasCostDai.roundedValue.gt(0) > 0 && hasFills && (
            <TransactionFeeLabelToolTip
              isError={createBigNumber(gasCostDai?.value).gt(
                createBigNumber(potentialDaiProfit?.value)
              )}
              gasCostDai={postOnlyOrder ? `0.00` : gasCostDai}
            />
          )}
        </div>
      )}
      {hasFills && !postOnlyOrder && <EthReserveAutomaticTopOff />}
      {messages && <MessageContainer {...messages} />}
      {!postOnlyOrder && <EthReserveNotice gasLimit={gasLimit} />}
    </section>
  );
};

export default Confirm;
