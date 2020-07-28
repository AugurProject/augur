import React, { Component } from 'react';
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
  formatDaiPrice,
  formatDai,
} from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { LinearPropertyLabel, EthReserveNotice, TransactionFeeLabelToolTip, EthReserveAutomaticTopOff } from 'modules/common/labels';
import { Trade } from 'modules/types';
import { ExternalLinkButton, ProcessingButton } from 'modules/common/buttons';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { TXEventName } from '@augurproject/sdk-lite';

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
  allowanceBigNumber: BigNumber;
  trade: Trade;
  gasPrice: number;
  gasLimit: number;
  availableEth: BigNumber;
  availableDai: BigNumber;
  outcomeName: string;
  marketType: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  scalarDenomination: string | null;
  numOutcomes: number;
  tradingTutorial?: boolean;
  GsnEnabled: boolean;
  initialLiquidity: boolean;
  initializeGsnWallet: Function;
  walletStatus: string;
  selectedOutcomeId: number;
  updateWalletStatus: Function;
  sweepStatus: string;
  postOnlyOrder: boolean;
  allowPostOnlyOrder: boolean;
}

interface ConfirmState {
  messages: Message | null;
}

class Confirm extends Component<ConfirmProps, ConfirmState> {
  static defaultProps = {
    scalarDenomination: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: this.constructMessages(props),
    };

