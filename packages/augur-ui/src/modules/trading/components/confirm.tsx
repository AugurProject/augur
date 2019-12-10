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
import Styles from 'modules/trading/components/confirm.styles.less';
import { XIcon, ExclamationCircle, InfoIcon, InformationIcon, QuestionIcon } from 'modules/common/icons';
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
  GnosisUnavailable: boolean;
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
    const { trade, gasPrice, availableEth, availableDai } = this.props;
    if (
      JSON.stringify(trade) !== JSON.stringify(prevProps.trade) ||
      gasPrice !== prevProps.gasPrice ||
      !createBigNumber(prevProps.availableEth).eq(createBigNumber(availableEth)) ||
      !createBigNumber(prevProps.availableDai).eq(createBigNumber(availableDai))
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
      GnosisUnavailable,
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

    if (GnosisUnavailable) {
      messages = {
        header: 'Waiting For Gnosis Safe',
        type: WARNING,
        message: 'Please hold on while we create your Augur wallet',
      }
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
          <div className={Styles.details}>
            <div className={Styles.properties}>
              CLOSING POSITION
            </div>
            <div
              className={classNames(Styles.AggregatePosition, {
                [Styles.long]: side === BUY,
                [Styles.short]: side === SELL,
              })}
            >
              {
                `${side === BUY ? BUYING_BACK : SELLING_OUT}
                ${shareCost.fullPrecision}
                Shares @ ${limitPrice}`
              }
            </div>
            <LinearPropertyLabel
              label="Estimated Fee"
              value={orderShareTradingFee}
              showDenomination={true}
            />
            <LinearPropertyLabel
              label="Profit"
              value={orderShareProfit}
              accentValue={notProfitable}
              showDenomination={true}
            />
          </div>
        )}
        {newOrderAmount !== "0" && (
          <div className={Styles.details}>
            <div
              className={classNames(
                Styles.properties,
                Styles.TooltipContainer
              )}
            >
              NEW POSITION
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
                {
                `${side === BUY ? BUYING : SELLING}
                ${newOrderAmount}
                Shares @ ${limitPrice}`
                }
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
          </div>
        )}
        {messages && (
          <div
            className={classNames(
              Styles.MessageContainer,
              {
                [Styles.Error]: messages.type === ERROR
              }
            )}
          >
            {messages.type === ERROR ? ExclamationCircle : InformationIcon}
            <span>{messages.header}</span>
            <div>{messages.message}</div>
            {messages.type !== ERROR && (
              <button onClick={this.clearErrorMessage}>{XIcon}</button>
            )}
          </div>
        )}
      </section>
    );
  }
}

export default Confirm;
