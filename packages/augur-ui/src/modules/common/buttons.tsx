import React from 'react';
import { connect } from 'react-redux';
import { ASCENDING, DESCENDING, BUY } from 'modules/common/constants';
import {
  StarIcon,
  SortIcon,
  PercentIcon,
  DoubleArrowIcon,
  DaiLogoIcon,
  ViewIcon,
  DownloadIcon,
  RotatableChevron,
  Filter,
  TwoArrowsOutline,
  XIcon,
  BackIcon,
  ThickChevron,
  AlternateDaiLogoIcon,
  AugurLogo,
  RefreshIcon,
} from 'modules/common/icons';
import classNames from 'classnames';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import Styles from 'modules/common/buttons.styles.less';
import { AppState } from 'appStore';
import { MARKET_TEMPLATES } from 'modules/create-market/constants';
import type { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite';
import { addCategoryStats } from 'modules/create-market/get-template';
import ChevronFlip from 'modules/common/chevron-flip';
import { Link } from 'react-router-dom';
import { removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';

export interface DefaultButtonProps {
  id?: string;
  text?: string;
  action: Function;
  disabled?: boolean;
  title?: string;
  icon?: any;
  small?: boolean;
  noIcon?: boolean;
  subText?: string;
  pointDown?: boolean;
  URL?: string;
  status?: string;
  secondaryButton?: boolean;
  cancel?: Function;
  cancelButton?: boolean;
  confirmed?: boolean;
  failed?: boolean;
  submitTextButtton?: boolean;
  customConfirmedButtonText?: string;
  autoHideConfirm?: boolean;
  customPendingButtonText?: string;
  phantom?: boolean;
}

export interface SortButtonProps {
  text: string;
  action: Function;
  disabled?: boolean;
  sortOption: NEUTRAL | ASCENDING | DESCENDING;
}

export interface DirectionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  left?: boolean;
}

export interface DefaultActionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
}

export interface DaiPercentProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  showDai: boolean;
}

export interface OrderButtonProps extends DefaultButtonProps {
  type: BUY | SELL;
  initialLiquidity: Boolean;
}

export interface FavoritesButtonProps {
  isFavorite: boolean;
  hideText?: boolean;
  isSmall?: boolean;
  text?: string;
  action: Function;
  disabled?: boolean;
  title?: string;
}

export interface ViewTransactionDetailsButtonProps {
  transactionHash: string;
  label?: string;
  light?: boolean;
}

export interface ExternalLinkButtonProps {
  label: string;
  showNonLink?: boolean;
  action?: Function;
  URL?: string;
  light?: boolean;
  customLink?: any;
  callback?: Function;
}

export interface ExternalLinkTextProps {
  title?: string;
  label: string;
  URL: string;
}

export const PrimaryButton = (props: DefaultButtonProps) => (
  <>
    {props.URL && (
      <a href={props.URL} target="_blank" rel="noopener noreferrer">
        <button
          onClick={e => props.action(e)}
          className={Styles.PrimaryButton}
          disabled={props.disabled}
          title={props.title || props.text}
        >
          {props.text}
        </button>
      </a>
    )}
    {!props.URL && (
      <button
        onClick={e => props.action(e)}
        className={classNames(Styles.PrimaryButton, {
          [Styles.Confirmed]: props.confirmed,
          [Styles.Failed]: props.failed,
        })}
        disabled={props.disabled}
        title={props.title || props.text}
      >
        {props.text} {props.icon}
      </button>
    )}
  </>
);

export const RefreshButton = (props: DefaultButtonProps) => (
  <>
    <button
      onClick={e => props.action(e)}
      className={classNames(Styles.SecondaryButton,
        Styles.Small,
        Styles.Phantom,
      )}
      data-tip
      data-for={'refresh-tooltip'}
      data-place="top"
      data-iscapture={true}
      disabled={props.disabled}
      title={props.title || props.text}
    >
      {RefreshIcon}
    </button>
    <ReactTooltip
      id='refresh-tooltip'
      className={classNames(TooltipStyles.Tooltip, TooltipStyles.RefreshSort)}
      effect="solid"
      place="top"
      type="dark"
      event="mouseover mouseenter"
      eventOff="mouseleave mouseout scroll mousewheel blur"
    >
        <p>{'Refresh market sort by'}</p>
    </ReactTooltip>
  </>
);

