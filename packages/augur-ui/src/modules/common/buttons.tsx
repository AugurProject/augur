import React, { useEffect } from 'react';
import {
  ASCENDING,
  DESCENDING,
  BUY,
  BETTING_LAY,
  BETTING_BACK,
  THEMES,
  ZERO,
  MOBILE_MENU_STATES,
  REPORTING_STATE,
  CASHOUT,
  MODAL_CASHOUT_BET,
  MODAL_ADD_FUNDS,
  SELL_INDEX,
} from 'modules/common/constants';
import {
  StarIcon,
  StarIconSportsBetting,
  SortIcon,
  PercentIcon,
  DoubleArrowIcon,
  RepLogoIcon,
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
  AddIcon,
} from 'modules/common/icons';
import classNames from 'classnames';
import { getNetworkId, placeTrade } from 'modules/contracts/actions/contractCalls';
import Styles from 'modules/common/buttons.styles.less';
import { MARKET_TEMPLATES } from 'modules/create-market/constants';
import type { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite';
import { addCategoryStats } from 'modules/create-market/get-template';
import ChevronFlip from 'modules/common/chevron-flip';
import { Link } from 'react-router-dom';
import { getOrderShareProfitLoss } from 'utils/betslip-helpers';
import { removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';
import { useBetslipStore } from 'modules/trading/store/betslip';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai } from 'utils/format-number';
import { convertToOdds } from 'utils/get-odds';

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
  className?: string;
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
  hideText?: boolean;
  isSmall?: boolean;
  text?: string;
  marketId: string;
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
  condensedStyle?: boolean;
}

export interface ExternalLinkTextProps {
  title?: string;
  label: string;
  URL: string;
}

export const PrimaryButton = ({
  URL,
  action,
  disabled,
  title,
  text,
  confirmed,
  failed,
  icon,
  className
}: DefaultButtonProps) => (
  <>
    {URL && (
      <a href={URL} target="_blank" rel="noopener noreferrer">
        <button
          onClick={e => action(e)}
          className={Styles.PrimaryButton}
          disabled={disabled}
          title={title || text}
        >
          {text}
        </button>
      </a>
    )}
    {!URL && (
      <button
        onClick={e => action(e)}
        className={classNames(Styles.PrimaryButton, 
          className, {
          [Styles.Confirmed]: confirmed,
          [Styles.Failed]: failed,
        })}
        disabled={disabled}
        title={title || text}
      >
        {text} {icon}
      </button>
    )}
  </>
);

export const SecondaryButton = ({
  action,
  small,
  confirmed,
  failed,
  disabled,
  title,
  text,
  icon,
}: DefaultButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.SecondaryButton, {
      [Styles.Small]: small,
      [Styles.Confirmed]: confirmed,
      [Styles.Failed]: failed,
    })}
    disabled={disabled}
    title={title || text}
  >
    {text} {icon}
  </button>
);

export const ChatButton = ({ action, disabled }: DefaultButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.ChatButton)}
    disabled={disabled}
  >
    Global Chat {ThickChevron}
  </button>
);

