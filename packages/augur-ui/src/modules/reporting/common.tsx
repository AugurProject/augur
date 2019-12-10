import React, { Component, useState } from 'react';
import classNames from 'classnames';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import {
  ZERO,
  MY_TOTOL_REP_STAKED,
  ALL_TIME_PROFIT_AND_LOSS_REP,
  REPORTING_STATE,
  SCALAR,
  DISPUTE_GAS_COST,
  INITAL_REPORT_GAS_COST,
} from 'modules/common/constants';
import {
  FormattedNumber,
  SizeTypes,
  MarketData,
  DisputeInputtedValues,
} from 'modules/types';
import ReactTooltip from 'react-tooltip';
import {
  SecondaryButton,
  CancelTextButton,
  PrimaryButton,
} from 'modules/common/buttons';
import { Checkbox, TextInput } from 'modules/common/form';
import {
  LinearPropertyLabel,
  SizableValueLabel,
  RepBalance,
  MovementLabel,
  InReportingLabel,
} from 'modules/common/labels';
import { ButtonActionType } from 'modules/types';
import { formatRep, formatAttoRep, formatGasCostToEther } from 'utils/format-number';
import { MarketProgress } from 'modules/common/progress';
import { ExclamationCircle, InfoIcon, XIcon } from 'modules/common/icons';
import ChevronFlip from 'modules/common/chevron-flip';

import TooltipStyles from 'modules/common/tooltip.styles.less';
import ButtonStyles from 'modules/common/buttons.styles.less';
import Styles from 'modules/reporting/common.styles.less';
import {
  convertDisplayValuetoAttoValue,
  convertAttoValueToDisplayValue,
} from '@augurproject/sdk';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';
import { getRepThresholdForPacing } from 'modules/contracts/actions/contractCalls';
import MarketTitle from 'modules/market/containers/market-title';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';

export enum DISMISSABLE_NOTICE_BUTTON_TYPES {
  BUTTON = 'PrimaryButton',
  CLOSE = 'close',
  NONE = 'none',
}

export interface DismissableNoticeProps {
  title: string;
  description?: string;
  buttonType: DISMISSABLE_NOTICE_BUTTON_TYPES;
  buttonText?: string;
  buttonAction?: Function;
  className?: string;
  show: boolean;
}