    this.constructMessages = this.constructMessages.bind(this);
    this.clearErrorMessage = this.clearErrorMessage.bind(this);
  }

  componentDidMount() {
    if (this.props.walletStatus === WALLET_STATUS_VALUES.CREATED && this.props.sweepStatus === TXEventName.Success) {
      this.props.updateWalletStatus();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      trade,
      gasPrice,
      availableEth,
      availableDai,
      walletStatus,
      sweepStatus,
      postOnlyOrder,
      allowPostOnlyOrder,
    } = this.props;
    if (
      JSON.stringify({
        side: trade.side,
        numShares: trade.numShares,
        limitPrice: trade.limitPrice,
        numFills: trade.numFills,
        postOnlyOrder: postOnlyOrder
      }) !==
        JSON.stringify({
          side: prevProps.trade.side,
          numShares: prevProps.trade.numShares,
          limitPrice: prevProps.trade.limitPrice,
          numFills: prevProps.trade.numFills,
          postOnlyOrder : prevProps.postOnlyOrder
        }) ||
      walletStatus !== prevProps.walletStatus ||
      sweepStatus !== prevProps.sweepStatus ||
      gasPrice !== prevProps.gasPrice ||
      !createBigNumber(prevProps.availableEth).eq(
        createBigNumber(availableEth)
      ) ||
      !createBigNumber(prevProps.availableDai).eq(
        createBigNumber(availableDai)
      ) ||
      allowPostOnlyOrder !== prevProps.allowPostOnlyOrder
    ) {
      this.setState({
        messages: this.constructMessages(this.props),
      });
    }
  }

  constructMessages(props) {
    const {
      trade,
      allowanceBigNumber,
      gasPrice,
      gasLimit,
      availableEth,
      availableDai,
      tradingTutorial,
      GsnEnabled,
      initializeGsnWallet,
      walletStatus,
      marketType,
      selectedOutcomeId,
      sweepStatus,
      postOnlyOrder,
      disableTrading,
      allowPostOnlyOrder,
    } = props || this.props;

    const {
      totalCost,
      selfTrade,
      potentialDaiLoss,
      numFills,
      loopLimit,
      potentialDaiProfit,
      orderShareProfit,
    } = trade;

    let numTrades = loopLimit ? Math.ceil(numFills / loopLimit) : numFills;
    let needsApproval = false;
    let messages: Message | null = null;

    const gasCostInEth = gasLimit
      ? createBigNumber(formatGasCostToEther(gasLimit, { decimalsRounded: 4 }, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)))
      : ZERO;

    let gasCostDai = formatNumber(0);

    if (GsnEnabled) {
      gasCostDai = getGasInDai(Number(createBigNumber(gasLimit)), createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice));
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
      !isNaN(numTrades) && numTrades > 1 &&
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
      GsnEnabled &&
      totalCost &&
      createBigNumber(gasCostDai.value).gte(createBigNumber(availableDai))
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: `You do not have enough funds to place this order. $${gasCostDai.formatted} DAI required for gas.`,
      };
    }

    if (
      !isNaN(numTrades) &&
      numTrades > 0 &&
      ((potentialDaiProfit && potentialDaiProfit.value !== 0 &&
        createBigNumber(gasCostDai.value).gt(potentialDaiProfit.value)) ||
        (orderShareProfit && orderShareProfit.value !== 0 &&
          createBigNumber(gasCostDai.value).gt(orderShareProfit.value))) &&
      !tradingTutorial
    ) {
      messages = {
        header: 'UNPROFITABLE TRADE',
        type: ERROR,
        message: `Est. tx fee is higher than profit. TX fees will be dramatically reduced in v3.`,
      };
    }

    // GAS error in ETH
    if (
      !tradingTutorial &&
      !GsnEnabled &&
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
      createBigNumber(potentialDaiLoss.fullPrecision).gt(
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
    if (walletStatus === WALLET_STATUS_VALUES.CREATED && sweepStatus === TXEventName.Success && !tradingTutorial && numFills === 0) {
      messages = {
        header: 'Confirmed',
        type: WARNING,
        message: 'You can now place your trade',
        callback: () => {
          this.props.updateWalletStatus();
          this.clearErrorMessage();
        }
      };
    }
    // Show if OpenOrder and GSN wallet still needs to be activated
    else if (walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE && !tradingTutorial && numFills === 0) {
      messages = {
        header: '',
        type: WARNING,
        message: 'Activation of your account is needed',
        button: {
          text: 'Activate Account',
          action: () => initializeGsnWallet(),
        },
      };
    }

    if (
      !allowPostOnlyOrder && !tradingTutorial
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
  }

  clearErrorMessage() {
    this.setState({ messages: null });
  }

  render() {
    const {
      trade,
      outcomeName,
      marketType,
      maxPrice,
      minPrice,
      scalarDenomination,
      gasLimit,
      gasPrice,
      GsnEnabled,
      initialLiquidity,
      postOnlyOrder,
      tradingTutorial,
    } = this.props;

    const {
      limitPrice,
      numShares,
      potentialDaiProfit,
      potentialDaiLoss,
      totalCost,
      shareCost,
      side,
      orderShareProfit,
      orderShareTradingFee,
      numFills,
      sharesFilled,
    } = trade;

    const { messages } = this.state;

    const greaterLess = side === BUY ? 'greater' : 'less';
    const higherLower = side === BUY ? 'higher' : 'lower';

    const marketRange = createBigNumber(maxPrice)
      .minus(createBigNumber(minPrice))
      .abs();

    let gasCostDai = formatDai(0);

    if (GsnEnabled) {
      gasCostDai = getGasInDai(Number(createBigNumber(gasLimit)), createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice));
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
            {gasCostDai.roundedValue.gt(0) > 0 &&
              numFills > 0 && !postOnlyOrder && (
              <TransactionFeeLabelToolTip
                isError={createBigNumber(gasCostDai.value).gt(createBigNumber(orderShareProfit.value))}
                gasCostDai={gasCostDai}
              />
            )}
            {postOnlyOrder && (
              <TransactionFeeLabelToolTip
                gasCostDai={`0.00`}
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
            <TransactionFeeLabelToolTip
              isError={!tradingTutorial && createBigNumber(gasCostDai.value).gt(createBigNumber(potentialDaiProfit.value))}
              gasCostDai={(tradingTutorial || postOnlyOrder) ? formatDai(0) : gasCostDai}
            />
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
                <ExternalLinkButton
                  URL={messages.link}
                  label={'LEARN MORE'}
                />
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
              <button onClick={messages.callback ? () => messages.callback() : this.clearErrorMessage}>{XIcon}</button>
            )}
          </div>
        )}
        {!postOnlyOrder && <EthReserveNotice gasLimit={gasLimit} />}
      </section>
    );
  }
}

export default Confirm;
