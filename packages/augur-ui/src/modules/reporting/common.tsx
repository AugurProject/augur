import React, { Component } from 'react';
import classNames from 'classnames';
import { calculatePosition } from 'modules/market-cards/common';
import { createBigNumber } from 'utils/create-big-number';
import {
  ZERO,
  MY_TOTOL_REP_STAKED,
  ALL_TIME_PROFIT_AND_LOSS_REP,
  REPORTING_STATE,
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
import { formatRep } from 'utils/format-number';
import MarketLink from 'modules/market/components/market-link/market-link';
import { MarketProgress } from 'modules/common/progress';
import { InfoIcon } from 'modules/common/icons';
import ChevronFlip from 'modules/common/chevron-flip';

import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/reporting/common.styles.less';

export interface ReportingPercentProps {
  firstPercent: FormattedNumber;
  secondPercent: FormattedNumber;
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
    props.secondPercent
  );
  const thirdPercent = calculatePosition(
    ZERO,
    createBigNumber(props.total.value),
    props.thirdPercent
  );

  return (
    <div className={classNames(Styles.ReportingPercent, {[Styles.Round]: firstPercent === 0 && secondPercent === 0, [Styles.RoundSecond]: firstPercent === 0})}>
      <span style={{ width: `${firstPercent > 100 ? 100 : firstPercent}%` }} />
      <span
        style={{ width: `${secondPercent > 100 ? 100 : secondPercent}%` }}
        data-tip
        data-for="tooltip--existingStake"
      />
      <ReactTooltip
        id="tooltip--existingStake"
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
      >
        My Existing Stake
        <p>{props.firstPercent.formattedValue} REP</p>
      </ReactTooltip>
      {thirdPercent > 100 ? 100 : thirdPercent > 0 && <span style={{ width: `${thirdPercent}%` }} />}
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
  changeStake = stake => {
    this.props.updatePreFilledStake(stake);
  };

  changeShowInput = () => {
    this.props.toggleInput();
  };

  render() {
    const s = this.state;

    const {
      preFilledStake,
      stakeError,
      threshold
    } = this.props;

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
              onChange={value => this.changeStake(value)}
              errorMessage={stakeError}
              innerLabel="REP"
            />
            <div>
              <CancelTextButton
                noIcon
                action={() => this.changeStake(threshold.toString())}
                text={'MAX (REP THRESHOLD)'}
              />
              <CancelTextButton
                noIcon
                action={() => this.changeStake('')}
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
  stake: string;
  inputtedStake: number;
}

export const DisputingButtonView = (props: DisputingButtonViewProps) => (
  <div className={Styles.DisputingButtonView}>
    <div>
      <span>Make tentative winner</span>
      <span>
        {props.fullBond && props.fullBond.formatted}
        <span>/ {props.stake && props.stake.bondSizeTotal.formatted} REP</span>
      </span>
    </div>
    <ReportingPercent
      firstPercent={props.stake.preFilledStake}
      secondPercent={props.stake.stakeCurrent}
      thirdPercent={formatRep(props.inputtedStake)}
      total={props.stake.bondSizeTotal}
    />
  </div>
);

export interface ScalarOutcomeViewProps {
  rangeValue: string;
  changeRange: Function;
  scalarDenomination: string;
  scalarError?: string;
}

export const ScalarOutcomeView = (props: ScalarOutcomeViewProps) => (
  <div className={Styles.ScalarOutcomesView}>
    <TextInput
      placeholder={'Enter a number'}
      value={props.rangeValue}
      onChange={value => props.changeRange(value)}
      errorMessage={props.scalarError}
    />
    <h2>{props.scalarDenomination}</h2>
  </div>
);

export interface DisputingBondsViewProps {
  scalar?: boolean;
  rangeValue: string;
  changeRange: Function;
  scalarDenomination: string;
  stakeValue: string;
  changeStake: Function;
  updateScalarOutcome?: Function;
  scalarOutcome?: string;
  minPrice?: string;
  maxPrice?: string;
  userAvailableRep: number;
  stakeRemaining?: number;
  tentativeWinning?: boolean;
  reportAction: Function;
}

interface DisputingBondsViewState {
  disabled: boolean;
  scalarError: string;
  stakeError: string;
}

export class DisputingBondsView extends Component<
DisputingBondsViewProps,
  DisputingBondsViewState
> {
  state: DisputingBondsViewState = {
    disabled: true,
    scalarError: "",
    stakeError: "",
  };

  changeRange = (range: string) => {
    const {
      minPrice,
      maxPrice,
      changeRange,
      stakeValue
    } = this.props;

    if (createBigNumber(range).lt(createBigNumber(minPrice)) || createBigNumber(range).gt(createBigNumber(maxPrice))) {
      this.setState({scalarError: "Input value not between scalar market range", disabled: true});
    } else if (isNaN(range) || range === "") {
      this.setState({scalarError: "Enter a valid number", disabled: true});
    } else {
      this.setState({scalarError: ""});
      if (this.state.stakeError === "" && stakeValue !== "") {
        this.setState({disabled: false});
      }
    }
    changeRange(range);
  }

  changeStake = (stake: string) => {
    const {
      changeStake,
      scalar,
      rangeValue,
      userAvailableRep,
      stakeRemaining,
      tentativeWinning,
    } = this.props;

    if (isNaN(stake) || stake === "") {
      this.setState({stakeError: "Enter a valid number", disabled: true});
    } else if (createBigNumber(userAvailableRep).lt(createBigNumber(stake))) {
      this.setState({stakeError: "Value is bigger than REP balance", disabled: true});
    } else if (!tentativeWinning && stakeRemaining && createBigNumber(stakeRemaining).lt(createBigNumber(stake))) {
      this.setState({stakeError: "Value is bigger than needed stake", disabled: true});
    } else {
      this.setState({stakeError: ""});
      if (this.state.scalarError === "" && ((scalar && rangeValue !== "") || !scalar)) {
        this.setState({disabled: false});
      }
    }
    changeStake(stake);
  }

  render() {
    const {
      scalar,
      rangeValue,
      scalarDenomination,
      stakeValue,
      userAvailableRep,
      stakeRemaining,
      tentativeWinning,
      reportAction
    } = this.props;

    const { disabled, scalarError, stakeError } = this.state;

    return (
      <div
        className={classNames(Styles.DisputingBondsView, {
          [Styles.Scalar]: scalar,
        })}
      >
        {scalar && (
          <ScalarOutcomeView
            rangeValue={rangeValue}
            changeRange={this.changeRange}
            scalarDenomination={scalarDenomination}
            scalarError={scalarError}
          />
        )}
        <TextInput
          placeholder={'0.0000'}
          value={stakeValue}
          onChange={value => this.changeStake(value)}
          errorMessage={stakeError}
          innerLabel="REP"
        />
        {!tentativeWinning &&
          <section>
            <CancelTextButton noIcon action={() => this.changeStake(stakeRemaining.toString())} text={'MIN'} />
            |
            <CancelTextButton noIcon action={() => this.changeStake(stakeRemaining.toString())} text={'FILL DISPUTE BOND'} />
          </section>
        }
        <span>Review</span>
        <LinearPropertyLabel
          key="disputeRoundStake"
          label="Dispute Round Stake"
          value={formatRep(stakeValue).formatted + ' REP'}
        />
        <LinearPropertyLabel
          key="estimatedGasFee"
          label="Estimated Gas Fee"
          value={'0.0000 ETH'}
        />
        <PrimaryButton text="Confirm" action={reportAction} disabled={disabled} />
      </div>
    );
  }
}

export interface ReportingBondsViewProps {
  scalar?: boolean;
  rangeValue: string;
  changeRange: Function;
  scalarDenomination: string;
  initialReporterStake: FormattedNumber;
  reportingGasFee: FormattedNumber;
  reportAction: Function;
  preFilledStake?: string;
  updatePreFilledStake?: Function;
  updateScalarOutcome?: Function;
  scalarOutcome?: string;
  minPrice?: string;
  maxPrice?: string;
  userAvailableRep: number;
}

interface ReportingBondsViewState {
  showInput: boolean;
  disabled: boolean;
  scalarError: string;
  stakeError: string;
}

export class ReportingBondsView extends Component<
  ReportingBondsViewProps,
  ReportingBondsViewState
> {
  state: ReportingBondsViewState = {
    showInput: false,
    disabled: this.props.scalar ? true : false,
    scalarError: "",
    stakeError: "",
  };

  toggleInput = () => {
    this.setState({ showInput: !this.state.showInput });
  }

  changeRange = (range: string) => {
    const {
      minPrice,
      maxPrice,
      changeRange
    } = this.props;

    if (createBigNumber(range).lt(createBigNumber(minPrice)) || createBigNumber(range).gt(createBigNumber(maxPrice))) {
      this.setState({scalarError: "Input value not between scalar market range", disabled: true});
    } else if (isNaN(range) || range === "") {
      this.setState({scalarError: "Enter a valid number", disabled: true});
    } else {
      this.setState({scalarError: ""});
      if (this.state.stakeError === "") {
        this.setState({disabled: false});
      }
    }
    changeRange(range);
  }

  updatePreFilledStake = (stake: string) => {
    const {
      updatePreFilledStake,
      scalar,
      rangeValue,
      userAvailableRep
    } = this.props;

    if (isNaN(stake)) {
      this.setState({stakeError: "Enter a valid number", disabled: true});
    } else if (createBigNumber(userAvailableRep).lt(createBigNumber(stake))) {
      this.setState({stakeError: "Value is bigger than REP balance", disabled: true});
    } else {
      this.setState({stakeError: ""});
      if (this.state.scalarError === "" && ((scalar && rangeValue !== "") || !scalar)) {
        this.setState({disabled: false});
      }
    }
    updatePreFilledStake(stake);
  }

  render() {
    const {
      scalar,
      rangeValue,
      changeRange,
      scalarDenomination,
      initialReporterStake,
      reportingGasFee,
      reportAction,
      preFilledStake,
      updatePreFilledStake,
      userAvailableRep,
    } = this.props;

    const { showInput, disabled, scalarError, stakeError } = this.state;

    const preFilled = formatRep(preFilledStake || '0');

    return (
      <div
        className={classNames(Styles.ReportingBondsView, {
          [Styles.Scalar]: scalar,
        })}
      >
        {scalar && (
          <ScalarOutcomeView
            rangeValue={rangeValue}
            changeRange={this.changeRange}
            scalarDenomination={scalarDenomination}
            scalarError={scalarError}
          />
        )}
        <span>Review Initial Reporting Stake</span>
        <LinearPropertyLabel
          key="initial"
          label="initial reporter stake"
          value={initialReporterStake}
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
            <span>Sum total of Initial Reporter Stake and Pre-Filled Stake</span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total rep"
              value={formatRep(createBigNumber(preFilled).plus(createBigNumber(initialReporterStake))).formatted}
            />
            <LinearPropertyLabel
              key="totalEstimatedGasFee"
              label="Total Estimated Gas Fee"
              value={reportingGasFee}
            />
          </div>
        )}
        <PrimaryButton text="Confirm" disabled={disabled} action={ () => reportAction()} />

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
    disputingWindowEndTime,
    showReportingModal,
    isLogged,
  } = props;

  if (!market) return null;

  const {
    id,
    description,
    marketStatus,
    reportingState,
    disputeInfo,
    endTimeFormatted,
  } = market;

  const preReporting = reportingState === REPORTING_STATE.PRE_REPORTING;

  return (
    <div className={Styles.ReportingCard}>
      <InReportingLabel
        marketStatus={marketStatus}
        reportingState={reportingState}
        disputeInfo={disputeInfo}
        endTimeFormatted={endTimeFormatted}
        currentAugurTimestamp={currentAugurTimestamp}
        disputingWindowEndTime={disputingWindowEndTime}
      />
      <MarketLink id={id}>{description}</MarketLink>
      {reportingState !== REPORTING_STATE.OPEN_REPORTING && (
        <MarketProgress
          reportingState={reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndtime={disputingWindowEndTime}
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
  disputeWindow: string;
  participationTokens: object;
  tokensOwned: FormattedNumber;
}

export const ParticipationTokensView = (
  props: ParticipationTokensViewProps
) => {
  const {
    openModal,
    disputeWindowFees,
    purchasedParticipationTokens,
    tokensOwned,
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
        secondSubheader="(3.0724% of Total Fees)"
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
