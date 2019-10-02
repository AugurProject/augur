import React, { Component, useState } from 'react';
import classNames from 'classnames';
import { createBigNumber } from 'utils/create-big-number';
import {
  ZERO,
  MY_TOTOL_REP_STAKED,
  ALL_TIME_PROFIT_AND_LOSS_REP,
  REPORTING_STATE,
  SCALAR,
} from 'modules/common/constants';
import { FormattedNumber, SizeTypes, MarketData } from 'modules/types';
import ReactTooltip from 'react-tooltip';
import {
  SecondaryButton,
  CancelTextButton,
  PrimaryButton,
} from 'modules/common/buttons';
import { TextInput } from 'modules/common/form';
import {
  LinearPropertyLabel,
  SizableValueLabel,
  RepBalance,
  MovementLabel,
  InReportingLabel,
} from 'modules/common/labels';
import { ButtonActionType } from 'modules/types';
import { formatRep, formatAttoRep } from 'utils/format-number';
import MarketLink from 'modules/market/components/market-link/market-link';
import { MarketProgress } from 'modules/common/progress';
import { ExclamationCircle, InfoIcon, XIcon } from 'modules/common/icons';
import ChevronFlip from 'modules/common/chevron-flip';

import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/reporting/common.styles.less';
import { Getters, convertDisplayValuetoAttoValue, convertAttoValueToDisplayValue } from '@augurproject/sdk';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';

interface DismissableNoticeProps {
  content: JSX.Element;
  show: boolean;
}