export const SecondaryButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SecondaryButton, {
      [Styles.Small]: props.small,
      [Styles.Confirmed]: props.confirmed,
      [Styles.Failed]: props.failed,
      [Styles.Phantom]: props.phantom,
    })}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    {props.text}{!!props.icon && props.icon}
  </button>
);

export const ChatButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.ChatButton)}
    disabled={props.disabled}
  >
    Global Chat {ThickChevron}
  </button>
);

const ProcessingButtonComponent = (props: DefaultButtonProps) => {
  let isDisabled = props.disabled;
  let icon = props.icon;
  let buttonText = props.text;
  let buttonAction = props.action;
  if (
    props.status === TXEventName.Pending ||
    props.status === TXEventName.AwaitingSigning
  ) {
    buttonText = props.customPendingButtonText || 'Processing...';
    isDisabled = true;
  }
  const failed = props.status === TXEventName.Failure;
  const confirmed = props.status === TXEventName.Success;
  if (failed) buttonText = 'Failed';
  if (confirmed) {
    buttonText = 'Confirmed';

    if (props.customConfirmedButtonText) {
      buttonText = props.customConfirmedButtonText;
    }
  }
  if (failed || confirmed) {
    buttonAction = e => props.cancel(e);
    icon = XIcon;
    isDisabled = false;
  }

  if (props.autoHideConfirm) {
    if (confirmed) {
      icon = null;
      setTimeout(() => {
        props.cancel();
      }, 3000);
    }
  }

  return (
    <>
      {props.secondaryButton && (
        <SecondaryButton
          {...props}
          confirmed={confirmed}
          failed={failed}
          icon={icon}
          text={buttonText}
          action={buttonAction}
          disabled={isDisabled || props.disabled}
        />
      )}
      {!props.secondaryButton && !props.cancelButton && !props.submitTextButtton && (
        <PrimaryButton
          {...props}
          confirmed={confirmed}
          failed={failed}
          icon={icon}
          text={buttonText}
          action={buttonAction}
          disabled={isDisabled || props.disabled}
        />
      )}
      {props.submitTextButtton && (
        <SubmitTextButton
          {...props}
          confirmed={confirmed}
          failed={failed}
          text={buttonText}
          action={buttonAction}
          disabled={isDisabled || props.disabled}
        />
      )}
      {props.cancelButton && (
        <CancelTextButton
          {...props}
          confirmed={confirmed}
          failed={failed}
          icon={icon}
          text={buttonText}
          action={buttonAction}
          disabled={isDisabled || props.disabled}
        />
      )}
    </>
  );
};

const mapStateToPropsProcessingButton = (state: AppState, ownProps) => {
  const { pendingQueue } = state;
  let disabled = false;

  const pendingData =
    pendingQueue[ownProps.queueName] &&
    pendingQueue[ownProps.queueName][ownProps.queueId];

  let status = pendingData && pendingData.status;
  if (pendingData) {
    if (
      (ownProps.matchingId !== undefined && String(pendingData.data?.matchingId) !== String(ownProps.matchingId)) ||
      (ownProps.nonMatchingIds && ownProps.nonMatchingIds.length &&
        ownProps.nonMatchingIds.includes(pendingData.data.matchingId))
    ) {
      status = null;
      disabled = true;
    }
  }

  return {
    disabled: ownProps.disabled || disabled,
    status,
  };
};

const mapDispatchToPropsProcessingButton = (dispatch, ownProps) => ({
  cancel: () =>
    dispatch(removePendingData(ownProps.queueId, ownProps.queueName)),
});

export const ProcessingButton = connect(
  mapStateToPropsProcessingButton,
  mapDispatchToPropsProcessingButton
)(ProcessingButtonComponent);

export const PrimarySignInButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.PrimarySignInButton}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    <div>
      <div>{props.icon}</div>
      <div>
        <div>{props.text}</div>
        <div>{props.subText}</div>
      </div>
    </div>
  </button>
);

export const CloseButton = (props: DefaultButtonProps) => (
  <button
    className={Styles.CloseButton}
    onClick={e => props.action(e)}
    disabled={props.disabled}
  >
    {XIcon}
  </button>
);

export const BackButton = (props: DefaultButtonProps) => (
  <button
    className={Styles.BackButton}
    onClick={e => props.action(e)}
    disabled={props.disabled}
  >
    {BackIcon} back
  </button>
);

export const SecondarySignInButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SecondarySignInButton, {
      [Styles.Small]: props.small,
    })}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    <div>
      <div>{props.icon}</div>
      <div>
        <div>{props.text}</div>
        <div>{props.subText}</div>
      </div>
    </div>
  </button>
);