export const ProcessingButton = (props: DefaultButtonProps) => {
  const { pendingQueue } = useAppStatusStore();
  let disabled = false;

  const pendingData =
    pendingQueue[props.queueName] &&
    pendingQueue[props.queueName][props.queueId];

  let status = pendingData && pendingData.status;
  if (pendingData) {
    if (
      (props.matchingId !== undefined &&
        String(pendingData.data?.matchingId) !== String(props.matchingId)) ||
      (props.nonMatchingIds &&
        props.nonMatchingIds.length &&
        props.nonMatchingIds.includes(pendingData.data.matchingId))
    ) {
      status = null;
      disabled = true;
    }
  }

  disabled = props.disabled || disabled;
  let isDisabled = disabled;
  let icon = props.icon;
  let buttonText = props.text;
  let buttonAction = props.action;
  if (
    status === TXEventName.Pending ||
    status === TXEventName.AwaitingSigning
  ) {
    buttonText = 'Processing...';
    isDisabled = true;
  }
  const failed = status === TXEventName.Failure;
  const confirmed = status === TXEventName.Success;
  if (failed) buttonText = 'Failed';
  if (confirmed) {
    buttonText = 'Confirmed';

    if (props.customConfirmedButtonText) {
      buttonText = props.customConfirmedButtonText;
    }
  }
  const cancel = () => removePendingData(props.queueId, props.queueName);
  if (failed || confirmed) {
    buttonAction = e => cancel(e);
    icon = XIcon;
    isDisabled = false;
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
          disabled={isDisabled}
        />
      )}
      {!props.secondaryButton &&
        !props.cancelButton &&
        !props.submitTextButtton && (
          <PrimaryButton
            {...props}
            confirmed={confirmed}
            failed={failed}
            icon={icon}
            text={buttonText}
            action={buttonAction}
            disabled={isDisabled}
          />
        )}
      {props.submitTextButtton && (
        <SubmitTextButton
          {...props}
          confirmed={confirmed}
          failed={failed}
          text={buttonText}
          action={buttonAction}
          disabled={isDisabled}
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
          disabled={isDisabled}
        />
      )}
    </>
  );
};

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
    {BackIcon} <span>back</span>
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
  marketId,
  isSmall,
  disabled,
  title,
  hideText,
}: FavoritesButtonProps) => {
  const {
    theme,
    favorites,
    actions: { toggleFavorite },
  } = useAppStatusStore();
  const isFavorite = !!favorites[marketId];
  return (
    <button
      onClick={e => toggleFavorite(marketId)}
      className={classNames(Styles.FavoriteButton, {
        [Styles.FavoriteButton_Favorite]: isFavorite,
        [Styles.FavoriteButton_small]: isSmall,
      })}
      disabled={disabled}
      title={title || 'Toggle Favorite'}
    >
      {theme !== THEMES.TRADING ? StarIconSportsBetting : StarIcon}
      {!hideText && `${isFavorite ? ' Remove from' : ' Add to'} watchlist`}
    </button>
  );
};

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


export const AddFundsButton = (props: DefaultActionButtonProps) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <PrimaryButton
      className={Styles.AddFundsButton}
      action={() => setModal({ type: MODAL_ADD_FUNDS })}
      text="Add Funds"
      icon={AddIcon}
    />
  );
}


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
    title={props.title || 'REP Faucet'}
  >
    <span>{props.title ? props.title : 'REP Faucet'}</span>
    {RepLogoIcon}
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
    <EtherscanLinkTSX
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

interface CashoutButtonProps {
  bet: Object;
}