export const DismissableNotice = (props: DismissableNoticeProps) => {
  const [show, setShow] = useState(props.show);

  return (
    <div className={Styles.DismissableNotice}>
      {show ? (
        <div>
          <span>
            {ExclamationCircle}
          </span>
          {props.content}
          <button
            type='button'
            className={Styles.close}
            onClick={() => setShow(() => false)}
          >
            {XIcon}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export interface ReportingPercentProps {
  firstPercent: FormattedNumber;
  userValue: FormattedNumber;
  thirdPercent: FormattedNumber;
  total: FormattedNumber;
}

export const ReportingPercent = (props: ReportingPercentProps) => {
  const firstPercent = calculatePosition(
    ZERO,
    createBigNumber(props.total.value),
    props.firstPercent
  );
  const secondPercent = calculatePosition(
    ZERO,
    createBigNumber(props.total.value),
    props.userValue
  );
  const thirdPercent = calculatePosition(
    ZERO,
    createBigNumber(props.total.value),
    props.thirdPercent
  );

  const key = `tooltip-${props.userValue.formattedValue}-existingStake`
  return (
    <div
      className={classNames(Styles.ReportingPercent, {
        [Styles.Round]: firstPercent === 0 && secondPercent === 0,
        [Styles.RoundSecond]: firstPercent === 0,
      })}
      key={key}
    >
      <span style={{ width: `${firstPercent > 100 ? 100 : firstPercent}%` }} />
      <span
        style={{ width: `${secondPercent > 100 ? 100 : secondPercent}%` }}
        data-tip
        data-for={key}
      />
      <ReactTooltip
        id={key}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
      >
        My Existing Stake
        <p>{props.userValue.formattedValue} REP</p>
      </ReactTooltip>
      {thirdPercent > 100
        ? ''
        : thirdPercent > 0 && <span style={{ width: `${thirdPercent}%` }} />}
    </div>
  );
};

export interface SubheadersProps {
  header: string;
  subheader: string;
  small?: boolean;
  info?: boolean;
  large?: boolean;
  secondSubheader?: string;
}

export const Subheaders = (props: SubheadersProps) => (
  <div
    className={classNames(Styles.ReportingSubheaders, {
      [Styles.Small]: props.small,
      [Styles.Large]: props.large,
    })}
  >
    <span>
      {props.header}
      {props.info && InfoIcon}
    </span>
    <p>
      <span>
        {props.subheader}
        {props.secondSubheader && <span>{props.secondSubheader}</span>}
      </span>
    </p>
  </div>
);

export interface ReportingModalButtonProps {
  text: string;
  action: ButtonActionType;
}

export const ReportingModalButton = (props: ReportingModalButtonProps) => (
  <button
    className={Styles.ReportingModalButton}
    onClick={e => props.action(e)}
  >
    {props.text}
  </button>
);

interface PreFilledStakeProps {
  showInput: boolean;
  toggleInput: Function;
  preFilledStake?: string;
  updatePreFilledStake: Function;
  stakeError?: string;
  threshold: number;
}

export class PreFilledStake extends Component<PreFilledStakeProps, {}> {
  updateDisputeStake = stake => {
    this.props.updatePreFilledStake(stake);
  };

  changeShowInput = () => {
    this.props.toggleInput();
  };

  render() {
    const s = this.state;

    const { preFilledStake, stakeError, threshold } = this.props;

    return (
      <div className={Styles.PreFilledStake}>
        <span>add pre-filled stake?</span>
        <span>
          Pre-fund future dispute rounds to accelerate market resolution. Any
          contributed REP will automatically go toward disputing in favor of
          [insert outcome user is staking on], if it is no longer the tentative
          winning outcome in future rounds
        </span>
        {!this.props.showInput && (
          <SecondaryButton
            text="Add Pre-Filled Stake"
            action={this.changeShowInput}
          />
        )}
        {this.props.showInput && (
          <>
            <TextInput
              placeholder={'0.0000'}
              value={preFilledStake}
              onChange={value => this.updateDisputeStake(value)}
              errorMessage={stakeError}
              innerLabel="REP"
            />
            <div>
              <CancelTextButton
                noIcon
                action={() => this.updateDisputeStake(threshold.toString())}
                text={'MAX (REP THRESHOLD)'}
              />
              <CancelTextButton
                noIcon
                action={() => this.updateDisputeStake('')}
                text={'CLEAR'}
              />
            </div>
            <span>Review Pre-Filled Stake</span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total Rep"
              value={formatRep(preFilledStake).formatted + ' REP'}
            />
          </>
        )}
      </div>
    );
  }
}

export interface DisputingButtonViewProps {
  fullBond: FormattedNumber;
  stakeCurrent: FormattedNumber;
  bondSizeCurrent: FormattedNumber;
  inputtedStake: FormattedNumber;
  userValue: FormattedNumber;
}

export const DisputingButtonView = (props: DisputingButtonViewProps) => (
  <div className={Styles.DisputingButtonView}>
    <div>
      <span>Make tentative winner</span>
      <span>
        {props.fullBond && props.fullBond.formatted}
        <span>
          / {props.bondSizeCurrent && props.bondSizeCurrent.formatted} REP
        </span>
      </span>
    </div>
    <ReportingPercent
      firstPercent={props.stakeCurrent}
      userValue={props.userValue}
      thirdPercent={props.inputtedStake}
      total={props.bondSizeCurrent}
    />
  </div>
);

export interface ScalarOutcomeViewProps {
  inputScalarOutcome: string;
  updateScalarOutcome: Function;
  scalarDenomination: string;
  scalarError?: string;
}

export const ScalarOutcomeView = (props: ScalarOutcomeViewProps) => (
  <div className={Styles.ScalarOutcomesView}>
    <TextInput
      placeholder={'Enter a number'}
      value={props.inputScalarOutcome}
      onChange={value => props.updateScalarOutcome(value)}
      errorMessage={props.scalarError}
    />
    <h2>{props.scalarDenomination}</h2>
  </div>
);

export interface DisputingBondsViewProps {
  market: MarketData;
  id: string;
  checked: string;
  isInvalid: boolean;
  inputScalarOutcome: string;
  updateScalarOutcome: Function;
  stakeValue: string;
  updateDisputeStake: Function;
  userAvailableRep: number;
  stakeRemaining?: string;
  tentativeWinning?: boolean;
  reportAction: Function;
}

interface DisputingBondsViewState {
  disabled: boolean;
  scalarError: string;
  stakeError: string;
  isScalar: boolean;
}

export class DisputingBondsView extends Component<
  DisputingBondsViewProps,
  DisputingBondsViewState
> {
  state: DisputingBondsViewState = {
    disabled: true,
    scalarError: '',
    stakeError: '',
    isScalar: this.props.market.marketType === SCALAR,
  };

  updateScalarOutcome = (range: string) => {
    const { market, updateScalarOutcome, stakeValue } = this.props;

    if (
      createBigNumber(range).lt(createBigNumber(market.minPrice)) ||
      createBigNumber(range).gt(createBigNumber(market.maxPrice))
    ) {
      this.setState({
        scalarError: 'Input value not between scalar market range',
        disabled: true,
      });
    } else if (isNaN(Number(range)) || range === '') {
      this.setState({ scalarError: 'Enter a valid number', disabled: true });
    } else {
      this.setState({ scalarError: '' });
      if (this.state.stakeError === '' && stakeValue !== '') {
        this.setState({ disabled: false });
      }
    }
    updateScalarOutcome(range);
  };

  updateDisputeStake = (inputStakeValue: string) => {
    const {
      market,
      updateDisputeStake,
      inputScalarOutcome,
      userAvailableRep,
      stakeRemaining,
      tentativeWinning,
      isInvalid
    } = this.props;
    let inputToAttoRep = null;
    const { isScalar } = this.state;
    const min = formatAttoRep(market.noShowBondAmount).value;
    const remaining = formatAttoRep(stakeRemaining).value;
    if (!isNaN(Number(inputStakeValue))) {
      inputToAttoRep = convertDisplayValuetoAttoValue(createBigNumber(inputStakeValue));
    }
    if (
      isNaN(Number(inputStakeValue)) ||
      inputStakeValue === '' ||
      inputStakeValue === '0' ||
      inputStakeValue === '.' ||
      inputStakeValue === '0.'
    ) {
      this.setState({ stakeError: 'Enter a valid number', disabled: true });
      return updateDisputeStake({inputStakeValue, inputToAttoRep});
    } else if (
      createBigNumber(userAvailableRep).lt(createBigNumber(inputStakeValue))
    ) {
      this.setState({
        stakeError: `Value is bigger than REP balance: ${userAvailableRep} REP`,
        disabled: true,
      });
    } else if (
      !tentativeWinning &&
      stakeRemaining &&
      createBigNumber(stakeRemaining).lt(inputToAttoRep)
    ) {
      this.setState({
        stakeError: `Value is bigger than needed: ${remaining} REP`,
        disabled: true,
      });
    } else if (
      !tentativeWinning &&
      stakeRemaining &&
      createBigNumber(inputToAttoRep).lt(
        createBigNumber(market.noShowBondAmount)
      )
    ) {
      this.setState({
        stakeError: `Value is smaller than minimum: ${min} REP`,
        disabled: true,
      });
    } else {
      this.setState({ stakeError: '' });
      if (
        this.state.scalarError === '' &&
        ((isScalar && inputScalarOutcome !== '') || isInvalid) || (!isScalar)
      ) {
        this.setState({ disabled: false });
      }
    }
    updateDisputeStake({inputStakeValue, inputToAttoRep});
  };

  render() {
    const {
      market,
      inputScalarOutcome,
      stakeValue,
      stakeRemaining,
      tentativeWinning,
      reportAction,
      id
    } = this.props;

    const { disabled, scalarError, stakeError, isScalar } = this.state;
    const min = convertAttoValueToDisplayValue(createBigNumber(market.noShowBondAmount));
    const remaining = convertAttoValueToDisplayValue(createBigNumber(stakeRemaining));
    // id === "null" means blank scalar, user can input new scalar value to dispute
    return (
      <div
        className={classNames(Styles.DisputingBondsView)}
      >
        {isScalar && id === "null" && (
          <ScalarOutcomeView
            inputScalarOutcome={inputScalarOutcome}
            updateScalarOutcome={this.updateScalarOutcome}
            scalarDenomination={market.scalarDenomination}
            scalarError={scalarError}
          />
        )}
        <TextInput
          placeholder={'0.0000'}
          value={String(stakeValue)}
          onChange={value => this.updateDisputeStake(value)}
          errorMessage={stakeError}
          innerLabel="REP"
        />
        {!tentativeWinning && (
          <section>
            <CancelTextButton
              noIcon
              action={() => this.updateDisputeStake(String(min))}
              text={'MIN'}
            />
            |
            <CancelTextButton
              noIcon
              action={() => this.updateDisputeStake(String(remaining))}
              text={'FILL DISPUTE BOND'}
            />
          </section>
        )}
        <span>Review</span>
        <LinearPropertyLabel
          key="disputeRoundStake"
          label={tentativeWinning ? "Contribute to Next Round" : "Dispute Round Stake"}
          value={formatRep(stakeValue || ZERO).formatted + ' REP'}
        />
        <LinearPropertyLabel
          key="estimatedGasFee"
          label="Estimated Gas Fee"
          value={'0.0000 ETH'}
        />
        <PrimaryButton
          text="Confirm"
          action={reportAction}
          disabled={disabled}
        />
      </div>
    );
  }
}

export interface ReportingBondsViewProps {
  market: MarketData;
  id: string;
  updateScalarOutcome: Function;
  reportingGasFee: FormattedNumber;
  reportAction: Function;
  preFilledStake?: string;
  updatePreFilledStake?: Function;
  inputScalarOutcome?: string;
  userAvailableRep: number;
}

interface ReportingBondsViewState {
  showInput: boolean;
  disabled: boolean;
  scalarError: string;
  stakeError: string;
  isScalar: boolean;
}

export class ReportingBondsView extends Component<
  ReportingBondsViewProps,
  ReportingBondsViewState
> {
  state: ReportingBondsViewState = {
    showInput: false,
    disabled: this.props.market.marketType === SCALAR ? true : false,
    scalarError: '',
    stakeError: '',
    isScalar: this.props.market.marketType === SCALAR,
  };

  toggleInput = () => {
    this.setState({ showInput: !this.state.showInput });
  };

  updateScalarOutcome = (range: string) => {
    const { market, updateScalarOutcome } = this.props;

    if (
      createBigNumber(range).lt(createBigNumber(market.minPrice)) ||
      createBigNumber(range).gt(createBigNumber(market.maxPrice))
    ) {
      this.setState({
        scalarError: 'Input value not between scalar market range',
        disabled: true,
      });
    } else if (isNaN(Number(range)) || range === '') {
      this.setState({ scalarError: 'Enter a valid number', disabled: true });
    } else {
      this.setState({ scalarError: '' });
      if (this.state.stakeError === '') {
        this.setState({ disabled: false });
      }
    }
    updateScalarOutcome(range);
  };

  updatePreFilledStake = (stake: string) => {
    const {
      updatePreFilledStake,
      inputScalarOutcome,
      userAvailableRep,
    } = this.props;
    const { isScalar } = this.state;

    if (isNaN(Number(stake))) {
      this.setState({ stakeError: 'Enter a valid number', disabled: true });
    } else if (createBigNumber(userAvailableRep).lt(createBigNumber(stake))) {
      this.setState({
        stakeError: 'Value is bigger than REP balance',
        disabled: true,
      });
    } else {
      this.setState({ stakeError: '' });
      if (
        this.state.scalarError === '' &&
        ((isScalar && inputScalarOutcome !== '') || !isScalar)
      ) {
        this.setState({ disabled: false });
      }
    }
    updatePreFilledStake(stake);
  };

  render() {
    const {
      market,
      inputScalarOutcome,
      reportingGasFee,
      reportAction,
      preFilledStake,
      userAvailableRep,
      id,
    } = this.props;

    const { showInput, disabled, scalarError, stakeError, isScalar } = this.state;
    const preFilled = preFilledStake || '0';

    // id === "null" means blank scalar, user can input new scalar value to dispute
    return (
      <div
        className={classNames(Styles.ReportingBondsView, {
          [Styles.Scalar]: isScalar,
        })}
      >
        {isScalar && id === "null" && (
          <ScalarOutcomeView
            inputScalarOutcome={inputScalarOutcome}
            updateScalarOutcome={this.updateScalarOutcome}
            scalarDenomination={market.scalarDenomination}
            scalarError={scalarError}
          />
        )}
        {market.reportingState === REPORTING_STATE.OPEN_REPORTING && (
          <>
            <span>Review Initial Reporting</span>
            <LinearPropertyLabel
              key="initial"
              label="open reporter winning Stake"
              value={`${formatAttoRep(market.noShowBondAmount).formatted} REP`}
            />
          </>
        )}
        <LinearPropertyLabel
          key="totalEstimatedGasFee"
          label="Transaction Fee"
          value={reportingGasFee}
        />
        <PreFilledStake
          showInput={showInput}
          toggleInput={this.toggleInput}
          updatePreFilledStake={this.updatePreFilledStake}
          preFilledStake={preFilledStake}
          stakeError={stakeError}
          threshold={userAvailableRep}
        />
        {showInput && (
          <div>
            <span>Totals</span>
            <span>
              Sum total of Initial Reporter Stake and Pre-Filled Stake
            </span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total rep"
              value={
                formatAttoRep(
                  createBigNumber(preFilled).plus(
                    createBigNumber(market.noShowBondAmount)
                  )
                ).formatted
              }
            />
          </div>
        )}
        <PrimaryButton
          text="Confirm"
          disabled={disabled}
          action={() => reportAction()}
        />
      </div>
    );
  }
}

interface UserRepDisplayState {
  toggle: boolean;
}

export interface ReportingCardProps {
  market: MarketData;
  currentAugurTimestamp: number;
  disputingWindowEndTime: number;
  showReportingModal: Function;
  callback: Function;
  isLogged: boolean;
}

export const ReportingCard = (props: ReportingCardProps) => {
  const {
    market,
    currentAugurTimestamp,
    showReportingModal,
    isLogged,
  } = props;

  if (!market) return null;

  const {
    id,
    description,
    reportingState,
    disputeInfo,
    endTimeFormatted,
  } = market;

  const preReporting = reportingState === REPORTING_STATE.PRE_REPORTING;

  return (
    <div className={Styles.ReportingCard}>
      <InReportingLabel
        reportingState={reportingState}
        disputeInfo={disputeInfo}
        endTimeFormatted={endTimeFormatted}
        currentAugurTimestamp={currentAugurTimestamp}
      />
      <MarketLink id={id}>{description}</MarketLink>
      {reportingState !== REPORTING_STATE.OPEN_REPORTING && (
        <MarketProgress
          reportingState={reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
        />
      )}
      <div data-tip data-for={'tooltip--preReporting' + id}>
        <PrimaryButton
          text="Report"
          action={showReportingModal}
          disabled={preReporting || !isLogged}
        />
        {(preReporting || !isLogged) && (
          <ReactTooltip
            id={'tooltip--preReporting' + id}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
          >
            <p>
              {preReporting
                ? 'Please wait until the Maket is ready to Report on'
                : 'Please connect a wallet to Report on this Market'}{' '}
            </p>
          </ReactTooltip>
        )}
      </div>
    </div>
  );
};

interface AllTimeProfitLossProps {
  repProfitAmountFormatted: FormattedNumber;
  repProfitLossPercentageFormatted: FormattedNumber;
}

const AllTimeProfitLoss = (props: AllTimeProfitLossProps) => (
  <div className={Styles.AllTimeProfitLoss}>
    {ALL_TIME_PROFIT_AND_LOSS_REP}
    <div>
      <SizableValueLabel
        value={props.repProfitAmountFormatted}
        showDenomination
        showEmptyDash={false}
        highlight
        size={SizeTypes.SMALL}
      />
      <MovementLabel
        showColors
        size={SizeTypes.SMALL}
        showPlusMinus
        showPercent
        showIcon
        showBrackets={true}
        value={Number(props.repProfitLossPercentageFormatted.roundedValue)}
      />
    </div>
  </div>
);

interface UserRepDisplayProps {
  isLoggedIn: boolean;
  repBalanceFormatted: FormattedNumber;
  repProfitLossPercentageFormatted: FormattedNumber;
  repProfitAmountFormatted: FormattedNumber;
  disputingAmountFormatted: FormattedNumber;
  reportingAmountFormatted: FormattedNumber;
  participationAmountFormatted: FormattedNumber;
  repTotalAmountStakedFormatted: FormattedNumber;
  openGetRepModal: Function;
  hasStakedRep: boolean;
}

export class UserRepDisplay extends Component<
  UserRepDisplayProps,
  UserRepDisplayState
> {
  state: UserRepDisplayState = {
    toggle: false,
  };

  toggle = () => {
    this.setState({ toggle: !this.state.toggle });
  };

  render() {
    const {
      isLoggedIn,
      repBalanceFormatted,
      repProfitAmountFormatted,
      repProfitLossPercentageFormatted,
      openGetRepModal,
      repTotalAmountStakedFormatted,
      disputingAmountFormatted,
      reportingAmountFormatted,
      participationAmountFormatted,
      hasStakedRep,
    } = this.props;
    const s = this.state;

    return (
      <div
        className={classNames(Styles.UserRepDisplay, {
          [Styles.loggedOut]: isLoggedIn,
          [Styles.HideForMobile]: s.toggle,
        })}
      >
        <>
          <div onClick={this.toggle}>
            <RepBalance alternate larger rep={repBalanceFormatted.formatted} />
            <ChevronFlip
              stroke="#fff"
              filledInIcon
              quick
              pointDown={s.toggle}
            />
          </div>
          <div>
            <AllTimeProfitLoss
              repProfitAmountFormatted={repProfitAmountFormatted}
              repProfitLossPercentageFormatted={
                repProfitLossPercentageFormatted
              }
            />
            <PrimaryButton
              action={openGetRepModal}
              text={'Get REP'}
              id="get-rep"
            />
          </div>
          {!isLoggedIn && (
            <p>Connect a wallet to see your Available REP Balance</p>
          )}
          {isLoggedIn && hasStakedRep && (
            <>
              <div />
              <div>
                <span>{MY_TOTOL_REP_STAKED}</span>
                <SizableValueLabel
                  value={repTotalAmountStakedFormatted}
                  keyId={'rep-staked'}
                  showDenomination
                  showEmptyDash={false}
                  highlight
                  size={SizeTypes.LARGE}
                />
              </div>
              <div>
                <LinearPropertyLabel
                  key="Disputing"
                  label="Disputing"
                  value={disputingAmountFormatted}
                  showDenomination
                  useValueLabel
                />
                <LinearPropertyLabel
                  key="reporting"
                  label="Reporting"
                  value={reportingAmountFormatted}
                  showDenomination
                  useValueLabel
                />
                <LinearPropertyLabel
                  key="participation"
                  label="Participation Tokens"
                  value={participationAmountFormatted}
                  showDenomination
                  useValueLabel
                />
              </div>
            </>
          )}
        </>
      </div>
    );
  }
}

export interface ParticipationTokensViewProps {
  openModal: Function;
  disputeWindowFees: FormattedNumber;
  purchasedParticipationTokens: FormattedNumber;
  participationTokens: object;
  tokensOwned: FormattedNumber;
  percentageOfTotalFees: FormattedNumber;
}

export const ParticipationTokensView = (
  props: ParticipationTokensViewProps
) => {
  const {
    openModal,
    disputeWindowFees,
    purchasedParticipationTokens,
    tokensOwned,
    percentageOfTotalFees,
  } = props;

  return (
    <div className={Styles.ParticipationTokensView}>
      <h1>Participation Tokens</h1>
      <span>
        <span>Don’t see any reports that need disputing? </span>
        You can earn a proportional share of the profits from this dispute
        window.
        <span>Learn more</span>
      </span>

      <Subheaders
        large
        info
        header="Total Reporting Fees"
        subheader={disputeWindowFees.formatted}
        secondSubheader="DAI"
      />
      <Subheaders
        large
        info
        header="Total Participation Tokens Purchased"
        subheader={purchasedParticipationTokens.formatted}
      />
      <Subheaders
        info
        header="Participation Tokens I OWN in Current Dispute Window"
        subheader={tokensOwned.formatted}
        secondSubheader={`(${percentageOfTotalFees.formatted}% of Total Fees)`}
      />

      <PrimaryButton text="Get Participation Tokens" action={openModal} />

      <section />

      <h1>Redeem Past Participation Tokens</h1>
      <span>
        Redeem your past Participation Tokens and any returns from your share of
        the Reporting Fees. All tokens and fees that are ready to be claimed are
        shown below.
      </span>
      <Subheaders
        info
        header="Participation Tokens Purchased"
        subheader="0.0000"
      />
      <Subheaders
        info
        header="My Portion of Reporting Fees"
        subheader="0.0000"
        secondSubheader="DAI"
      />

      <PrimaryButton text="Redeem Past Participation Tokens" action={null} />
    </div>
  );
};
