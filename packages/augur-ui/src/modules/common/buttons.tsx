import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  NEUTRAL,
  ASCENDING,
  DESCENDING,
  BUY,
  SELL
} from "modules/common/constants";
import {
  StarIcon,
  XIcon,
  SortIcon,
  PercentIcon,
  QRCodeIcon,
  PaperAirplaneIcon,
  DoubleArrowIcon,
  RepLogoIcon,
  DaiLogoIcon,
  ViewIcon,
  DownloadIcon,
  RotatableChevron,
  Filter
} from "modules/common/icons";
import classNames from "classnames";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import Styles from "modules/common/buttons.styles.less";
import { AppState } from "store";

export interface DefaultButtonProps {
  id?: string;
  text?: string;
  action: Function;
  disabled?: boolean;
  title?: string;
  icon?: any;
  small?: boolean;
  noIcon?: boolean;
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

export interface EthPercentProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  showEth: boolean;
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
}

export interface ExternalLinkButtonProps {
  label: string;
  showNonLink?: boolean;
  action?: Function;
  URL?: string;
}

export const PrimaryButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.PrimaryButton}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    {props.text}
  </button>
);

export const SecondaryButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SecondaryButton, {[Styles.Small]: props.small})}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    {!!props.icon && props.icon}
    {props.text}
  </button>
);

export const OrderButton = (props: OrderButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={
      props.type === BUY
        ? Styles.BuyOrderButton
        : Styles.SellOrderButton
    }
    disabled={props.disabled}
    title={props.title}
  >
    {props.initialLiquidity && "Add Order"}
    {!props.initialLiquidity && (props.type === BUY ? "Place Buy Order" : "Place Sell Order")}
  </button>
);

export const FavoritesButton = (props: FavoritesButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.FavoriteButton, {
      [Styles.FavoriteButton_Favorite]: props.isFavorite,
      [Styles.FavoriteButton__small]: props.isSmall
    })}
    disabled={props.disabled}
    title={props.title}
    style={props.hideText ? { marginRight: "0.5rem" } : undefined}
  >
    {StarIcon}{" "}
    {!props.hideText &&
      `${props.isFavorite ? "Remove from" : "Add to"} watchlist`}
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

export const DaiPercentButton = (props: EthPercentProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.CompactButton, Styles.DaiPercentButton)}
    disabled={props.disabled}
    title={props.title}
  >
    {!props.showEth ? DaiLogoIcon : PercentIcon}
  </button>
);

export const CancelTextButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CancelTextButton}
    disabled={props.disabled}
    title={props.title}
  >
    {!props.noIcon && XIcon}
    {props.text}
  </button>
);

export const SubmitTextButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.SubmitTextButton}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
  </button>
);

export const DepositButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CurrenyActionButton}
    disabled={props.disabled}
    title={props.title || "Deposit"}
  >
    {QRCodeIcon}
    Receive
  </button>
);

export const WithdrawButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CurrenyActionButton}
    disabled={props.disabled}
    title={props.title || "Withdraw"}
  >
    {PaperAirplaneIcon}
    Send
  </button>
);

export const ViewTransactionsButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.ViewTransactionsButton}
    disabled={props.disabled}
    title={props.title || "View Transactions"}
  >
    {DoubleArrowIcon}
    View Transactions
  </button>
);

export const REPFaucetButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.REPFaucetButton}
    disabled={props.disabled}
    title={props.title || "REP Faucet"}
  >
    {RepLogoIcon}
    <span>REP Faucet</span>
  </button>
);

export const DAIFaucetButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.DAIFaucetButton}
    disabled={props.disabled}
    title={props.title || "DAI Faucet"}
  >
    {DaiLogoIcon}
    <span>DAI Faucet</span>
  </button>
);

export const ApprovalButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.DAIFaucetButton}
    disabled={props.disabled}
    title={props.title || "Approval"}
  >
    <span>Approval</span>
  </button>
);

export const ExportButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.ExportButton}
    disabled={props.disabled}
    title={props.title || "Export Complete History"}
  >
    {DownloadIcon}
    Export Complete History
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
  <div className={Styles.ViewTransactionDetailsButton}>
    {ViewIcon}
    <EtherscanLink showNonLink txhash={props.transactionHash} label="View" />
  </div>
);

export const ExternalLinkButton = (props: ExternalLinkButtonProps) => (
  <button
    className={Styles.ExternalLinkButton}
    onClick={e => props.action && props.action(e)}
  >
    {!props.showNonLink && ViewIcon}
    {props.URL && (
      <a href={props.URL} target="blank">
        {props.label}
      </a>
    )}
    {!props.URL && <span>{props.label}</span>}
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

export const FilterButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.FilterButton}
    disabled={props.disabled}
  >
    Filter Topics
    {Filter}
  </button>
);

interface EtherscanLinkTSXProps {
  baseUrl?: string | null;
  txhash: string;
  label: string;
  showNonLink?: boolean;
}

const EtherscanLinkTSX = ({
  baseUrl,
  txhash,
  label,
  showNonLink,
}: EtherscanLinkTSXProps) => (
  <span>
    {baseUrl && (
      <a href={baseUrl + txhash} target="blank">
        {label}
      </a>
    )}
    {!baseUrl && showNonLink && <span>{label}</span>}
  </span>
);

EtherscanLinkTSX.propTypes = {
  baseUrl: PropTypes.string,
  txhash: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  showNonLink: PropTypes.bool,
};

EtherscanLinkTSX.defaultProps = {
  baseUrl: null,
  showNonLink: false,
};

const mapStateToPropsEtherScanLink = (state: AppState) => {
  const networkId = getNetworkId();

  if (!networkId) {
    return null;
  }

  const networkLink = {
    1: "https://etherscan.io/tx/",
    3: "https://ropsten.etherscan.io/tx/",
    4: "https://rinkeby.etherscan.io/tx/",
    19: "http://scan.thundercore.com/tx/",
    42: "https://kovan.etherscan.io/tx/"
  };

  return {
    baseUrl: networkLink[networkId]
  };
};

export const EtherscanLink = connect(mapStateToPropsEtherScanLink)(
  EtherscanLinkTSX
);
