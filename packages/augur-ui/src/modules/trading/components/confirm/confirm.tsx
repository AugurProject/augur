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
} from 'modules/common/constants';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/trading/components/confirm/confirm.styles.less';
import { XIcon, ExclamationCircle, InfoIcon } from 'modules/common/icons';
import { formatGasCostToEther, formatShares, formatDai } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { LinearPropertyLabel } from 'modules/common/labels';
import { Trade } from 'modules/types';

interface Message {
  header: string;
  type: string;
  message: string;
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
  ethToDaiRate: BigNumber;
  Gnosis_ENABLED: boolean;
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
    const { trade, gasPrice, availableEth } = this.props;
    if (
      JSON.stringify(trade) !== JSON.stringify(prevProps.trade) ||
      gasPrice !== prevProps.gasPrice ||
      !createBigNumber(availableEth).eq(createBigNumber(availableEth))
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
      ethToDaiRate,
      Gnosis_ENABLED,
    } = props || this.props;

    const {
      totalCost,
      selfTrade,
      potentialDaiLoss,
      numFills,
      loopLimit,
    } = trade;
    let numTrades = Math.ceil(numFills / loopLimit);
    let needsApproval = false;
    let messages: Message | null = null;

    const gasCost = formatGasCostToEther(
      gasLimit,
      { decimalsRounded: 4 },
      gasPrice
    );

    let gasCostDai = null;

    if (Gnosis_ENABLED && ethToDaiRate) {
      gasCostDai = formatDai(ethToDaiRate.multipliedBy(createBigNumber(gasCost))).formattedValue;
    }

    if (
      allowanceBigNumber &&
      createBigNumber(totalCost.value).gt(allowanceBigNumber) &&
      !tradingTutorial
    ) {
      needsApproval = true;
      messages = {
        header: 'MULTIPLE TRANSACTIONS',
        type: WARNING,
        message: `This trade will take ${numTrades} Transactions and 1 approval.`,
      };
    }

    if (!isNaN(numTrades) && numTrades > 1 && !tradingTutorial) {
      messages = {
        header: 'MULTIPLE TRANSACTIONS',
        type: WARNING,
        message: `This trade will take ${numTrades} Transactions${
          needsApproval ? `, and 1 approval.` : ``
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

    // GAS error in DAI [Gnosis]
    if (
      Gnosis_ENABLED &&
      totalCost &&
      createBigNumber(gasCostDai, 10).gte(createBigNumber(availableDai, 10))
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCostDai} DAI required for gas.`,
      };
    }

    // GAS error in ETH
    if (
      !Gnosis_ENABLED &&
      totalCost &&
      createBigNumber(gasCost, 10).gte(createBigNumber(availableEth, 10))
    ) {
      messages = {
        header: 'Insufficient ETH',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCost} ETH required for gas.`,
      };
    }

    if (
      totalCost &&
      createBigNumber(potentialDaiLoss.fullPrecision, 10).gt(
        createBigNumber(availableDai, 10)
      ) && !tradingTutorial
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: 'You do not have enough DAI to place this order',
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
    } = trade;

    const { messages } = this.state;

    const greaterLess = side === BUY ? 'greater' : 'less';
    const higherLower = side === BUY ? 'higher' : 'lower';

    const marketRange = createBigNumber(maxPrice).minus(createBigNumber(minPrice)).abs();

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
      newOrderAmount = formatShares(
        createBigNumber(numShares).minus(shareCost.fullPrecision),
        {
          decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
        }
      ).rounded;
    }

    const notProfitable =
      (orderShareProfit && createBigNumber(orderShareProfit.value).lte(0)) ||
      (totalCost.value > 0 &&
        potentialDaiProfit &&
        potentialDaiProfit.value <= 0);

    return (
      <section className={Styles.TradingConfirm}>
        {shareCost && shareCost.value !== 0 && (
          <div className={Styles.TradingConfirm__details}>
            <div className={Styles.TradingConfirm__position__properties}>
              CLOSING POSITION
            </div>
            <div
              className={classNames(Styles.TradingConfirm__agg_position, {
                [Styles.long]: side === BUY,
                [Styles.short]: side === SELL,
              })}
            >
              <span>
                {side !== BUY ? SELLING_OUT : BUYING_BACK}
                <span>{shareCost.fullPrecision}</span>
                Shares @<span>{limitPrice}</span>
              </span>
            </div>
            <LinearPropertyLabel
              label="Estimated Fee"
              value={`${orderShareTradingFee.rounded} DAI`}
            />
            <LinearPropertyLabel
              label="Profit"
              value={`${orderShareProfit.rounded} DAI`}
              accentValue={notProfitable}
            />
          </div>
        )}
        {newOrderAmount !== "0" && (
          <div className={Styles.TradingConfirm__details}>
            <div
              className={classNames(
                Styles.TradingConfirm__position__properties,
                Styles.TradingConfirm__position__tooltipContainer
              )}
            >
              NEW POSITION
              <span className={Styles.TradingConfirm__TooltipContainer}>
                <label
                  className={classNames(
                    TooltipStyles.TooltipHint,
                    Styles.TradingConfirm__TooltipHint
                  )}
                  data-tip
                  data-for="tooltip--confirm"
                >
                  {InfoIcon}
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
              className={classNames(Styles.TradingConfirm__agg_position, {
                [Styles.long]: side === BUY,
                [Styles.short]: side === SELL,
              })}
            >
              <span>
                {side === BUY ? BUYING : SELLING}
                <span>{newOrderAmount}</span>
                Shares @<span>{limitPrice}</span>
              </span>
            </div>
            <LinearPropertyLabel
              label="Max Profit"
              value={`${potentialDaiProfit.formatted} DAI`}
            />
            <LinearPropertyLabel
              label="Max Loss"
              value={`${potentialDaiLoss.formatted} DAI`}
            />
          </div>
        )}
        {messages && (
          <div
            className={classNames(
              Styles.TradingConfirm__error_message_container,
              {
                [Styles.error]: messages.type === ERROR,
              }
            )}
          >
            <div
              className={classNames({
                [Styles.TradingConfirm__message__warning]:
                  messages.type === WARNING,
                [Styles.TradingConfirm__message__error]:
                  messages.type === ERROR,
              })}
            >
              {ExclamationCircle}
              <span>{messages.header}</span>
              {messages.type !== ERROR && (
                <button onClick={this.clearErrorMessage}>{XIcon}</button>
              )}
            </div>
            <div>{messages.message}</div>
          </div>
        )}
      </section>
    );
  }
}

export default Confirm;
