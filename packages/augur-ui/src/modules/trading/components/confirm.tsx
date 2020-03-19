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
  formatDai,
} from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { LinearPropertyLabel } from 'modules/common/labels';
import { Trade } from 'modules/types';
import { PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';

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
  gsnUnavailable: boolean;
  initialLiquidity: boolean;
  initializeGsnWallet: Function;
  walletStatus: string;
  selectedOutcomeId: number;
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

  componentDidUpdate(prevProps) {
    const {
      trade,
      gasPrice,
      availableEth,
      availableDai,
      gsnUnavailable,
    } = this.props;
    if (
      JSON.stringify({
        side: trade.side,
        numShares: trade.numShares,
        limitPrice: trade.limitPrice,
      }) !==
        JSON.stringify({
          side: prevProps.trade.side,
          numShares: prevProps.trade.numShares,
          limitPrice: prevProps.trade.limitPrice,
        }) ||
      gasPrice !== prevProps.gasPrice ||
      !createBigNumber(prevProps.availableEth).eq(
        createBigNumber(availableEth)
      ) ||
      !createBigNumber(prevProps.availableDai).eq(
        createBigNumber(availableDai)
      ) ||
      prevProps.gsnUnavailable !== gsnUnavailable
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
      gsnUnavailable,
      initializeGsnWallet,
      walletStatus,
      marketType,
      selectedOutcomeId,
    } = props || this.props;

    const {
      totalCost,
      selfTrade,
      potentialDaiLoss,
      numFills,
      loopLimit,
    } = trade;

    let numTrades = loopLimit ? Math.ceil(numFills / loopLimit) : numFills;
    let needsApproval = false;
    let messages: Message | null = null;

    const gasCost = gasLimit
      ? formatGasCostToEther(gasLimit, { decimalsRounded: 4 }, gasPrice)
      : ZERO;

    let gasCostDai = null;

    if (GsnEnabled) {
      gasCostDai = getGasInDai(gasLimit);
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
      createBigNumber(gasCostDai).gte(createBigNumber(availableDai))
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCostDai} DAI required for gas.`,
      };
    }

    // GAS error in ETH
    if (
      !tradingTutorial &&
      !GsnEnabled &&
      totalCost &&
      createBigNumber(gasCost).gte(createBigNumber(availableEth))
    ) {
      messages = {
        header: 'Insufficient ETH',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCost} ETH required for gas.`,
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

    // Show if OpenOrder and GSN wallet still needs to be initialized
    if (
      gsnUnavailable &&
      walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE &&
      !tradingTutorial &&
      numFills === 0
    ) {
      messages = {
        header: '',
        type: WARNING,
        message: 'Initialization of your account is needed',
        button: {
          text: 'Initialize Account',
          action: () => initializeGsnWallet(),
        },
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

    let gasCostDai = null;

    if (GsnEnabled) {
      gasCostDai = getGasInDai(gasLimit);
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
              label="Settlement Fee"
              value={orderShareTradingFee}
              showDenomination={true}
            />
            {gasCostDai && gasCostDai.roundedValue.gt(0) > 0 && (
              <LinearPropertyLabel
                label="Est. TX Fee"
                value={gasCostDai}
                showDenomination={true}
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
                >
                  {QuestionIcon}
                </label>
                <ReactTooltip
                  id="tooltip--confirm"
                  className={TooltipStyles.Tooltip}
                  effect="solid"
                  place="top"
                  type="light"
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
            {gasCostDai &&
              gasCostDai.roundedValue.gt(0) > 0 &&
              numFills > 0 && (
                <LinearPropertyLabel
                  label="Est. TX Fee"
                  value={gasCostDai}
                  showDenomination={true}
                />
              )}
          </div>
        )}
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
              <PrimaryButton
                text={messages.button.text}
                action={messages.button.action}
              />
            )}
            {messages.type !== ERROR && !messages.button && (
              <button onClick={this.clearErrorMessage}>{XIcon}</button>
            )}
          </div>
        )}
      </section>
    );
  }
}

export default Confirm;
