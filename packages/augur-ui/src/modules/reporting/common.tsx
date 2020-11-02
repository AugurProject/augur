import React, { Component, useState, useEffect } from 'react';
import classNames from 'classnames';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import {
  ZERO,
  MY_TOTOL_REP_STAKED,
  ALL_TIME_PROFIT_AND_LOSS_REP,
  REPORTING_STATE,
  SCALAR,
  REP,
  DISPUTE_GAS_COST,
  INITAL_REPORT_GAS_COST,
  HEADER_TYPE,
  INVALID_OUTCOME_ID,
  SUBMIT_REPORT,
  BUYPARTICIPATIONTOKENS,
  TRANSACTIONS,
  REDEEMSTAKE,
  HELP_CENTER_PARTICIPATION_TOKENS,
  MODAL_ADD_FUNDS,
  ADD_FUNDS_SWAP,
  MODAL_REPORTING,
  MODAL_PARTICIPATE,
  MODAL_CLAIM_FEES,
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
  ProcessingButton,
} from 'modules/common/buttons';
import { Checkbox, TextInput } from 'modules/common/form';
import {
  LinearPropertyLabel,
  SizableValueLabel,
  RepBalance,
  MovementLabel,
  InReportingLabel,
  TransactionFeeLabel,
} from 'modules/common/labels';
import { ButtonActionType } from 'modules/types';
import {
  formatRep,
  formatAttoRep,
  formatGasCostToEther,
  formatPercent,
  formatAttoDai,
  formatNumber,
} from 'utils/format-number';
import { MarketProgress } from 'modules/common/progress';
import {
  InfoIcon,
  InformationIcon,
  QuestionIcon,
  XIcon,
} from 'modules/common/icons';
import ChevronFlip from 'modules/common/chevron-flip';
import FormStyles from 'modules/common/form.styles.less';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/reporting/common.styles.less';
import {
  convertDisplayValuetoAttoValue,
  convertAttoValueToDisplayValue,
} from '@augurproject/sdk-lite';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';
import {
  getRepThresholdForPacing,
  getGasPrice,
} from 'modules/contracts/actions/contractCalls';
import MarketTitle from 'modules/market/components/common/market-title';
import {
  displayGasInDai,
  getGasInDai,
} from 'modules/app/actions/get-ethToDai-rate';
import { useAppStatusStore, AppStatus } from 'modules/app/store/app-status';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import {
  selectReportingBalances,
  selectDefaultReportingBalances,
} from 'modules/account/helpers/common';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { isSameAddress } from 'utils/isSameAddress';
import { getGasCost } from 'modules/modal/gas';

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
  queueName?: string;
  queueId?: string;
  error?: boolean;
}

