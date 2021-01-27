import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
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
  HEADER_TYPE,
  INVALID_OUTCOME_ID,
  SUBMIT_REPORT,
  BUYPARTICIPATIONTOKENS,
  TRANSACTIONS,
  REDEEMSTAKE,
  HELP_CENTER_PARTICIPATION_TOKENS,
  CREATEAUGURWALLET,
  MODAL_INITIALIZE_ACCOUNT,
  WARNING,
  WALLET_STATUS_VALUES,
  GWEI_CONVERSION,
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
  ExternalLinkButton,
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
  formatDai,
  formatEther,
} from 'utils/format-number';
import { MarketProgress } from 'modules/common/progress';
import { InfoIcon, InformationIcon, XIcon } from 'modules/common/icons';
import ChevronFlip from 'modules/common/chevron-flip';
import FormStyles from 'modules/common/form.styles.less';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import ButtonStyles from 'modules/common/buttons.styles.less';
import Styles, { userRepDisplay } from 'modules/reporting/common.styles.less';
import {
  convertDisplayValuetoAttoValue,
  convertAttoValueToDisplayValue,
} from '@augurproject/sdk-lite';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';
import { getRepThresholdForPacing } from 'modules/contracts/actions/contractCalls';
import MarketTitle from 'modules/market/containers/market-title';
import { AppState } from 'appStore/index';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { updateModal } from 'modules/modal/actions/update-modal';
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
  disabled?: boolean;
  center?: boolean;
  customPendingButtonText?: string;
}