export const OrderButton = (props: OrderButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={
      props.type === BUY ? Styles.BuyOrderButton : Styles.SellOrderButton
    }
    disabled={props.disabled}
    title={props.title}
  >
    {props.initialLiquidity && 'Add Order'}
    {!props.initialLiquidity &&
      (props.type === BUY ? 'Place Buy Order' : 'Place Sell Order')}
  </button>
);

export const FavoritesButton = ({
  isFavorite,
  isSmall,
  action,
  disabled,
  title,
  hideText,
}: FavoritesButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.FavoriteButton, {
      [Styles.FavoriteButton_Favorite]: isFavorite,
      [Styles.FavoriteButton_small]: isSmall,
    })}
    disabled={disabled}
    title={title || 'Toggle Favorite'}
  >
    {StarIcon}
    {!hideText && `${isFavorite ? ' Remove from' : ' Add to'} watchlist`}
  </button>
);

export const CompactButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CompactButton}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
  </button>
);

export const DaiPercentButton = (props: DaiPercentProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.CompactButton, Styles.DaiPercentButton)}
    disabled={props.disabled}
    title={props.title}
  >
    {!props.showDai ? AlternateDaiLogoIcon : PercentIcon}
  </button>
);

interface ToggleExtendButtonProps {
  toggle: Function;
  hide?: boolean;
  extended?: boolean;
  disabled?: boolean;
}

export const ToggleExtendButton = (props: ToggleExtendButtonProps) => (
  <button
    onClick={e => props.toggle(e)}
    className={Styles.ToggleExtendButton}
    disabled={props.disabled}
  >
    {TwoArrowsOutline}
  </button>
);

export const CancelTextButton = ({
  text,
  action,
  title,
  disabled,
  confirmed,
  failed,
  icon,
}: DefaultButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.CancelTextButton, {
      [Styles.IconButton]: !text,
      [Styles.Confirmed]: confirmed,
      [Styles.Failed]: failed,
    })}
    disabled={disabled}
    title={title}
  >
    {text} {!icon && !text ? XIcon : icon}
  </button>
);

// Only used in ADVANCED button in trade-form
export const TextButtonFlip = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CancelTextButton}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
    <ChevronFlip
      pointDown={props.pointDown}
      stroke="#BFB8CE"
      filledInIcon
      instant
    />
  </button>
);

export const SubmitTextButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SubmitTextButton, {
      [Styles.Confirmed]: props.confirmed,
      [Styles.Failed]: props.failed,
    })}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
  </button>
);

export const DepositButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.PrimaryButton}
    disabled={props.disabled}
    title={props.title || 'Deposit'}
  >
    Add funds
  </button>
);

export const TransferButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CurrenyActionButton}
    disabled={props.disabled}
    title={props.title || 'Withdraw'}
  >
    Transfer
  </button>
);

export const WithdrawButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CurrenyActionButton}
    disabled={props.disabled}
    title={props.title || 'Withdraw'}
  >
    Withdraw
  </button>
);

export const ViewTransactionsButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.ViewTransactionsButton}
    disabled={props.disabled}
    title={props.title || 'View Transactions'}
  >
    View Transactions
    {DoubleArrowIcon}
  </button>
);

export const REPFaucetButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.REPFaucetButton}
    disabled={props.disabled}
    title={props.title || 'REPv2 Faucet'}
  >
    <span>{props.title ? props.title : 'REPv2 Faucet'}</span>
    {AugurLogo}
  </button>
);

export const FundGSNWalletButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.SecondaryButton}
    disabled={props.disabled}
    title={props.title ? props.title : 'Fund GSN Wallet'}
  >
  <span>{props.title}</span>
  </button>
);

export const DAIFaucetButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.DAIFaucetButton}
    disabled={props.disabled}
    title={props.title || 'DAI Faucet'}
  >
    <span>DAI Faucet</span>
    {DaiLogoIcon}
  </button>
);

export const ApprovalButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.DAIFaucetButton}
    disabled={props.disabled}
    title={props.title || 'Approval'}
  >
    <span>Approval</span>
  </button>
);

export const ExportButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.ExportButton}
    disabled={props.disabled}
    title={props.title || 'Export Complete History'}
  >
    Export Complete History
    {DownloadIcon}
  </button>
);

