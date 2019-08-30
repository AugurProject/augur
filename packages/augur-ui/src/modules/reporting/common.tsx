import React, { Component } from 'react';
import classNames from 'classnames';
import { calculatePosition } from "modules/market-cards/common";
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from "modules/common/constants";
import { FormattedNumber } from "modules/types";
import ReactTooltip from 'react-tooltip';
import { SecondaryButton, CancelTextButton, PrimaryButton } from "modules/common/buttons";
import { TextInput } from 'modules/common/form';
import { LinearPropertyLabel } from "modules/common/labels";
import { ButtonActionType } from 'modules/types';
import { formatRep } from "utils/format-number";

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
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={classNames(Styles.ReportingSubheaders, {[Styles.Small]: props.small})}>
    <span>{props.header}</span>
    <p>
      <span>{props.subheader}</span>
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




