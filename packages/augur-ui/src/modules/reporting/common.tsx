import React, { Component } from 'react';
import classNames from 'classnames';
import { calculatePosition } from "modules/market-cards/common";
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from "modules/common/constants";
import { FormattedNumber } from "modules/types";
import ReactTooltip from 'react-tooltip';
import { SecondaryButton, CancelTextButton } from "modules/common/buttons";
import { TextInput } from 'modules/common/form';
import { LinearPropertyLabel } from "modules/common/labels";
import { ButtonActionType } from 'modules/types';

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
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={Styles.ReportingSubheaders}>
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

interface PreFilledStakeProps {}

interface PreFilledStakeState {
  showInput: boolean;
  stake: string;
}

export class PreFilledStake extends Component<
  PreFilledStakeProps,
  PreFilledStakeState
> {
  state: PreFilledStakeState = {
    showInput: false,
    stake: "",
  };

  changeStake = (stake) => {
    this.setState({stake});
  }

  changeShowInput = () => {
    this.setState({showInput: !this.state.showInput});
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
        {!s.showInput && <SecondaryButton text="Add Pre-Filled Stake" action={this.changeShowInput} /> }
        {s.showInput && 
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