export const DismissableNotice = (props: DismissableNoticeProps) => {
  const [show, setShow] = useState(props.show);

  return (
    <>
      {show ? (
        <div className={classNames(Styles.DismissableNotice, props.className)}>
          <span>{ExclamationCircle}</span>
          <div>
            <div>{props.title}</div>
            {props.description && <div>{props.description}</div>}
          </div>
          {props.buttonType === DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON && (
            <button
              type="button"
              className={ButtonStyles.PrimaryButton}
              onClick={props.buttonAction}
            >
              {props.buttonText}
            </button>
          )}
          {props.buttonType === DISMISSABLE_NOTICE_BUTTON_TYPES.CLOSE && (
            <button
              type="button"
              className={Styles.close}
              onClick={() => setShow(() => false)}
            >
              {XIcon}
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};

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

  const key = `tooltip-${props.userValue.formattedValue}-existingStake`;
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
  tooltipText?: string;
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
      {props.info && (
        <>
          <label data-tip data-for={'tooltip--' + props.header}>
            {InfoIcon}
          </label>
          <ReactTooltip
            id={'tooltip--' + props.header}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
          >
            <p>{props.tooltipText}</p>
          </ReactTooltip>
        </>
      )}
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
  updateInputtedStake: Function;
  stakeError?: string;
  threshold: string;
}

export class PreFilledStake extends Component<PreFilledStakeProps, {}> {
  changeShowInput = () => {
    this.props.toggleInput();
  };

  render() {
    const {
      preFilledStake,
      stakeError,
      threshold,
      updateInputtedStake,
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
            <InputRepStake
              stakeAmount={preFilledStake}
              updateStakeAmount={updateInputtedStake}
              stakeError={stakeError}
              max={threshold}
              maxLabel="MAX (REP THRESHOLD)"
            />
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
interface InputRepStakeProps {
  stakeAmount?: string;
  updateStakeAmount: Function;
  stakeError?: string;
  max: string;
  maxLabel: string;
}

export const InputRepStake = (props: InputRepStakeProps) => {
  return (
    <div className={Styles.InputRepStake}>
      <TextInput
        placeholder={'0.0000'}
        value={props.stakeAmount}
        onChange={value => props.updateStakeAmount(value)}
        errorMessage={props.stakeError}
        innerLabel="REP"
      />
      <div>
        <CancelTextButton
          noIcon
          action={() => props.updateStakeAmount(props.max)}
          text={props.maxLabel}
        />
        <CancelTextButton
          noIcon
          action={() => props.updateStakeAmount('')}
          text={'CLEAR'}
        />
      </div>
    </div>
  );
};
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
  updateInputtedStake: Function;
  userAvailableRep: number;
  stakeRemaining?: string;
  tentativeWinning?: boolean;
  reportAction: Function;
  Gnosis_ENABLED: boolean;
  gasPrice: number;
  ethToDaiRate: BigNumber;
}

interface DisputingBondsViewState {
  disabled: boolean;
  scalarError: string;
  stakeError: string;
  isScalar: boolean;
  gasEstimate: string;
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
    gasEstimate: formatGasCostToEther(
      DISPUTE_GAS_COST,
      { decimalsRounded: 4 },
      this.props.gasPrice,
    ),
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

  updateInputtedStake = (inputStakeValue: string) => {
    const {
      market,
      updateInputtedStake,
      inputScalarOutcome,
      userAvailableRep,
      stakeRemaining,
      tentativeWinning,
      isInvalid,
    } = this.props;
    let inputToAttoRep = null;
    const { isScalar } = this.state;
    const min = formatAttoRep(market.noShowBondAmount).value;
    const remaining = formatAttoRep(stakeRemaining).value;
    if (!isNaN(Number(inputStakeValue))) {
      inputToAttoRep = convertDisplayValuetoAttoValue(
        createBigNumber(inputStakeValue)
      );
    }
    if (
      isNaN(Number(inputStakeValue)) ||
      inputStakeValue === '' ||
      inputStakeValue === '0' ||
      inputStakeValue === '.' ||
      inputStakeValue === '0.'
    ) {
      this.setState({ stakeError: 'Enter a valid number', disabled: true });
      return updateInputtedStake({ inputStakeValue, inputToAttoRep });
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
        (this.state.scalarError === '' &&
          ((isScalar && inputScalarOutcome !== '') || isInvalid)) ||
        !isScalar
      ) {
        this.setState({ disabled: false });
      }
    }
    updateInputtedStake({ inputStakeValue, inputToAttoRep });
  };

  async componentDidMount() {
    if (this.props.Gnosis_ENABLED) {
      const gasLimit = await this.props.reportAction(true);
      this.setState({
        gasEstimate: formatGasCostToEther(
          gasLimit,
          { decimalsRounded: 4 },
          this.props.gasPrice,
        ),
      });
    }
  }

  render() {
    const {
      market,
      inputScalarOutcome,
      stakeValue,
      stakeRemaining,
      tentativeWinning,
      reportAction,
      id,
      Gnosis_ENABLED,
      ethToDaiRate,
    } = this.props;

    const { disabled, scalarError, stakeError, isScalar, gasEstimate } = this.state;
    const min = convertAttoValueToDisplayValue(
      createBigNumber(market.noShowBondAmount)
    );
    const remaining = convertAttoValueToDisplayValue(
      createBigNumber(stakeRemaining)
    );
    // id === "null" means blank scalar, user can input new scalar value to dispute
    return (
      <div className={classNames(Styles.DisputingBondsView)}>
        {isScalar && id === 'null' && (
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
          onChange={value => this.updateInputtedStake(value)}
          errorMessage={stakeError}
          innerLabel="REP"
        />
        {!tentativeWinning && (
          <section>
            <CancelTextButton
              noIcon
              action={() => this.updateInputtedStake(String(min))}
              text={'MIN'}
            />
            |
            <CancelTextButton
              noIcon
              action={() => this.updateInputtedStake(String(remaining))}
              text={'FILL DISPUTE BOND'}
            />
          </section>
        )}
        <span>Review</span>
        <LinearPropertyLabel
          key="disputeRoundStake"
          label={
            tentativeWinning
              ? 'Contribute to Next Round'
              : 'Dispute Round Stake'
          }
          value={formatRep(stakeValue || ZERO).formatted + ' REP'}
        />
        <LinearPropertyLabel
          key="estimatedGasFee"
          label={Gnosis_ENABLED ? "Transaction Fee" : "Gas Fee"}
          value={Gnosis_ENABLED ? displayGasInDai(gasEstimate, ethToDaiRate) : gasEstimate}
        />
        <PrimaryButton
          text="Confirm"
          action={() => reportAction(false)}
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
  reportAction: Function;
  Gnosis_ENABLED: boolean;
  gasPrice: number;
  ethToDaiRate: BigNumber;
  inputtedReportingStake: DisputeInputtedValues;
  updateInputtedStake?: Function;
  inputScalarOutcome?: string;
  initialReport: boolean;
  migrateMarket: boolean;
  migrateRep: boolean;
  userAttoRep: BigNumber;
  owesRep: boolean;
}

interface ReportingBondsViewState {
  showInput: boolean;
  disabled: boolean;
  scalarError: string;
  stakeError: string;
  isScalar: boolean;
  threshold: string;
  readAndAgreedCheckbox: boolean;
  gasEstimate: string;
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
    threshold: this.props.userAttoRep.toString(),
    readAndAgreedCheckbox: false,
    gasEstimate: formatGasCostToEther(
      INITAL_REPORT_GAS_COST,
      { decimalsRounded: 4 },
      this.props.gasPrice,
    ),
  };

  async componentDidMount() {
    if (this.props.initialReport) {
      const threshold = await getRepThresholdForPacing();
      this.setState({
        threshold: String(convertAttoValueToDisplayValue(threshold)),
      });

      if (this.props.Gnosis_ENABLED) {
        const gasLimit = await this.props.reportAction(true);
        this.setState({
          gasEstimate: formatGasCostToEther(
            gasLimit,
            { decimalsRounded: 4 },
            this.props.gasPrice,
          )

        });
      }
    }
  }

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

  updateInputtedStake = (inputStakeValue: string) => {
    const { updateInputtedStake, inputScalarOutcome, userAttoRep } = this.props;
    const { isScalar } = this.state;

    if (isNaN(Number(inputStakeValue))) {
      this.setState({ stakeError: 'Enter a valid number', disabled: true });
    } else if (
      createBigNumber(userAttoRep).lt(createBigNumber(inputStakeValue))
    ) {
      this.setState({
        stakeError: 'Value is bigger than user REP balance',
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
    let inputToAttoRep = '0';
    if (!isNaN(Number(inputStakeValue)) && inputStakeValue !== '') {
      inputToAttoRep = String(
        convertDisplayValuetoAttoValue(createBigNumber(inputStakeValue))
      );
    }
    updateInputtedStake({ inputToAttoRep, inputStakeValue });
  };

  checkCheckbox = (readAndAgreedCheckbox: boolean) => {
    this.setState({ readAndAgreedCheckbox });
  };

  render() {
    const {
      market,
      inputScalarOutcome,
      reportAction,
      inputtedReportingStake,
      userAttoRep,
      id,
      migrateRep,
      initialReport,
      owesRep,
      Gnosis_ENABLED,
      ethToDaiRate,
    } = this.props;

    const {
      showInput,
      disabled,
      scalarError,
      stakeError,
      isScalar,
      threshold,
      readAndAgreedCheckbox,
      gasEstimate,
    } = this.state;

    const repAmount = migrateRep
      ? formatAttoRep(inputtedReportingStake.inputToAttoRep).formatted
      : formatAttoRep(market.noShowBondAmount).formatted;
    let repLabel = migrateRep
      ? 'REP to migrate'
      : 'open reporter winning Stake';
    if (owesRep) {
      repLabel = 'REP needed';
    }
    const totalRep = owesRep
      ? formatAttoRep(
          createBigNumber(inputtedReportingStake.inputToAttoRep).plus(
            market.noShowBondAmount
          )
        ).formatted
      : formatAttoRep(createBigNumber(inputtedReportingStake.inputToAttoRep))
          .formatted;
    // id === "null" means blank scalar, user can input new scalar value to dispute
    return (
      <div
        className={classNames(Styles.ReportingBondsView, {
          [Styles.Scalar]: isScalar,
          [Styles.InitialReport]: initialReport,
          [Styles.MigrateRep]: migrateRep,
        })}
      >
        {isScalar && id === 'null' && (
          <ScalarOutcomeView
            inputScalarOutcome={inputScalarOutcome}
            updateScalarOutcome={this.updateScalarOutcome}
            scalarDenomination={market.scalarDenomination}
            scalarError={scalarError}
          />
        )}
        {migrateRep && (
          <InputRepStake
            stakeAmount={String(inputtedReportingStake.inputStakeValue)}
            updateStakeAmount={this.updateInputtedStake}
            stakeError={stakeError}
            max={String(userAttoRep)}
            maxLabel="MAX"
          />
        )}
        <span>Review</span>
        <LinearPropertyLabel
          key="initial"
          label={repLabel}
          value={`${repAmount} REP`}
        />
        <LinearPropertyLabel
          key="totalEstimatedGasFee"
          label={Gnosis_ENABLED ? "Transaction Fee" : "Gas Fee"}
          value={Gnosis_ENABLED ? displayGasInDai(gasEstimate, ethToDaiRate) : gasEstimate}
        />
        {initialReport && (
          <PreFilledStake
            showInput={showInput}
            toggleInput={this.toggleInput}
            updateInputtedStake={this.updateInputtedStake}
            preFilledStake={inputtedReportingStake.inputStakeValue}
            stakeError={stakeError}
            threshold={threshold}
          />
        )}
        {showInput && (
          <div>
            <span>Totals</span>
            <span>Sum total of Pre-Filled Stake</span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total rep"
              value={totalRep}
            />
          </div>
        )}
        {migrateRep &&
          createBigNumber(inputtedReportingStake.inputStakeValue).lt(
            userAttoRep
          ) && (
            <DismissableNotice
              show={true}
              description=""
              title="Are you sure you only want to migrate a portion of your REP to this universe?
            If not, go back and select the ‘Max’ button to migrate your full REP amount."
              buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
            />
          )}
        {migrateRep && (
          <div
            className={Styles.ReportingBondsViewCheckbox}
            role="button"
            tabIndex={0}
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              this.checkCheckbox(!readAndAgreedCheckbox);
            }}
          >
            <label htmlFor="migrate-rep-confirmation">
              <Checkbox
                id="migrate-rep-confirmation"
                isChecked={readAndAgreedCheckbox}
                onClick={() => this.checkCheckbox(!readAndAgreedCheckbox)}
                disabled={false}
              />
              I have carefully read all the information and fully acknowledge
              the consequences of migrating my REP to an unsuccessful universe
            </label>
          </div>
        )}
        <PrimaryButton
          text={migrateRep ? 'Confirm and Migrate REP' : 'Confirm'}
          disabled={migrateRep ? disabled || !readAndAgreedCheckbox : disabled}
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
  const { market, currentAugurTimestamp, showReportingModal, isLogged } = props;

  if (!market) return null;

  const { id, reportingState, disputeInfo, endTimeFormatted } = market;

  const preReporting = reportingState === REPORTING_STATE.PRE_REPORTING;

  return (
    <div className={Styles.ReportingCard}>
      <InReportingLabel
        reportingState={reportingState}
        disputeInfo={disputeInfo}
        endTimeFormatted={endTimeFormatted}
        currentAugurTimestamp={currentAugurTimestamp}
      />
      <MarketTitle id={id} />
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
  tokensOwned: FormattedNumber;
  percentageOfTotalFees: FormattedNumber;
  pastParticipationTokensPurchased: FormattedNumber;
  participationTokensClaimableFees: FormattedNumber;
  disablePurchaseButton: boolean;
  hasRedeemable: boolean;
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
    pastParticipationTokensPurchased,
    participationTokensClaimableFees,
    disablePurchaseButton,
    hasRedeemable,
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
        tooltipText='The total amount to be paid to reporters'
      />
      <Subheaders
        large
        info
        header="Total Participation Tokens Purchased"
        subheader={purchasedParticipationTokens.formatted}
        tooltipText={'The total amount of participation tokens purchased by reporters in the current window'}
      />
      <Subheaders
        info
        header="Participation Tokens I OWN in Current Dispute Window"
        subheader={tokensOwned.formatted}
        secondSubheader={`(${percentageOfTotalFees.formatted}% of Total Fees)`}
        tooltipText='The % of participation tokens you own among all participation tokens purchased in the current window'
      />

      <PrimaryButton
        disabled={disablePurchaseButton}
        text="Get Participation Tokens"
        action={openModal}
      />

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
        subheader={pastParticipationTokensPurchased.formatted}
        tooltipText={'The total amount of unredeemed participation tokens you\ve purchased for past reporting minus any you\'ve lost for incorrect reporting'}
      />
      <Subheaders
        info
        header="My Portion of Reporting Fees"
        subheader={participationTokensClaimableFees.formatted}
        secondSubheader="DAI"
        tooltipText={'The total amount of unclaimed Dai you\'ve earned through reporting'}
      />

      <PrimaryButton
        disabled={!hasRedeemable}
        text="Redeem Past Participation Tokens"
        action={null}
      />
    </div>
  );
};
