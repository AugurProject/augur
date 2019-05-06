import React from "react";
import * as constants from "modules/common-elements/constants";
import {
  StarIcon,
  XIcon,
  SortIcon,
  EthIcon,
  PercentIcon,
  QRCodeIcon,
  PaperAirplaneIcon,
  DoubleArrowIcon,
  RepLogoIcon,
  ViewIcon,
  DownloadIcon,
  RotatableChevron,
  Filter
} from "modules/common-elements/icons";
import classNames from "classnames";
import EtherscanLink from "modules/common/containers/etherscan-link";

import Styles from "modules/common-elements/buttons.styles";

export interface DefaultButtonProps {
  text: string;
  action: Function;
  disabled?: boolean;
  title?: string;
}

export interface SortButtonProps {
  text: string;
  action: Function;
  disabled?: boolean;
  sortOption: constants.NEUTRAL | constants.ASCENDING | constants.DESCENDING;
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
  type: constants.BUY | constants.SELL;
}

export interface FavoritesButtonProps extends DefaultButtonProps {
  isFavorite: boolean;
  hideText?: boolean;
  isSmall?: boolean;
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
    className={Styles.SecondaryButton}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    {props.text}
  </button>
);

export const OrderButton = (props: OrderButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={
      props.type === constants.BUY
        ? Styles.BuyOrderButton
        : Styles.SellOrderButton
    }
    disabled={props.disabled}
    title={props.title}
  >
    {props.type === constants.BUY ? "Place Buy Order" : "Place Sell Order"}
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

export const EthPercentButton = (props: EthPercentProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.CompactButton, Styles.EthPercentButton)}
    disabled={props.disabled}
    title={props.title}
  >
    {!props.showEth ? EthIcon : PercentIcon}
  </button>
);

export const CancelTextButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CancelTextButton}
    disabled={props.disabled}
    title={props.title}
  >
    {XIcon}
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
      [Styles.left]: props.left
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
      [Styles.Ascending]: props.sortOption === constants.ASCENDING,
      [Styles.Descending]: props.sortOption === constants.DESCENDING
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
