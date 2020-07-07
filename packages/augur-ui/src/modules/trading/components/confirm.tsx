import React, { useEffect } from 'react';
import classNames from 'classnames';
import {
  SCALAR,
  BUY,
  SELL,
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
import { ethToDaiFromAttoRate } from 'modules/app/actions/get-ethToDai-rate';
import { TXEventName } from '@augurproject/sdk-lite';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';

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
  disableTrading?: boolean;
}

export const Confirm = ({
  market,
  trade,
  selectedOutcome,
  tradingTutorial,
  initialLiquidity,
  postOnlyOrder,
  disableTrading = false,
}: ConfirmProps) => {
  const {
    env: { ui: { reportingOnly: disableTrading } },
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

  useEffect(() => {
    if (
      walletStatus === WALLET_STATUS_VALUES.CREATED &&
      sweepStatus === TXEventName.Success
    ) {
      removePendingTransaction(CREATEAUGURWALLET);
    }
  }, []);
  const constructMessages = () => {
    let numTrades = loopLimit ? Math.ceil(numFills / loopLimit) : numFills;
    let needsApproval = false;
    let messages: Message | null = null;

    const gasCostInEth = gasLimit
      ? createBigNumber(
          formatGasCostToEther(
            gasLimit,
            { decimalsRounded: 4 },
            createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
          )
        )
      : ZERO;

    let gasCostDai = 0;

    if (gsnEnabled) {
      gasCostDai = ethToDaiFromAttoRate(gasCostInEth).value;
    }

    if (marketType === SCALAR && selectedOutcomeId === INVALID_OUTCOME_ID) {
      messages = {
        header: null,
        type: WARNING,
        message: `Percentages are determind by denomination range, rounding may occur. `,
        link: HELP_CENTER,
      };
    }

    if (
      !isNaN(numTrades) &&
      numTrades > 1 &&
      allowanceBigNumber &&
      createBigNumber(potentialDaiLoss.value).gt(allowanceBigNumber) &&
      !tradingTutorial
    ) {
      needsApproval = true;
      messages = {
        header: 'MULTIPLE TRANSACTIONS',
        type: WARNING,
        message: `This trade will take ${numTrades} Transactions and approvals.`,
      };
    }

    if (!isNaN(numTrades) && numTrades > 1 && !tradingTutorial) {
      messages = {
        header: 'MULTIPLE TRANSACTIONS',
        type: WARNING,
        message: `This trade will take ${numTrades} Transactions${
          needsApproval ? `, and approvals.` : ``
        }`,
      };
    }

    if (selfTrade) {
      messages = {
        header: 'CONSUMING OWN ORDER',
        type: WARNING,
        message: 'You are trading against one of your existing orders',
      };
    }

    // GAS error in DAI [Gsn]
    if (
      !tradingTutorial &&
      gsnEnabled &&
      totalCost &&
      createBigNumber(gasCostDai).gte(createBigNumber(availableDai))
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCostDai} DAI required for gas.`,
      };
    }

    if (
      !isNaN(numTrades) &&
      numTrades > 0 &&
      ((potentialDaiProfit &&
        potentialDaiProfit.value !== 0 &&
        createBigNumber(gasCostDai).gt(potentialDaiProfit.value)) ||
        (orderShareProfit &&
          orderShareProfit.value !== 0 &&
          createBigNumber(gasCostDai).gt(orderShareProfit.value))) &&
      !tradingTutorial
    ) {
      messages = {
        header: 'UNPROFITABLE TRADE',
        type: ERROR,
        message: `Est. TX Fee is higher than profit`,
      };
    }

    // GAS error in ETH
    if (
      !tradingTutorial &&
      !gsnEnabled &&
      totalCost &&
      createBigNumber(gasCostInEth).gte(createBigNumber(availableEth))
    ) {
      messages = {
        header: 'Insufficient ETH',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCostInEth} ETH required for gas.`,
      };
    }

    if (
      !tradingTutorial &&
      totalCost &&
      createBigNumber(potentialDaiLoss?.fullPrecision).gt(
        createBigNumber(availableDai)
      ) &&
      !tradingTutorial
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: 'You do not have enough DAI to place this order',
      };
    }

    // Show when GSN wallet activation is successful
    if (
      walletStatus === WALLET_STATUS_VALUES.CREATED &&
      sweepStatus === TXEventName.Success &&
      !tradingTutorial &&
      numFills === 0
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
    }
    // Show if OpenOrder and GSN wallet still needs to be activated
    else if (
      walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE &&
      !tradingTutorial &&
      numFills === 0
    ) {
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

    if (
      !isNaN(numTrades) &&
      numTrades > 0 &&
      postOnlyOrder &&
      !tradingTutorial
    ) {
      messages = {
        header: 'POST ONLY ORDER',
        type: ERROR,
        message: `Can not match existing order.`,
      };
    }

    if (disableTrading && !tradingTutorial) {
      messages = {
        header: 'Reporting Only',
        type: WARNING,
        message: 'Trading is disabled',
      };
    }

    return messages;
  };
  const messages = constructMessages();
  const greaterLess = side === BUY ? 'greater' : 'less';
  const higherLower = side === BUY ? 'higher' : 'lower';

  const marketRange = createBigNumber(maxPrice)
    .minus(createBigNumber(minPrice))
    .abs();

  let gasCostDai = formatNumber(0);

  const gasCostInEth = gasLimit
    ? createBigNumber(
        formatGasCostToEther(
          gasLimit,
          { decimalsRounded: 4 },
          createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
        )
      )
    : ZERO;

  if (gsnEnabled) {
    gasCostDai = ethToDaiFromAttoRate(gasCostInEth);
  }

  const limitPricePercentage = (side === BUY
    ? createBigNumber(limitPrice)
    : createBigNumber(maxPrice).minus(createBigNumber(limitPrice))
  )
    .dividedBy(marketRange)
    .times(100)
    .toFixed(0);

  let tooltip = `You believe ${outcomeName} has a ${greaterLess}
                      than ${limitPricePercentage}% chance to occur.`;
  if (marketType === SCALAR) {
    tooltip = `You believe the outcome of this event will be ${higherLower}
  than ${limitPrice} ${scalarDenomination}`;
  }

  let newOrderAmount = formatShares('0').rounded;
  if (numShares && totalCost.fullPrecision && shareCost.fullPrecision) {
    newOrderAmount =
      marketType !== SCALAR
        ? formatShares(
            createBigNumber(numShares).minus(shareCost.fullPrecision),
            {
              decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
            }
          ).rounded
        : formatShares(
            createBigNumber(numShares).minus(shareCost.fullPrecision)
          ).rounded;
  } else if (sharesFilled && sharesFilled.fullPrecision) {
    newOrderAmount = sharesFilled.rounded;
  }

  const notProfitable =
    (orderShareProfit && createBigNumber(orderShareProfit.value).lte(0)) ||
    (potentialDaiLoss.value > 0 &&
      potentialDaiProfit &&
      potentialDaiProfit.value <= 0);
  return (
    <section className={Styles.TradingConfirm}>
      {!initialLiquidity && shareCost && shareCost.value !== 0 && (
        <div className={Styles.details}>
          <div className={Styles.properties}>Closing Position</div>
          <div
            className={classNames(Styles.AggregatePosition, {
              [Styles.long]: side === BUY,
              [Styles.short]: side === SELL,
            })}
          >
            {`${side === BUY ? BUYING_BACK : SELLING_OUT}
              ${shareCost.fullPrecision}
              Shares @ ${limitPrice}`}
          </div>
          <LinearPropertyLabel
            label="Market OI Fee"
            value={orderShareTradingFee}
            showDenomination={true}
          />
          {gasCostDai.roundedValue.gt(0) > 0 && numFills > 0 && (
            <TransactionFeeLabelToolTip
              isError={createBigNumber(gasCostDai.value).gt(
                createBigNumber(orderShareProfit.value)
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
                data-iscapture={true}
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
              [Styles.long]: side === BUY,
              [Styles.short]: side === SELL,
            })}
          >
            {`${side === BUY ? BUYING : SELLING}
              ${newOrderAmount}
              Shares @ ${limitPrice}`}
          </div>
          <LinearPropertyLabel
            label="Max Profit"
            value={potentialDaiProfit}
            showDenomination={true}
          />
          <LinearPropertyLabel
            label="Max Loss"
            value={potentialDaiLoss}
            showDenomination={true}
          />

          {gasCostDai.roundedValue.gt(0) > 0 && numFills > 0 && (
            <TransactionFeeLabelToolTip
              isError={createBigNumber(gasCostDai.value).gt(
                createBigNumber(potentialDaiProfit.value)
              )}
              gasCostDai={postOnlyOrder ? `0.00` : gasCostDai}
            />
          )}
        </div>
      )}
      {numFills > 0 && !postOnlyOrder && <EthReserveAutomaticTopOff />}
      {messages && (
        <div
          className={classNames(Styles.MessageContainer, {
            [Styles.Error]: messages.type === ERROR,
          })}
        >
          {messages.type === ERROR ? ExclamationCircle : InformationIcon}
          <span>{messages.header}</span>
          <div>
            {messages.message}
            {messages.link && (
              <ExternalLinkButton URL={messages.link} label="LEARN MORE" />
            )}
          </div>
          {messages.button && (
            <ProcessingButton
              text={messages.button.text}
              action={messages.button.action}
              queueName={TRANSACTIONS}
              queueId={CREATEAUGURWALLET}
            />
          )}
          {messages.type !== ERROR && !messages.button && (
            <button
              onClick={messages.callback ? () => messages.callback() : null}
            >
              {XIcon}
            </button>
          )}
        </div>
      )}
      {!postOnlyOrder && <EthReserveNotice gasLimit={gasLimit} />}
    </section>
  );
};

export default Confirm;
