import React, { Component } from 'react';
import classNames from 'classnames';
import { calculatePosition } from "modules/market-cards/common";
import { createBigNumber } from 'utils/create-big-number';
import { ZERO, MY_TOTOL_REP_STAKED, ALL_TIME_PROFIT_AND_LOSS_REP, REPORTING_STATE } from "modules/common/constants";
import { FormattedNumber, SizeTypes } from "modules/types";
import ReactTooltip from 'react-tooltip';
import { SecondaryButton, CancelTextButton, PrimaryButton } from "modules/common/buttons";
import { TextInput } from 'modules/common/form';
import { LinearPropertyLabel, SizableValueLabel, RepBalance, MovementLabel, InReportingLabel } from "modules/common/labels";
import { ButtonActionType } from 'modules/types';
import { formatRep } from "utils/format-number";
import MarketLink from "modules/market/components/market-link/market-link";
import { MarketProgress } from "modules/common/progress";
import { InfoIcon } from 'modules/common/icons';

import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/reporting/common.styles.less';

export interface ReportingPercentProps {
  firstPercent: FormattedNumber;
  secondPercent: FormattedNumber;
  thirdPercent: FormattedNumber;
  total: FormattedNumber;
}

export const ReportingPercent = (props: ReportingPercentProps) => {
	const firstPercent = calculatePosition(ZERO, createBigNumber(props.total.value), props.firstPercent);
	const secondPercent = calculatePosition(ZERO, createBigNumber(props.total.value), props.secondPercent);
	const thirdPercent = calculatePosition(ZERO, createBigNumber(props.total.value), props.thirdPercent);

	return (
	  <div className={Styles.ReportingPercent}>
	  	<span style={{width: `${firstPercent}%`}}/>
	  	<span
	  		style={{width: `${secondPercent}%`}}
	  		data-tip
          	data-for='tooltip--existingStake'
        />
        <ReactTooltip
          id='tooltip--existingStake'
          className={TooltipStyles.Tooltip}
          effect='solid'
          place='top'
          type='light'
        >
         	My Existing Stake
          	<p>{props.firstPercent.formattedValue} REP</p>
        </ReactTooltip>
	  	{thirdPercent > 0 && <span style={{width: `${thirdPercent}%`}}/>}
	  </div>
	);
}

export interface SubheadersProps {
  header: string;
  subheader: string;
  small?: boolean;
  info?: boolean;
  large?: boolean;
  secondSubheader?: string;
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={classNames(Styles.ReportingSubheaders, {[Styles.Small]: props.small, [Styles.Large]: props.large})}>
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
  <button className={Styles.ReportingModalButton} onClick={e => props.action(e)}>{props.text}</button>
);

interface PreFilledStakeProps {
  showInput: boolean;
  toggleInput: Function;
}

interface PreFilledStakeState {
  stake: string;
}

export class PreFilledStake extends Component<
  PreFilledStakeProps,
  PreFilledStakeState
