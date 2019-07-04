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
import { formatGasCostToEther, formatShares } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { LinearPropertyLabel } from 'modules/common/labels';
import { FormattedNumber, Trade } from 'modules/types';
import { MarketInfoOutcome } from '@augurproject/sdk/build/state/getter/Markets';

interface Message {
  header: string;
  type: string;
  message: string;
}

interface ConfirmProps {
  allowanceAmount: FormattedNumber;
  trade: Trade;
  gasPrice: number;
  gasLimit: number;
  availableFunds: BigNumber;
  availableDai: BigNumber;
  selectedOutcome: MarketInfoOutcome;
  marketType: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  scalarDenomination: string | null;
  numOutcomes: number;
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

  componentWillReceiveProps(nextProps) {
    const { trade, gasPrice, availableFunds } = this.props;
    if (
      trade !== nextProps.trade ||
      gasPrice !== nextProps.gasPrice ||
      availableFunds !== nextProps.availableFunds
    ) {
      this.setState({
        messages: this.constructMessages(nextProps),
      });
    }
  }

  constructMessages(props) {
    const {
      trade,
      allowanceAmount,
      gasPrice,
      gasLimit,
      availableFunds,
      availableDai,
    } = props || this.props;

    const { totalCost, selfTrade, potentialEthLoss } = trade;

    let messages: Message | null = null;
    const tradeTotalCost = createBigNumber(totalCost.fullPrecision, 10);
    const gasCost = formatGasCostToEther(
      gasLimit,
      { decimalsRounded: 4 },
      gasPrice
    );

    if (selfTrade) {
      messages = {
        header: 'CONSUMING OWN ORDER',
        type: WARNING,
        message: 'You are trading against one of your existing orders',
      };
    }

    if (
      totalCost &&
      createBigNumber(gasCost, 10).gte(createBigNumber(availableFunds, 10))
    ) {
      messages = {
        header: 'Insufficient ETH',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${gasCost} ETH required for gas.`,
      };
    }

    if (
      totalCost &&
      createBigNumber(potentialEthLoss.fullPrecision, 10).gt(
        createBigNumber(availableDai, 10)
      )
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: 'You do not have enough DAI to place this order',
      };
    }

    if (
      totalCost &&
      allowanceAmount &&
      createBigNumber(potentialEthLoss.fullPrecision, 10).gt(
        createBigNumber(allowanceAmount.fullPrecision, 10)
      )
    ) {
      messages = {
        header: 'Insufficient Approved Funds',
        type: ERROR,
        message: 'You do not have enough approved funds to place this order.',
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
      selectedOutcome,
      marketType,
      maxPrice,
      minPrice,
      scalarDenomination,
    } = this.props;

    const {
      limitPrice,
      numShares,
      potentialEthProfit,
      potentialEthLoss,
      totalCost,
      shareCost,
      sharesFilled,
      side,
      orderShareProfit,
      orderShareTradingFee,
    } = trade;

    const { messages } = this.state;

    const outcomeName = selectedOutcome.description;
    const greaterLess = side === BUY ? 'greater' : 'less';
    const higherLower = side === BUY ? 'higher' : 'lower';

    const marketRange = maxPrice.minus(minPrice).abs();

    const limitPricePercentage = (side === BUY
      ? createBigNumber(limitPrice)
      : maxPrice.minus(createBigNumber(limitPrice))
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
        potentialEthProfit &&
        potentialEthProfit.value <= 0);

    return (
      <section className={Styles.TradingConfirm}>
        {((shareCost && shareCost.value !== 0) ||
          (totalCost && totalCost.value !== 0)) && (
          <div className={Styles.TrandingConfirm__topBorder} />
        )}
        {shareCost && shareCost.value !== 0 && (
          <div className={Styles.TradingConfirm__details}>
            <div className={Styles.TradingConfirm__position__properties}>
              CLOSING POSITION
            </div>
            <div className={Styles.TradingConfirm__agg_position}>
              <span
                className={classNames({
                  [Styles.long]: side === BUY,
                  [Styles.short]: side === SELL,
                })}
              >
                {side !== BUY ? SELLING_OUT : BUYING_BACK}
              </span>
              <span> {shareCost.fullPrecision} </span>
              Shares @ <span> {limitPrice}</span>
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
        {(totalCost && totalCost.value !== 0) ||
          (sharesFilled && sharesFilled.value !== 0 && (
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
              <div className={Styles.TradingConfirm__agg_position}>
                <span
                  className={classNames({
                    [Styles.long]: side === BUY,
                    [Styles.short]: side === SELL,
                  })}
                >
                  {side === BUY ? BUYING : SELLING}
                </span>
                <span> {newOrderAmount} </span>
                Shares @ <span> {limitPrice}</span>
              </div>
              <LinearPropertyLabel
                label="Max Profit"
                value={`${potentialEthProfit.rounded} DAI`}
              />
              <LinearPropertyLabel
                label="Max Loss"
                value={`${potentialEthLoss.rounded} DAI`}
              />
            </div>
          ))}
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