export const CashoutButton = ({
  bet
}: CashoutButtonProps) => {
  let cashoutDisabled = true;
  let cashoutText = 'cashout not available';
  let didWin = bet.potentialDaiProfit ? createBigNumber(bet.potentialDaiProfit).gt(ZERO) : false;
  let loss = bet.potentialDaiProfit ? createBigNumber(bet.potentialDaiProfit).lt(ZERO) : false;
  let cashout = () => bet.cashout();

  const {
      accountPositions: positions,
      loginAccount: { address: account },
      pendingQueue,
      actions: { addPendingData, setModal }
  } = useAppStatusStore();
  const { marketInfos, orderBooks } = useMarketsStore();
  const {
    actions: { updateMatched }
  } = useBetslipStore();

  const queueId = `${bet.marketId}_${bet.orderId}`;
  const pending = pendingQueue[CASHOUT] && pendingQueue[CASHOUT][queueId];
  const market = marketInfos[bet.marketId];

  useEffect(() => {
    getOrderShareProfitLoss(bet, orderBooks, (potentialDaiProfit, topBidPrice, orderCost) => {
      updateMatched(bet.marketId, bet.orderId, {
        ...bet,
        topBidPrice,
        orderCost,
        potentialDaiProfit
      })
    })
  }, [marketInfos[bet.marketId], orderBooks[bet.marketId]]);

  const position = positions[bet.marketId]?.tradingPositions[bet.outcomeId];
  if (position?.priorPosition) {
    didWin = bet.closedPotentialDaiProfit ? createBigNumber(bet.closedPotentialDaiProfit).gt(ZERO) : false;
    loss = bet.closedPotentialDaiProfit ? createBigNumber(bet.closedPotentialDaiProfit).lt(ZERO) : false;
    cashoutText = (
      <>
       {didWin ? 'Won: ' : 'Loss: '} <span>{formatDai(bet.closedOrderCost).full}</span>
      </>
    );
  } else if (!bet.topBidPrice) {
    cashoutText = 'cashout not available';
  } else if (position && market?.reportingState !== REPORTING_STATE.AWAITING_FINALIZATION && market?.reportingState !== REPORTING_STATE.FINALIZED) {
      cashoutText = (
        <>
          Cashout <span>{bet.orderCost ? formatDai(bet.orderCost).full : '$0.00'}</span>
        </>
      );
      cashoutDisabled = false;
      cashout = () => {
        setModal({
          type: MODAL_CASHOUT_BET, 
          wager: bet.wager, 
          odds: convertToOdds(bet.normalizedPrice).full,
          cashOut: bet.orderCost,
          positive: bet.potentialDaiProfit.gt(ZERO),
          cb: () => {
            addPendingData(queueId, CASHOUT, TXEventName.Pending, '', {});
            (async () =>
              await placeTrade(
                SELL_INDEX,
                bet.marketId,
                market.numOutcomes,
                bet.outcomeId,
                true,
                market.numTicks,
                market.minPrice,
                market.maxPrice,
                bet.shares,
                bet.topBidPrice,
                0,
                '0',
                undefined
              ).catch(error => addPendingData(queueId, CASHOUT, TXEventName.Failure, '', {}))
          )();
        }});
    }
  }

  return (
    <>
      {pending && !position?.priorPosition ?
        <ProcessingButton
          queueName={CASHOUT}
          queueId={queueId}
          cancelButton
        />
        :
        <button 
          onClick={() => cashout()}
          className={classNames(Styles.CashoutButton, {
            [Styles.Won]: didWin && !loss,
            [Styles.Loss]: loss,
            [Styles.CashedOut]: position?.priorPosition,
            [Styles.CashoutAvailable]: !cashoutDisabled
          })}
          disabled={cashoutDisabled}
        >
          {cashoutText}
        </button>
      }
    </>
  );
};

export const ExternalLinkButton = ({
  light,
  condensedStyle,
  action,
  callback,
  customLink,
  label,
  URL,
  showNonLink,
}: ExternalLinkButtonProps) => (
  <button
    className={classNames(Styles.ExternalLinkButton, {
      [Styles.LightAlternate]: light,
      [Styles.CondensedStyle]: condensedStyle,
    })}
    onClick={e => {
      action && action(e);
      callback && callback();
    }}
  >
    {customLink ? (
      <Link to={customLink}>{label}</Link>
    ) : (
      <>
        {URL && (
          <a href={URL} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        )}
        {!URL && <span>{label}</span>}
      </>
    )}

    {!showNonLink && ViewIcon}
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

export const FilterButton = ({
  action = () => {},
  disabled,
  title,
}: DefaultActionButtonProps) => {
  const {
    actions: { setMobileMenuState },
  } = useAppStatusStore();
  return (
    <button
      onClick={() => setMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN)}
      className={Styles.FilterButton}
      disabled={disabled}
    >
      {title || 'Filters'}
      {Filter}
    </button>
  );
};

export interface BettingBackLayButtonProps {
  title?: string;
  text?: string;
  subText?: string;
  action: Function;
  disabled?: boolean;
  type: BETTING_LAY | BETTING_BACK;
}

export const BettingBackLayButton = ({
  title,
  text,
  subText,
  action,
  disabled,
  type,
}: BettingBackLayButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.BettingButton, {
      [Styles.Back]: type === BETTING_BACK,
      [Styles.Lay]: type === BETTING_LAY,
    })}
    disabled={disabled}
    title={title || text}
  >
    <div>{text}</div>
    <div>{subText}</div>
  </button>
);

interface EtherscanLinkTSXProps {
  txhash: string;
  label: string;
  showNonLink?: boolean;
  showIcon?: boolean;
}

const EtherscanLinkTSX = ({
  txhash,
  label,
  showNonLink,
  showIcon,
}: EtherscanLinkTSXProps) => {
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

  const baseUrl = networkLink[networkId];

  return (
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
};

EtherscanLinkTSX.defaultProps = {
  baseUrl: null,
  showNonLink: false,
};