> {
  state: PreFilledStakeState = {
    stake: "",
  };

  changeStake = (stake) => {
    this.setState({stake});
  }

  changeShowInput = () => {
    this.props.toggleInput();
  }

  render() {
    const s = this.state;

    return (
      <div className={Styles.PreFilledStake}>
        <span>
          add pre-filled stake?
        </span>
        <span>
          Pre-fund future dispute rounds to accelerate market resolution. Any contributed REP will automatically go toward disputing in favor of [insert outcome user is staking on], if it is no longer the tentative winning outcome in future rounds 
        </span>
        {!this.props.showInput && <SecondaryButton text="Add Pre-Filled Stake" action={this.changeShowInput} /> }
        {this.props.showInput &&
          <>
            <TextInput
              placeholder={"0.0000"}
              value={s.stake}
              onChange={(value) => this.changeStake(value)}
              errorMessage={null}
              innerLabel="REP"
            />
            <div>
              <CancelTextButton noIcon action={null} text={"MAX (REP THRESHOLD)"} />
              <CancelTextButton noIcon action={() => this.changeStake("")} text={"CLEAR"} />
            </div>
            <span>Review Pre-Filled Stake</span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total Rep"
              value={"0.0000 REP"}
            />
            <LinearPropertyLabel
              key="totalEstGas"
              label="Total Estimated Gas Fee"
              value={"0.0000 ETH"}
            />
          </>
        }
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
      <span>
        Make tentative winner
      </span>
      <span>
        {props.fullBond && props.fullBond.formatted}
        <span>
          / {props.stake && props.stake.bondSizeTotal.formatted} REP
        </span>
      </span>
    </div>
    <ReportingPercent firstPercent={props.stake.preFilledStake} secondPercent={props.stake.bondSizeCurrent} thirdPercent={formatRep(props.inputtedStake)} total={props.stake.bondSizeTotal} />
  </div>
);

export interface ScalarOutcomeViewProps {
  rangeValue: string;
  changeRange: Function;
  scalarDenomination: string;
}

export const ScalarOutcomeView = (props: ScalarOutcomeViewProps) => (
  <div className={Styles.ScalarOutcomesView}>
    <TextInput
      placeholder={"Enter a number"}
      value={props.rangeValue}
      onChange={(value) => props.changeRange(value)}
      errorMessage={null}
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
}

export const DisputingBondsView = (props: DisputingBondsViewProps) => (
  <div className={classNames(Styles.DisputingBondsView, {[Styles.Scalar]: props.scalar})}>
    {props.scalar &&
      <ScalarOutcomeView
        rangeValue={props.rangeValue}
        changeRange={props.changeRange}
        scalarDenomination={props.scalarDenomination}
      />
    }
    <TextInput
      placeholder={"0.0000"}
      value={props.stakeValue}
      onChange={(value) => props.changeStake(value)}
      errorMessage={null}
      innerLabel="REP"
    />
    <section>
      <CancelTextButton noIcon action={null} text={"MIN"}/>
      |
      <CancelTextButton noIcon action={null} text={"FILL DISPUTE BOND"}/>
    </section>
    <span>Review</span>
    <LinearPropertyLabel
      key="disputeRoundStake"
      label="Dispute Round Stake"
      value={"0.0000 REP"}
    />
    <LinearPropertyLabel
      key="estimatedGasFee"
      label="Estimated Gas Fee"
      value={"0.0000 ETH"}
    />
    <PrimaryButton text='Confirm' action={null} />
  </div>
);

export interface ReportingBondsViewProps {
  scalar?: boolean;
  rangeValue: string;
  changeRange: Function;
  scalarDenomination: string;
}

interface ReportingBondsViewState {
  showInput: boolean;
}

export class ReportingBondsView extends Component<
  ReportingBondsViewProps,
  ReportingBondsViewState
> {
  state: ReportingBondsViewState = {
    showInput: false,
  };

  toggleInput = () => {
    this.setState({showInput: !this.state.showInput});
  }

  render() {
    const {
      scalar,
      rangeValue,
      changeRange,
      scalarDenomination
    } = this.props;

    const s = this.state;

    return (
      <div className={classNames(Styles.ReportingBondsView, {[Styles.Scalar]: scalar})}>
        {scalar &&
          <ScalarOutcomeView
            rangeValue={rangeValue}
            changeRange={changeRange}
            scalarDenomination={scalarDenomination}
          />
        }
        <span>Review Initial Reporting Stake</span>
        <LinearPropertyLabel
          key="initial"
          label="initial reporter stake"
          value={"0.0000 REP"}
        />
        <LinearPropertyLabel
          key="estimatedGasFee"
          label="Estimated Gas Fee"
          value={"0.0000 ETH"}
        />
        <PreFilledStake showInput={s.showInput} toggleInput={this.toggleInput} />
        {s.showInput &&
          <div>
            <span>Totals</span>
            <span>Sum total of Dispute Stake and Pre-Filled Stake</span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total rep"
              value={"0.0000 REP"}
            />
            <LinearPropertyLabel
              key="totalEstimatedGasFee"
              label="Total Estimated Gas Fee"
              value={"0.0000 ETH"}
            />
          </div>
        }
        <PrimaryButton text='Confirm' action={null} />
      </div>
    );
  }
}

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
}

export interface ReportingCardProps {
  market: MarketData;
  currentAugurTimestamp: number;
  reportingWindowStatsEndTime: number;
  showReportingModal: Function;
}

export const ReportingCard = (props: ReportingCardProps) => {
  const {
    market, 
    currentAugurTimestamp,
    reportingWindowStatsEndTime,
    showReportingModal 
  } = props;

  if (!market) return null;

  const {
    id,
    description,
    marketStatus,
    reportingState,
    disputeInfo,
    endTimeFormatted
  } = market;

  const preReporting = reportingState === REPORTING_STATE.PRE_REPORTING;

  return (
    <div className={Styles.ReportingCard}>
      <div>
        <InReportingLabel
          marketStatus={marketStatus}
          reportingState={reportingState}
          disputeInfo={disputeInfo}
          endTimeFormatted={endTimeFormatted}
          currentAugurTimestamp={currentAugurTimestamp}
          reportingWindowStatsEndTime={reportingWindowStatsEndTime}
        />
        <MarketLink id={id}>
          {description}
        </MarketLink>
        {reportingState !== REPORTING_STATE.OPEN_REPORTING &&
          <MarketProgress
            reportingState={reportingState}
            currentTime={currentAugurTimestamp}
            endTimeFormatted={endTimeFormatted}
            reportingWindowEndtime={reportingWindowStatsEndTime}
          />
        }
      </div>
      <div data-tip data-for='tooltip--preReporting'>
        <PrimaryButton text="Report" action={showReportingModal} disabled={preReporting} />
        {preReporting &&
          <ReactTooltip
            id='tooltip--preReporting'
            className={TooltipStyles.Tooltip}
            effect='solid'
            place='top'
            type='light'
          >
            <p>Please wait until the Maket is ready to Report on</p>
          </ReactTooltip>
        }
      </div>
    </div>
  );
}

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

export const UserRepDisplay = (props: UserRepDisplayProps) => (
  <div
    className={classNames(Styles.UserRepDisplay, {
      [Styles.loggedOut]: props.isLoggedIn,
    })}
  >
    <>
      <RepBalance alternate larger rep={props.repBalanceFormatted.formatted} />
      <div>
        <AllTimeProfitLoss
          repProfitAmountFormatted={props.repProfitAmountFormatted}
          repProfitLossPercentageFormatted={props.repProfitLossPercentageFormatted}
        />
        <PrimaryButton
          action={props.openGetRepModal}
          text={'Get REP'}
          id="get-rep"
        />
      </div>
      <div />
      <div>
        <span>{MY_TOTOL_REP_STAKED}</span>
        <SizableValueLabel
          value={props.repTotalAmountStakedFormatted}
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
          value={props.disputingAmountFormatted}
          showDenomination
          useValueLabel
        />
        <LinearPropertyLabel
          key="reporting"
          label="Reporting"
          value={props.reportingAmountFormatted}
          showDenomination
          useValueLabel
        />
        <LinearPropertyLabel
          key="participation"
          label="Participation Tokens"
          value={props.participationAmountFormatted}
          showDenomination
          useValueLabel
        />
      </div>
    </>
  </div>
);


export interface ParticipationTokensViewProps {
}

export const ParticipationTokensView = (props: ParticipationTokensViewProps) => {

  return (
    <div className={Styles.ParticipationTokensView}>
      <h1>Participation Tokens</h1>
      <span>
        <span>Don’t see any reports that need disputing? </span> 
        You can earn a proportional share of the  profits from this dispute window. 
        <span>Learn more</span>
      </span>
      
      <Subheaders large info header='Total Reporting Fees' subheader='0.0000' secondSubheader='DAI' />
      <Subheaders large info header='Total Participation Tokens Purchased' subheader='0.0000' />
      <Subheaders info header='Participation Tokens I OWN in Current Dispute Window' subheader='0.0000' secondSubheader='(3.0724% of Total Fees)' />

      <PrimaryButton text='Get Participation Tokens' action={null} />

      <section />
      
      <h1>Redeem Past Participation Tokens</h1>
      <span>Redeem your past Participation Tokens and any returns from your share of the Reporting Fees. All tokens and fees that are ready to be claimed are shown below.</span>
      <Subheaders info header='Participation Tokens Purchased' subheader='0.0000' />
      <Subheaders info header='My Portion of Reporting Fees' subheader='0.0000'  secondSubheader='DAI' />
      
      <PrimaryButton text='Redeem Past Participation Tokens' action={null} />
    </div>
  );
}
