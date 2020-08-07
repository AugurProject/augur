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
  INVALID_OUTCOME_ID,
  HELP_CENTER,
  CREATEAUGURWALLET,
  TRANSACTIONS,
  GWEI_CONVERSION,
  ETH,
  PUBLICTRADE,
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
  formatEther,
} from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { LinearPropertyLabel, TransactionFeeLabelToolTip, ApprovalTxButtonLabel } from 'modules/common/labels';
import { Trade, FormattedNumber } from 'modules/types';
import { ExternalLinkButton, ProcessingButton, PrimaryButton } from 'modules/common/buttons';
import { approvalsNeededToTrade, approveToTrade } from 'modules/contracts/actions/contractCalls';
import { getGasCost } from 'modules/modal/gas';

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
  tradingApproved: boolean;
  trade: Trade;
  gasPrice: number;
  gasLimit: number;
  normalGasLimit: number;
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
  showAddFundsModal: Function;
  sweepStatus: string;
  postOnlyOrder: boolean;
  allowPostOnlyOrder: boolean;
  ethToDaiRate: FormattedNumber;
  account: string;
  checkAccountApproval: Function;
  affiliate: string;
  isLogged: boolean;
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
      tradingApproved,
      gasPrice,
      gasLimit,
      normalGasLimit,
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
      showAddFundsModal,
      ethToDaiRate,
      initialLiquidity,
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

    // don't show any messages in reporting UI
    if (process.env.REPORTING_ONLY) return null;

    let numTrades = loopLimit ? Math.ceil(numFills / loopLimit) : numFills;
    let needsApproval = false;
    let messages: Message | null = null;

    const averageGasLimit = gasLimit ? gasLimit.plus(normalGasLimit).div(2) : createBigNumber(0);
    const averageGasCost = getGasCost(averageGasLimit, gasPrice, ethToDaiRate);
    const gasCostInEth = gasLimit
      ? createBigNumber(formatGasCostToEther(gasLimit, { decimalsRounded: 4 }, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)))
      : ZERO;

    const gasCostDai = formatDai(createBigNumber(ethToDaiRate?.value || 0).times(createBigNumber(gasCostInEth)));

    if (marketType === SCALAR && selectedOutcomeId === INVALID_OUTCOME_ID) {
      messages = {
        header: null,
        type: WARNING,
        message: `Percentages are determind by denomination range, rounding may occur. `,
        link: HELP_CENTER,
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

    if (
      !isNaN(numTrades) &&
      numTrades > 0 &&
      ((potentialDaiProfit && potentialDaiProfit.value !== 0 &&
        createBigNumber(averageGasCost.value).gt(potentialDaiProfit.value)) ||
        (orderShareProfit && orderShareProfit.value !== 0 &&
          createBigNumber(averageGasCost.value).gt(orderShareProfit.value))) &&
      !tradingTutorial
    ) {
      messages = {
        header: 'UNPROFITABLE TRADE',
        type: ERROR,
        message: `Est. tx fee is higher than profit. Placing an unmatched order will not have a tx fee.`,
      };
    }

    if (selfTrade) {
      messages = {
        header: 'CONSUMING OWN ORDER',
        type: WARNING,
        message: 'You are trading against one of your existing orders',
      };
    }

    if (disableTrading && !tradingTutorial) {
      messages = {
        header: 'Reporting Only',
        type: WARNING,
        message: 'Trading is disabled',
      };
    }

    if (
      !tradingTutorial &&
      totalCost &&
      createBigNumber(gasCostInEth).gte(createBigNumber(availableEth))
    ) {
      const ethDo = formatEther(gasCostInEth);
      messages = {
        header: 'Insufficient ETH',
        type: ERROR,
        message: `You do not have enough funds to place this order. ${ethDo.formatted} ETH required for gas.`,
      };
    }

    if (
      !tradingTutorial &&
      totalCost &&
      createBigNumber(potentialDaiLoss.fullPrecision).gt(
        createBigNumber(availableDai)
      )
    ) {
      messages = {
        header: 'Insufficient DAI',
        type: ERROR,
        message: 'You do not have enough DAI to place this order',
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
      availableDai,
      showAddFundsModal,
      ethToDaiRate,
      account,
      checkAccountApproval,
      tradingApproved,
      affiliate,
      isLogged,
      availableEth,
      normalGasLimit,
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

    const gasCostInEth = gasLimit
      ? createBigNumber(formatGasCostToEther(gasLimit, { decimalsRounded: 4 }, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)))
      : ZERO;

    const gasCostDai = formatDai(createBigNumber(ethToDaiRate?.value || 0).times(createBigNumber(gasCostInEth)));

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
                gasEstimate={gasLimit}
                normalGasLimit={normalGasLimit}
              />
            )}
            {postOnlyOrder && (
              <TransactionFeeLabelToolTip
                gasEstimate={0}
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
              gasEstimate={(tradingTutorial || postOnlyOrder) ? 0 : gasLimit}
              normalGasLimit={numFills > 0 && normalGasLimit}
            />
          </div>
        )}
        { !tradingApproved && isLogged && !tradingTutorial && !initialLiquidity &&
          <ApprovalTxButtonLabel
            className={Styles.ApprovalNotice}
            ignore={Boolean(process.env.REPORTING_ONLY)}
            title={'One time approval needed'}
            buttonName={'Approve'}
            userEthBalance={String(availableEth)}
            gasPrice={gasPrice}
            checkApprovals={approvalsNeededToTrade}
            doApprovals={() => approveToTrade(account, affiliate)}
            account={account}
            approvalType={PUBLICTRADE}
            isApprovalCallback={() => checkAccountApproval()}
            addFunds={() => showAddFundsModal({ tokenToAdd: ETH })}
          />
        }

        {messages && isLogged && (
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

            {!tradingTutorial && isLogged && totalCost && (createBigNumber(potentialDaiLoss.fullPrecision).gt(createBigNumber(availableDai)) ||
            createBigNumber(gasCostInEth).gte(createBigNumber(availableEth))) &&
              <PrimaryButton action={() => showAddFundsModal()} text={'Add Funds'} />
            }
          </div>
        )}
      </section>
    );
  }
}

export default Confirm;