export const DismissableNotice = (props: DismissableNoticeProps) => {
  const [show, setShow] = useState(props.show);

  return (
    <>
      {show ? (
        <div className={classNames(Styles.DismissableNotice, props.className, {
            [Styles.Error]: props.error,
            [Styles.Center]: props.center,
         })}>
          <span>{InformationIcon}</span>
          <div>
            <div>{props.title}</div>
            {props.description && <div>{props.description}</div>}
          </div>
          {props.buttonType === DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON && (
             <ProcessingButton
              text={props.buttonText}
              action={props.buttonAction}
              queueName={props.queueName}
              queueId={props.queueId}
              disabled={props.disabled}
              customPendingButtonText={props.customPendingButtonText}
            />
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


const mapStateToPropsActivateWalletButton = (state: AppState) => {
  const { gsnEnabled, walletStatus } = state.appStatus;

  return {
    gsnUnavailable: isGSNUnavailable(state),
    gsnEnabled,
    walletStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  initializeGsnWallet: () => dispatch(updateModal({ type: MODAL_INITIALIZE_ACCOUNT })),
  updateWalletStatus: () => {
    dispatch(removePendingTransaction(CREATEAUGURWALLET));
  }
});

const mergeProps = (sP, dP, oP) => {
  let showMessage = sP.gsnUnavailable;
  let buttonAction = dP.initializeGsnWallet;
  if (sP.walletStatus === WALLET_STATUS_VALUES.CREATED) {
    buttonAction = dP.updateWalletStatus;
  }
  if (
    sP.walletStatus !== WALLET_STATUS_VALUES.FUNDED_NEED_CREATE &&
    sP.walletStatus !== WALLET_STATUS_VALUES.CREATED
  ) {
    showMessage = false;
  }
  return {
    ...sP,
    ...dP,
    buttonAction,
    showMessage,
  };
};

const ActivateWalletButtonCmp = ({ showMessage, buttonAction }) => (
  <>
    {showMessage && (
      <div className={classNames(Styles.ActivateWalletButton)}>
        <DismissableNotice
          show
          title={'Account Activation'}
          buttonText={'Activate Account'}
          buttonAction={buttonAction}
          queueName={TRANSACTIONS}
          queueId={CREATEAUGURWALLET}
          buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON}
          description={`Activation of your account is needed`}
        />
      </div>
    )}
  </>
);

export const ActivateWalletButton = connect(
  mapStateToPropsActivateWalletButton,
  mapDispatchToProps,
  mergeProps,
)(ActivateWalletButtonCmp);


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
            {InfoIcon}
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
              label="Total Rep"
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
  ethToDaiRate: FormattedNumber;
  GsnEnabled: boolean;
  gasPrice: number;
  warpSyncHash: string;
  isWarpSync: boolean;
  gsnUnavailable: boolean;
  gsnWalletInfoSeen: boolean;
  initializeGsnWallet: Function;
  availableEthBalance: string;
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
    gasEstimate: DISPUTE_GAS_COST,
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
    } else if (!market.isWarpSync && (isNaN(Number(range)) || range === '')) {
      this.setState({ scalarError: 'Enter a valid number', disabled: true });
    } else {
      this.setState({ scalarError: '' });
      if (
        this.state.stakeError === '' &&
        stakeValue !== '' &&
        stakeValue !== '0'
      ) {
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
      warpSyncHash,
      availableEthBalance,
      gasPrice,
    } = this.props;
    let inputToAttoRep = null;
    const { isScalar, gasEstimate } = this.state;
    const gasCostInEth = formatEther(formatGasCostToEther(gasEstimate, { decimalsRounded: 4 }, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)));
    const ethNeededForGas = String(createBigNumber(availableEthBalance).minus(gasCostInEth.value));
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
      this.setState({ stakeError: 'Enter a valid number', disabled: true });
      return updateInputtedStake({ inputStakeValue, ZERO });
    } else if (
      createBigNumber(userAvailableRep).lt(createBigNumber(inputStakeValue))
    ) {
      this.setState({
        stakeError: `Value is bigger than REPv2 balance: ${userAvailableRep} REPv2`,
        disabled: true,
      });
    } else if (
      !tentativeWinning &&
      stakeRemaining &&
      createBigNumber(stakeRemaining).lt(inputToAttoRep)
    ) {
      this.setState({
        stakeError: `Value is bigger than needed: ${remaining} REPv2`,
        disabled: true,
      });
    } else if (createBigNumber(ethNeededForGas).lt(ZERO)) {
      this.setState({
        stakeError: `Insufficient ETH to pay transaction fee, ${formatEther(ethNeededForGas).formatted} ETH needed.`,
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
        stakeError: `Value is smaller than minimum: ${min} REPv2`,
        disabled: true,
      });
    } else {
      this.setState({ stakeError: '' });
      if (
        (isScalar && inputScalarOutcome !== '') ||
        isInvalid ||
        !!warpSyncHash ||
        !isScalar
      ) {
        this.setState({ disabled: false });
      }
    }
    updateInputtedStake({ inputStakeValue, inputToAttoRep });
  };

  async componentDidMount() {
    const gasLimit = await this.props.reportAction(true);
    this.setState({
      gasEstimate: gasLimit,
    });

    if (this.props.isWarpSync) {
      this.updateScalarOutcome(this.props.warpSyncHash);
      this.updateInputtedStake('0');
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
      GsnEnabled,
      ethToDaiRate,
      gasPrice,
      warpSyncHash,
      gsnUnavailable,
      gsnWalletInfoSeen,
      initializeGsnWallet,
      availableEthBalance,
    } = this.props;

    const {
      disabled,
      scalarError,
      stakeError,
      isScalar,
      gasEstimate,
    } = this.state;
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
          innerLabel="REPv2"
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
          value={formatRep(stakeValue || ZERO).formatted + ' REPv2'}
        />
        <TransactionFeeLabel gasEstimate={gasEstimate} />
        <PrimaryButton
          text="Confirm"
          action={() => {
            if (gsnUnavailable && !gsnWalletInfoSeen) {
              initializeGsnWallet(() => {
                reportAction(false);
              });
            } else {
              reportAction(false);
            }
          }}
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
  GsnEnabled: boolean;
  gasPrice: number;
  ethToDaiRate: FormattedNumber;
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
  gsnUnavailable: boolean;
  gsnWalletInfoSeen: boolean;
  initializeGsnWallet: Function;
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
    disabled:
      this.props.market.marketType === SCALAR && this.props.migrateRep
        ? true
        : false,
    scalarError: '',
    stakeError: '',
    isScalar: this.props.market.marketType === SCALAR,
    threshold: this.props.userAttoRep.toString(),
    readAndAgreedCheckbox: false,
    gasEstimate: INITAL_REPORT_GAS_COST,
  };

  async componentDidMount() {
    if (this.props.initialReport) {
      const threshold = await getRepThresholdForPacing();
      this.setState({
        threshold: String(convertAttoValueToDisplayValue(threshold)),
      });
      if (this.props.GsnEnabled) {
        const gasLimit = await this.props
          .reportAction(true)
          .catch(e => console.error(e));
        this.setState({
          gasEstimate: gasLimit || INITAL_REPORT_GAS_COST,
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
    } else if (!market.isWarpSync && (isNaN(Number(range)) || range === '')) {
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
    const { updateInputtedStake, userAttoRep } = this.props;
    const { threshold } = this.state;
    let disabled = false;
    if (isNaN(Number(inputStakeValue))) {
      disabled = true;
      this.setState({ stakeError: 'Enter a valid number' });
    } else if (
      createBigNumber(userAttoRep).lt(createBigNumber(inputStakeValue))
    ) {
      disabled = true;
      this.setState({
        stakeError: 'Value is bigger than user REPv2 balance',
      });
    } else if (
      createBigNumber(threshold).lt(createBigNumber(inputStakeValue))
    ) {
      disabled = true;
      this.setState({
        stakeError: `Value is bigger than the REPv2 threshold: ${threshold}`,
      });
    } else {
      this.setState({ stakeError: '' });
    }
    let inputToAttoRep = '0';
    if (!isNaN(Number(inputStakeValue)) && inputStakeValue !== '') {
      inputToAttoRep = String(
        convertDisplayValuetoAttoValue(createBigNumber(inputStakeValue))
      );
    }
    updateInputtedStake({ inputToAttoRep, inputStakeValue });
    this.setState({ disabled });
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
      GsnEnabled,
      ethToDaiRate,
      gasPrice,
      openReporting,
      enoughRepBalance,
      userFunds,
      gsnUnavailable,
      gsnWalletInfoSeen,
      initializeGsnWallet,
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

    const gasCostInEth = formatEther(formatGasCostToEther(gasEstimate, { decimalsRounded: 4 }, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)));
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
    let insufficientFunds = userFunds.minus(createBigNumber(gasCostInEth.value));
    if (insufficientFunds.lt(ZERO)) {
      buttonDisabled = true;
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
        <span>{reviewLabel}</span>
        <LinearPropertyLabel
          key="initial"
          label={repLabel}
          value={`${repAmount} REPv2`}
        />
        {initialReport && !market.isWarpSync && (
          <PreFilledStake
            showInput={showInput}
            toggleInput={this.toggleInput}
            updateInputtedStake={this.updateInputtedStake}
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
          <TransactionFeeLabel gasEstimate={gasEstimate} />
          {insufficientFunds.lt(ZERO) && (
            <span className={FormStyles.ErrorText}>
              {`Insufficient ETH to pay transaction fee, ${formatEther(insufficientFunds).formatted} ETH cost.`}
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
              the consequences of migrating my REPv2 to an unsuccessful universe
            </label>
          </div>
        )}
        <PrimaryButton
          text={migrateRep ? 'Confirm and Migrate REPv2' : 'Confirm'}
          disabled={
            migrateRep
              ? buttonDisabled || !readAndAgreedCheckbox
              : buttonDisabled
          }
          action={() => {
            reportAction();
          }}
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
  isForking: boolean;
}

export const ReportingCard = (props: ReportingCardProps) => {
  const {
    market,
    currentAugurTimestamp,
    showReportingModal,
    isLogged,
    isForking,
  } = props;

  if (!market) return null;

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
        currentAugurTimestamp={currentAugurTimestamp}
        isWarpSync={market.isWarpSync}
      />
      <MarketTitle id={id} headerType={headerType} />
      {reportingState !== REPORTING_STATE.OPEN_REPORTING && (
        <MarketProgress
          reportingState={reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
          reportingWindowStartTime={disputeInfo.disputeWindow.startTime}
        />
      )}
      <div
        data-tip
        data-for={'tooltip--preReporting' + id}
        data-iscapture={true}
      >
        <ProcessingButton
          text="Report"
          action={showReportingModal}
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
              text={'Get REPv2'}
              id="get-rep"
            />
          </div>
          {!isLoggedIn && (
            <p>Connect a wallet to see your Available REPv2 Balance</p>
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
  }
}

export interface ParticipationTokensViewProps {
  openModal: Function;
  openClaimParticipationTokensModal: Function;
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
    openClaimParticipationTokensModal,
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
      <h4>Participation Tokens</h4>
      <span>
        <span>Don’t see any reports that need disputing? </span>
        You can earn a proportional share of the reporting fees from this dispute window.
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
        tooltipText={
          'The total amount of participation tokens purchased by reporters in the current window'
        }
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
        action={openModal}
        queueName={TRANSACTIONS}
        queueId={BUYPARTICIPATIONTOKENS}
      />

      <section />

      <h4>Redeem Past Participation Tokens</h4>
      <span>
      Redeem your past participation tokens and any returns from your portion of the reporting fees.
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
          "The total amount of unclaimed DAI you've earned through reporting"
        }
      />
      <ProcessingButton
        disabled={!hasRedeemable}
        text="Redeem Past Participation Tokens"
        action={openClaimParticipationTokensModal}
        queueName={TRANSACTIONS}
        queueId={REDEEMSTAKE}
      />
    </div>
  );
};