export const DirectionButton = (props: DirectionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.DirectionButton, {
      [Styles.left]: props.left,
    })}
    disabled={props.disabled}
    title={props.title}
  >
    {RotatableChevron}
  </button>
);

export const ViewTransactionDetailsButton = (
  props: ViewTransactionDetailsButtonProps
) => (
  <div
    className={classNames(Styles.ViewTransactionDetailsButton, {
      [Styles.Light]: props.light,
    })}
  >
    <EtherscanLink
      showNonLink
      txhash={props.transactionHash}
      label={props.label ? props.label : 'View'}
      showIcon
    />
  </div>
);

export const ExternalLinkText = (props: ExternalLinkTextProps) => (
  <button className={Styles.ExternalLinkText}>
    {props.URL && (
      <a href={props.URL} target="_blank" rel="noopener noreferrer">
        {props.title ? (
          <>
            <strong>{props.title}</strong>
            {props.label}
          </>
        ) : (
          props.label
        )}
      </a>
    )}

    {ViewIcon}
  </button>
);

export const ExternalLinkButton = (props: ExternalLinkButtonProps) => (
  <button
    className={classNames(Styles.ExternalLinkButton, {
      [Styles.LightAlternate]: props.light,
    })}
    onClick={e => {
      props.action && props.action(e);
      props.callback && props.callback();
    }}
  >
    {props.customLink ? (
      <Link to={props.customLink}>{props.label}</Link>
    ) : (
      <>
        {props.URL && (
          <a href={props.URL} target="_blank" rel="noopener noreferrer">
            {props.label}
          </a>
        )}
        {!props.URL && <span>{props.label}</span>}
      </>
    )}

    {!props.showNonLink && ViewIcon}
  </button>
);

export const SortButton = (props: SortButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SortButton, {
      [Styles.Ascending]: props.sortOption === ASCENDING,
      [Styles.Descending]: props.sortOption === DESCENDING,
    })}
    disabled={props.disabled}
  >
    {SortIcon}
    {props.text}
  </button>
);

export interface CategoryButtonsProps {
  action: Function;
  categoryStats: Getters.Markets.CategoryStats;
}

export const CategoryButtons = ({
  action,
  categoryStats = {},
}: CategoryButtonsProps) => (
  <div className={Styles.CategoryButtons}>
    {MARKET_TEMPLATES.map((item, idx) => {
      const hasData = Object.keys(categoryStats).length > 0;
      const card = addCategoryStats(null, item, categoryStats);
      return (
        <div key={idx} onClick={() => action(card.value.toLowerCase())}>
          <div>{item.icon}</div>
          <div>{item.header}</div>
          <div className={!hasData ? Styles.loading : ''}>
            {hasData ? card.description : ''}
          </div>
        </div>
      );
    })}
  </div>
);

export const FilterButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.FilterButton}
    disabled={props.disabled}
  >
    {"Categories & Filters"}
    {Filter}
  </button>
);

interface EtherscanLinkTSXProps {
  baseUrl?: string | null;
  txhash: string;
  label: string;
  showNonLink?: boolean;
  showIcon?: boolean;
}

const EtherscanLinkTSX = ({
  baseUrl,
  txhash,
  label,
  showNonLink,
  showIcon,
}: EtherscanLinkTSXProps) => (
  <span>
    {baseUrl && (
      <a href={baseUrl + txhash} target="_blank" rel="noopener noreferrer">
        {label}
        {showIcon && ViewIcon}
      </a>
    )}
    {!baseUrl && showNonLink && (
      <span>
        {label}
        {showIcon && ViewIcon}
      </span>
    )}
  </span>
);

EtherscanLinkTSX.defaultProps = {
  baseUrl: null,
  showNonLink: false,
};

const mapStateToPropsEtherScanLink = (state: AppState) => {
  const networkId = getNetworkId();

  if (!networkId) {
    return {};
  }

  const networkLink = {
    1: 'https://etherscan.io/tx/',
    3: 'https://ropsten.etherscan.io/tx/',
    4: 'https://rinkeby.etherscan.io/tx/',
    19: 'http://scan.thundercore.com/tx/',
    42: 'https://kovan.etherscan.io/tx/',
    103: 'https://localHasNoEtherscanLink/tx/',
  };

  return {
    baseUrl: networkLink[networkId],
  };
};

export const EtherscanLink = connect(mapStateToPropsEtherScanLink)(
  EtherscanLinkTSX
);