export const DismissableNotice = ({
  title,
  description,
  buttonType,
  buttonText,
  buttonAction,
  className,
  show: showProp,
  queueName,
  error,
  queueId,
}: DismissableNoticeProps) => {
  const [show, setShow] = useState(showProp);

  return (
    <>
      {show ? (
        <div
          className={classNames(Styles.DismissableNotice, className, {
            [Styles.Error]: error,
          })}
        >
          <span>{InformationIcon}</span>
          <div>
            <div>{title}</div>
            {description && <div>{description}</div>}
          </div>
          {buttonType === DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON && (
            <ProcessingButton
              text={buttonText}
              action={buttonAction}
              queueName={queueName}
              queueId={queueId}
            />
          )}
          {buttonType === DISMISSABLE_NOTICE_BUTTON_TYPES.CLOSE && (
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
        data-iscapture={true}
      />
      <ReactTooltip
        id={key}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        My Existing Stake
        <p>{props.userValue.formattedValue} REPv2</p>
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
          <label
            data-tip
            data-for={'tooltip--' + props.header}
            data-iscapture={true}
          >
            {QuestionIcon}
          </label>
          <ReactTooltip
            id={'tooltip--' + props.header}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
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
  highlightedText?: string;
  text: string;
  action: ButtonActionType;
}

export const ReportingModalButton = ({
  highlightedText,
  text,
  action,
}: ReportingModalButtonProps) => (
  <button className={Styles.ReportingModalButton} onClick={e => action(e)}>
    {highlightedText && <span>{highlightedText}</span>}
    {text}
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
        <span>Add Pre-Filled Stake?</span>
        <span>
          Pre-fund future dispute rounds to accelerate market resolution. Any
          contributed REPv2 will automatically go toward disputing in favor of
          this outcome, if it is no longer the tentative winning outcome in
          future rounds
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
              maxLabel="MAX (REPv2 THRESHOLD)"
            />
            <span>Review Pre-Filled Stake</span>
            <LinearPropertyLabel
              key="totalRep"
              label="Total REPv2"
              value={formatRep(preFilledStake).formatted + ' REPv2'}
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
        innerLabel="REPv2"
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
          / {props.bondSizeCurrent && props.bondSizeCurrent.formatted} REPv2
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
  isWarpSync: boolean;
}

export const DisputingBondsView = ({
  updateInputtedStake,
  market,
  inputScalarOutcome,
  stakeValue,
  stakeRemaining,
  tentativeWinning,
  reportAction,
  id,
  isInvalid,
  isWarpSync,
}: DisputingBondsViewProps) => {
  const {
    actions: { setModal },
    loginAccount: {
      balances: { rep: userAvailableRep },
    },
    ethToDaiRate,
    gasPriceInfo,
    universe: { warpSyncHash },
  } = useAppStatusStore();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const gasCostDai = getGasCost(
    DISPUTE_GAS_COST.toNumber(),
    createBigNumber(gasPrice),
    ethToDaiRate
  );

  const displayfee = `$${gasCostDai.formattedValue}`;

  const [state, setState] = useState({
    disabled: true,
    scalarError: '',
    stakeError: '',
    isScalar: market.marketType === SCALAR,
    gasEstimate: gasCostDai,
  });
  const { disabled, scalarError, stakeError, isScalar, gasEstimate } = state;

  useEffect(() => {
    if (isWarpSync) {
      updateScalarOutcome(warpSyncHash);
      updateInputtedStakeLocal('0');
    }
  }, []);

  function updateScalarOutcome(range: string) {
    if (
      createBigNumber(range).lt(createBigNumber(market.minPrice)) ||
      createBigNumber(range).gt(createBigNumber(market.maxPrice))
    ) {
      setState({
        ...state,
        scalarError: 'Input value not between scalar market range',
        disabled: true,
      });
    } else if (!market.isWarpSync && (isNaN(Number(range)) || range === '')) {
      setState({
        ...state,
        scalarError: 'Enter a valid number',
        disabled: true,
      });
    } else {
      setState({ ...state, scalarError: '' });
      if (stakeError === '' && stakeValue !== '' && stakeValue !== '0') {
        setState({ ...state, disabled: false });
      }
    }
    updateScalarOutcome(range);
  }

  function updateInputtedStakeLocal(inputStakeValue: string) {
    let inputToAttoRep = null;
    const min = formatAttoRep(market.noShowBondAmount).value;
    const remaining = formatAttoRep(stakeRemaining).value;
    if (!isNaN(Number(inputStakeValue))) {
      inputToAttoRep = convertDisplayValuetoAttoValue(
        createBigNumber(inputStakeValue)
      );
    }
    if (
      !!!warpSyncHash &&
      (isNaN(Number(inputStakeValue)) ||
        inputStakeValue === '' ||
        inputStakeValue === '0' ||
        inputStakeValue === '.' ||
        inputStakeValue === '0.')
    ) {
      setState({
        ...state,
        stakeError: 'Enter a valid number',
        disabled: true,
      });
      return updateInputtedStake({ inputStakeValue, ZERO });
    } else if (
      createBigNumber(userAvailableRep).lt(createBigNumber(inputStakeValue))
    ) {
      setState({
        ...state,
        stakeError: `Value is bigger than REPv2 balance: ${userAvailableRep} REPv2`,
        disabled: true,
      });
    } else if (
      !tentativeWinning &&
      stakeRemaining &&
      createBigNumber(stakeRemaining).lt(inputToAttoRep)
    ) {
      setState({
        ...state,
        stakeError: `Value is bigger than needed: ${remaining} REPv2`,
        disabled: true,
      });
    } else if (
      !tentativeWinning &&
      stakeRemaining &&
      createBigNumber(inputToAttoRep).lt(
        createBigNumber(market.noShowBondAmount)
      )
    ) {
      setState({
        ...state,
        stakeError: `Value is smaller than minimum: ${min} REPv2`,
        disabled: true,
      });
    } else {
      setState({ ...state, stakeError: '' });
      if (
        (isScalar && inputScalarOutcome !== '') ||
        isInvalid ||
        !!warpSyncHash ||
        !isScalar
      ) {
        setState({ ...state, disabled: false });
      }
    }
    updateInputtedStake({ inputStakeValue, inputToAttoRep });
  }

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
          inputScalarOutcome={
            !inputScalarOutcome && market.isWarpSync
              ? warpSyncHash
              : inputScalarOutcome
          }
          updateScalarOutcome={updateScalarOutcome}
          scalarDenomination={market.scalarDenomination}
          scalarError={scalarError}
        />
      )}
      <TextInput
        placeholder="0.0000"
        value={String(stakeValue)}
        onChange={value => updateInputtedStakeLocal(value)}
        errorMessage={stakeError}
        innerLabel="REPv2"
      />
      {!tentativeWinning && (
        <section>
          <CancelTextButton
            noIcon
            action={() => updateInputtedStakeLocal(String(min))}
            text="MIN"
          />
          |
          <CancelTextButton
            noIcon
            action={() => updateInputtedStakeLocal(String(remaining))}
            text="FILL DISPUTE BOND"
          />
        </section>
      )}
      <span>Review</span>
      <LinearPropertyLabel
        key="disputeRoundStake"
        label={
          tentativeWinning ? 'Contribute to Next Round' : 'Dispute Round Stake'
        }
        value={formatRep(stakeValue || ZERO).formatted + ' REPv2'}
      />
      <TransactionFeeLabel gasCostDai={formatNumber(displayfee)} />
      <PrimaryButton
        text="Confirm"
        action={() => {
          reportAction(false);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export interface ReportingBondsViewProps {
  market: MarketData;
  id: string;
  updateScalarOutcome: Function;
  reportAction: Function;
  inputtedReportingStake: DisputeInputtedValues;
  updateInputtedStake?: Function;
  inputScalarOutcome?: string;
  initialReport: boolean;
  migrateMarket: boolean;
  migrateRep: boolean;
  userAttoRep: BigNumber;
  owesRep: boolean;
  openReporting: boolean;
  enoughRepBalance: boolean;
  userFunds: BigNumber;
}

export const ReportingBondsView = ({
  market,
  inputScalarOutcome,
  reportAction,
  inputtedReportingStake,
  id,
  updateInputtedStake,
  updateScalarOutcome,
}: ReportingBondsViewProps) => {
  const {
    actions: { setModal },
    loginAccount: { balances, address },
    universe: { forkingInfo },
    gasPriceInfo,
    ethToDaiRate,
  } = useAppStatusStore();
  let userAttoRep = createBigNumber((balances && balances.attoRep) || ZERO);
  const userFunds = createBigNumber((balances && balances.dai) || ZERO);
  const hasForked = !!forkingInfo;
  const migrateRep = hasForked && forkingInfo?.forkingMarket === market.id;
  const migrateMarket = hasForked && !!forkingInfo.winningChildUniverseId;
  const initialReport = !migrateMarket && !migrateRep;
  const openReporting =
    market.reportingState === REPORTING_STATE.OPEN_REPORTING;
  const owesRep = migrateMarket
    ? migrateMarket
    : !openReporting &&
      forkingInfo?.forkingMarket === market.id &&
      !isSameAddress(market.author, address);
  const enoughRepBalance = owesRep
    ? userAttoRep.gte(createBigNumber(market.noShowBondAmount))
    : true;
  userAttoRep = convertAttoValueToDisplayValue(userAttoRep);

  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const gasCostDai = getGasCost(
    INITAL_REPORT_GAS_COST.toNumber(),
    createBigNumber(gasPrice),
    ethToDaiRate
  );
  const displayfee = `$${gasCostDai.formattedValue}`;

  const [state, setState] = useState({
    showInput: false,
    disabled: market.marketType === SCALAR && migrateRep ? true : false,
    scalarError: '',
    isScalar: market.marketType === SCALAR,
    threshold: userAttoRep.toString(),
    readAndAgreedCheckbox: false,
    gasEstimate: gasCostDai,
  });
  const [stakeError, setStakeError] = useState('');

  const {
    showInput,
    disabled,
    scalarError,
    isScalar,
    threshold,
    readAndAgreedCheckbox,
    gasEstimate,
  } = state;

  useEffect(() => {
    (async function onMount() {
      if (initialReport) {
        const threshold = await getRepThresholdForPacing();
        setState({
          ...state,
          threshold: String(convertAttoValueToDisplayValue(threshold)),
        });
        const gasLimit = await reportAction(true).catch(e => console.error(e));
        setState({
          ...state,
          gasEstimate: gasLimit || INITAL_REPORT_GAS_COST,
        });
      }
    })();
  }, []);

  const toggleInput = () => {
    setState({ ...state, showInput: !showInput });
  };

  const updateScalarOutcomeLocal = (range: string) => {
    if (
      createBigNumber(range).lt(createBigNumber(market.minPrice)) ||
      createBigNumber(range).gt(createBigNumber(market.maxPrice))
    ) {
      setState({
        ...state,
        scalarError: 'Input value not between scalar market range',
        disabled: true,
      });
    } else if (!market.isWarpSync && (isNaN(Number(range)) || range === '')) {
      setState({
        ...state,
        scalarError: 'Enter a valid number',
        disabled: true,
      });
    } else {
      setState({ ...state, scalarError: '' });
      if (stakeError === '') {
        setState({ ...state, disabled: false });
      }
    }
    updateScalarOutcome(range);
  };

  const updateInputtedStakeLocal = (inputStakeValue: string) => {
    let disabled = false;
    if (isNaN(Number(inputStakeValue))) {
      disabled = true;
      setStakeError('Enter a valid number');
    } else if (
      createBigNumber(userAttoRep).lt(createBigNumber(inputStakeValue))
    ) {
      disabled = true;
      setStakeError('Value is bigger than user REPv2 balance');
    } else if (
      createBigNumber(threshold).lt(createBigNumber(inputStakeValue))
    ) {
      disabled = true;
      setStakeError(`Value is bigger than the REPv2 threshold: ${threshold}`);
    } else {
      setStakeError('');
    }
    let inputToAttoRep = '0';
    if (!isNaN(Number(inputStakeValue)) && inputStakeValue !== '') {
      inputToAttoRep = String(
        convertDisplayValuetoAttoValue(createBigNumber(inputStakeValue))
      );
    }
    updateInputtedStake({ inputToAttoRep, inputStakeValue });
    setState({ ...state, disabled });
  };

  const checkCheckbox = (readAndAgreedCheckbox: boolean) => {
    setState({ ...state, readAndAgreedCheckbox });
  };

  const repAmount = migrateRep
    ? formatAttoRep(inputtedReportingStake.inputToAttoRep).formatted
    : formatAttoRep(market.noShowBondAmount).formatted;
  let repLabel = migrateRep ? 'REPv2 to migrate' : 'Initial Reporter Stake';

  repLabel = openReporting ? 'Open Reporting winning Stake' : repLabel;
  if (owesRep) {
    repLabel = 'REPv2 needed';
  }
  const reviewLabel = migrateRep
    ? 'Review REPv2 to migrate'
    : 'Review Initial Reporting Stake';
  const totalRep = owesRep
    ? formatAttoRep(
        createBigNumber(inputtedReportingStake.inputToAttoRep || ZERO).plus(
          market.noShowBondAmount
        )
      ).formatted
    : formatAttoRep(
        createBigNumber(inputtedReportingStake.inputToAttoRep || ZERO)
      ).formatted;

  let buttonDisabled = disabled;
  if (
    (isScalar &&
      inputScalarOutcome === '' &&
      id !== String(INVALID_OUTCOME_ID)) ||
    (migrateRep &&
      createBigNumber(inputtedReportingStake.inputStakeValue).lte(ZERO))
  ) {
    buttonDisabled = true;
  }
  let insufficientFunds = false;
  if (userFunds.lt(createBigNumber(getGasInDai(gasEstimate).value))) {
    buttonDisabled = true;
    insufficientFunds = true;
  }

  let insufficientRep = '';
  if (!enoughRepBalance) {
    (insufficientRep = 'Not enough REPv2 to report'), (buttonDisabled = true);
  }
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
          updateScalarOutcome={updateScalarOutcomeLocal}
          scalarDenomination={market.scalarDenomination}
          scalarError={scalarError}
        />
      )}
      {migrateRep && (
        <InputRepStake
          stakeAmount={String(inputtedReportingStake.inputStakeValue)}
          updateStakeAmount={updateInputtedStakeLocal}
          stakeError={stakeError}
          max={String(userAttoRep)}
          maxLabel="MAX"
        />
      )}
      <span>{reviewLabel}</span>
      <LinearPropertyLabel
        key="initial"
        label={repLabel}
        value={`${repAmount} REPv2`}
      />
      {initialReport && !market.isWarpSync && (
        <PreFilledStake
          showInput={showInput}
          toggleInput={toggleInput}
          updateInputtedStake={updateInputtedStakeLocal}
          preFilledStake={inputtedReportingStake.inputStakeValue}
          stakeError={stakeError}
          threshold={threshold}
        />
      )}
      {!market.isWarpSync && !migrateRep && (
        <div className={Styles.ShowTotals}>
          <span>Totals</span>
          {!market.isForking && (
            <span>
              Sum total of Initial Reporter Stake and Pre-Filled Stake
            </span>
          )}
          <LinearPropertyLabel
            key="totalRep"
            label="Total REPv2 Needed"
            value={totalRep}
          />
          {insufficientRep && (
            <span className={FormStyles.ErrorText}>{insufficientRep}</span>
          )}
        </div>
      )}
      <div>
        <TransactionFeeLabel gasCostDai={formatNumber(displayfee)} />
        {insufficientFunds && (
          <span className={FormStyles.ErrorText}>
            Insufficient Funds to complete transaction
          </span>
        )}
      </div>

      {migrateRep &&
        createBigNumber(inputtedReportingStake.inputStakeValue).lt(
          userAttoRep
        ) && (
          <DismissableNotice
            show={true}
            description=""
            title="Are you sure you only want to migrate a portion of your REPv2 to this universe?
          If not, go back and select the ‘Max’ button to migrate your full REPv2 amount."
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
            checkCheckbox(!readAndAgreedCheckbox);
          }}
        >
          <label htmlFor="migrate-rep-confirmation">
            <Checkbox
              id="migrate-rep-confirmation"
              isChecked={readAndAgreedCheckbox}
              onClick={() => checkCheckbox(!readAndAgreedCheckbox)}
              disabled={false}
            />
            I have carefully read all the information and fully acknowledge the
            consequences of migrating my REPv2 to an unsuccessful universe
          </label>
        </div>
      )}
      <PrimaryButton
        text={migrateRep ? 'Confirm and Migrate REPv2' : 'Confirm'}
        disabled={
          migrateRep ? buttonDisabled || !readAndAgreedCheckbox : buttonDisabled
        }
        action={() => {
          reportAction();
        }}
      />
    </div>
  );
};

interface UserRepDisplayState {
  toggle: boolean;
}

export interface ReportingCardProps {
  market: MarketData;
}

export const ReportingCard = ({ market }: ReportingCardProps) => {
  if (!market) return null;
  const {
    universe: { forkingInfo },
    actions: { setModal },
  } = useAppStatusStore();
  let { isLogged } = useAppStatusStore();

  const isForking = forkingInfo;
  isLogged = isLogged && !forkingInfo;

  const { id, reportingState, disputeInfo, endTimeFormatted } = market;

  const preReporting = reportingState === REPORTING_STATE.PRE_REPORTING;
  const headerType =
    reportingState === REPORTING_STATE.OPEN_REPORTING && HEADER_TYPE.H2;

  let disabledTooltipText = preReporting
    ? 'Please wait until the Market is ready to Report on'
    : 'Please connect a wallet to Report on this Market';

  if (isForking) {
    disabledTooltipText =
      'Market cannot be reported on while universe is forking';
  }

  return (
    <div className={Styles.ReportingCard}>
      <InReportingLabel
        reportingState={reportingState}
        disputeInfo={disputeInfo}
        endTimeFormatted={endTimeFormatted}
        isWarpSync={market.isWarpSync}
      />
      <MarketTitle id={id} headerType={headerType} />
      {reportingState !== REPORTING_STATE.OPEN_REPORTING && (
        <MarketProgress
          reportingState={reportingState}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
        />
      )}
      <div
        data-tip
        data-for={'tooltip--preReporting' + id}
        data-iscapture={true}
      >
        <ProcessingButton
          text="Report"
          action={() =>
            setModal({
              type: MODAL_REPORTING,
              market,
            })
          }
          disabled={preReporting || !isLogged}
          queueName={SUBMIT_REPORT}
          queueId={id}
        />
        {(preReporting || !isLogged) && (
          <ReactTooltip
            id={'tooltip--preReporting' + id}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            <p>{disabledTooltipText} </p>
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
        size={SizeTypes.SMALL}
        showPlusMinus
        showIcon
        showBrackets
        value={props.repProfitLossPercentageFormatted}
        useFull
      />
    </div>
  </div>
);

export const UserRepDisplay = () => {
  const [toggle, setToggle] = useState(false);
  const {
    isLogged,
    loginAccount: { balances, reporting },
    actions: { setModal },
  } = useAppStatusStore();
  const {
    repBalanceFormatted,
    repProfitAmountFormatted,
    repProfitLossPercentageFormatted,
    repTotalAmountStakedFormatted,
    disputingAmountFormatted,
    reportingAmountFormatted,
    participationAmountFormatted,
    hasStakedRep,
  } = isLogged
    ? selectReportingBalances(reporting, balances)
    : selectDefaultReportingBalances();
  return (
    <div
      className={classNames(Styles.UserRepDisplay, {
        [Styles.HideForMobile]: toggle,
      })}
    >
      <>
        <div onClick={() => setToggle(!toggle)}>
          <RepBalance alternate larger rep={repBalanceFormatted.formatted} />
          <ChevronFlip stroke="#fff" filledInIcon quick pointDown={toggle} />
        </div>
        <div>
          <AllTimeProfitLoss
            repProfitAmountFormatted={repProfitAmountFormatted}
            repProfitLossPercentageFormatted={repProfitLossPercentageFormatted}
          />
          <PrimaryButton
            action={() =>
              setModal({
                type: MODAL_ADD_FUNDS,
                tokenToAdd: REP,
                initialAddFundsFlow: ADD_FUNDS_SWAP,
              })
            }
            text="Get REPv2"
            id="get-rep"
          />
        </div>
        {!isLogged && (
          <p>Connect a wallet to see your Available REPv2 Balance</p>
        )}
        {isLogged && hasStakedRep && (
          <>
            <div />
            <div>
              <span>{MY_TOTOL_REP_STAKED}</span>
              <SizableValueLabel
                value={repTotalAmountStakedFormatted}
                keyId={'rep-staked'}
                showDenomination
                showEmptyDash={false}
                useFull
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
                useFull
                useValueLabel
              />
              <LinearPropertyLabel
                key="reporting"
                label="Reporting"
                value={reportingAmountFormatted}
                showDenomination
                useFull
                useValueLabel
              />
              <LinearPropertyLabel
                key="participation"
                label="Participation Tokens"
                value={participationAmountFormatted}
                showDenomination
                useFull
                useValueLabel
              />
            </div>
          </>
        )}
      </>
    </div>
  );
};

export const ParticipationTokensView = () => {
  const {
    actions: { setModal },
    loginAccount: {
      reporting: { participationTokens },
    },
    universe: {
      forkingInfo,
      disputeWindow: { address, fees, purchased },
    },
    isLogged,
  } = useAppStatusStore();

  const disablePurchaseButton = !!forkingInfo;
  const tokenAmount =
    (address &&
      participationTokens &&
      (participationTokens.contracts.find(c => !c.isClaimable) || {}).amount) ||
    ZERO;
  const purchasedTokens = purchased || 0;
  const purchasedParticipationTokens = formatAttoRep(purchasedTokens);
  const ONE_HUNDRED_BECAUSE_PERCENTAGES = 100;
  const percentageOfTotalFees = formatPercent(
    purchasedParticipationTokens.value
      ? createBigNumber(tokenAmount)
          .dividedBy(createBigNumber(purchasedTokens))
          .times(ONE_HUNDRED_BECAUSE_PERCENTAGES)
      : 0
  );
  let pastParticipationTokensPurchased: BigNumber | FormattedNumber =
    (participationTokens &&
      createBigNumber(participationTokens.totalClaimable)) ||
    ZERO;

  let participationTokensClaimableFees =
    participationTokens && participationTokens.contracts
      ? participationTokens.contracts
          .filter(c => c.isClaimable)
          .map(c => c.amountFees)
          .reduce((accumulator, currentValue) => {
            const bigAccumulator = createBigNumber(accumulator) || ZERO;
            const bigCurrentValue = createBigNumber(currentValue) || ZERO;
            return bigCurrentValue.plus(bigAccumulator);
          }, ZERO)
      : ZERO;

  const hasRedeemable = isLogged && pastParticipationTokensPurchased.gt(ZERO);

  const disputeWindowFees = formatAttoDai(fees || 0);
  const tokensOwned = formatAttoRep(tokenAmount);
  pastParticipationTokensPurchased = formatAttoRep(
    pastParticipationTokensPurchased
  );
  participationTokensClaimableFees = formatAttoDai(
    participationTokensClaimableFees
  );

  return (
    <div className={Styles.ParticipationTokensView}>
      <h4>Participation Tokens</h4>
      <span>
        <span>Don’t see any reports that need disputing? </span>
        You can earn a proportional share of the profits from this dispute
        window.
        <span>
          <a
            href={HELP_CENTER_PARTICIPATION_TOKENS}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </span>
      </span>

      <Subheaders
        large
        info
        header="Total Reporting Fees"
        subheader={disputeWindowFees.formatted}
        secondSubheader="DAI"
        tooltipText="The total amount to be paid to reporters"
      />
      <Subheaders
        large
        info
        header="Total Participation Tokens Purchased"
        subheader={purchasedParticipationTokens.formatted}
        tooltipText="The total amount of participation tokens purchased by reporters in the current window"
      />
      <Subheaders
        info
        header="Participation Tokens I OWN in Current Dispute Window"
        subheader={tokensOwned.formatted}
        secondSubheader={`(${percentageOfTotalFees.formatted}% of Total Fees)`}
        tooltipText="The % of participation tokens you own among all participation tokens purchased in the current window"
      />

      <ProcessingButton
        disabled={disablePurchaseButton}
        text="Get Participation Tokens"
        action={() => setModal({ type: MODAL_PARTICIPATE })}
        queueName={TRANSACTIONS}
        queueId={BUYPARTICIPATIONTOKENS}
      />

      <section />

      <h4>Redeem Past Participation Tokens</h4>
      <span>
        Redeem your past Participation Tokens and any returns from your share of
        the Reporting Fees. All tokens and fees that are ready to be claimed are
        shown below.
      </span>
      <Subheaders
        info
        header="Participation Tokens Purchased"
        subheader={pastParticipationTokensPurchased.formatted}
        tooltipText={
          "The total amount of unredeemed participation tokens you've purchased for past reporting minus any you've lost for incorrect reporting"
        }
      />
      <Subheaders
        info
        header="My Portion of Reporting Fees"
        subheader={participationTokensClaimableFees.formatted}
        secondSubheader="DAI"
        tooltipText={
          "The total amount of unclaimed Dai you've earned through reporting"
        }
      />
      <ProcessingButton
        disabled={!hasRedeemable}
        text="Redeem Past Participation Tokens"
        action={() =>
          setModal({ type: MODAL_CLAIM_FEES, participationTokensOnly: true })
        }
        queueName={TRANSACTIONS}
        queueId={REDEEMSTAKE}
      />
    </div>
  );
};

export const ReleasableRepNotice = () => {
  const {
    loginAccount: { reporting },
    universe: { forkingInfo },
  } = useAppStatusStore();
  let hasStakedRep = false;
  const hasForked = !!forkingInfo;
  let show = false;
  if (hasForked) {
    if (reporting) {
      if (
        (reporting.reporting &&
          createBigNumber(reporting.reporting.totalStaked).gt(ZERO)) ||
        (reporting.disputing &&
          createBigNumber(reporting.disputing.totalStaked).gt(ZERO)) ||
        (reporting.participationTokens &&
          createBigNumber(reporting.participationTokens.totalStaked).gt(ZERO))
      )
        hasStakedRep = true;
    }
  }
  if (hasForked && hasStakedRep) show = true;

  if (!show) return <div />;

  return (
    <DismissableNotice
      show
      buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
      title="You Still have REPv2 locked up in dispute Bonds and Participation Tokens."
      description="Please follow the instructions given in the banner at the top of this site or the notification in your account summary."
    />
  );
};
