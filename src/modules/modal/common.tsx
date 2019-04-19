import React, { Component } from "react";
import classNames from "classnames";

import QRCode from "qrcode.react";
import Clipboard from "clipboard";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";
import Checkbox from "src/modules/common/components/checkbox/checkbox";
import {
  XIcon,
  CopyIcon,
  CheckCircleIcon
} from "modules/common-elements/icons";
import {
  DefaultButtonProps,
  PrimaryButton,
  SecondaryButton,
  SubmitTextButton,
  ExternalLinkButton
} from "modules/common-elements/buttons";
import {
  LinearPropertyLabel,
  LinearPropertyLabelProps,
  PendingLabel,
  ConfirmedLabel
} from "modules/common-elements/labels";
import Styles from "modules/modal/modal.styles";
import { PENDING, SUCCESS } from "modules/common-elements/constants";

interface TitleProps {
  title: string;
  closeAction: Function;
}

interface DescriptionProps {
  description: Array<string>;
}

interface ButtonsRowProps {
  buttons: Array<DefaultButtonProps>;
}

interface AlertMessageProps {
  preText: string;
  boldText?: string;
  postText?: string;
}

interface DescriptionMessageProps {
  messages: Array<AlertMessageProps>;
}

interface CallToActionProps {
  callToAction: string;
}

interface BreakdownProps {
  rows: Array<Array<LinearPropertyLabelProps>>;
  title?: string;
  short?: boolean;
  reverse?: boolean;
}

interface MarketTitleProps {
  title: string;
}

interface SelectableTableRow {
  columns: Array<string | number>;
  action: Function;
}

interface SelectableTableProps {
  tableData: Array<SelectableTableRow>;
}

interface ActionRow {
  title: string;
  text: string;
  label: string;
  value: string;
  action: Function;
  status?: boolean;
}

interface ActionRowsProps {
  rows: Array<ActionRow>;
}

interface ReadableAddressProps {
  address: string;
  copyable?: boolean;
  showQR?: boolean;
  title?: string;
}

interface AccountAddressDisplayProps {
  address: string;
  copyable?: boolean;
}

interface AccountAddressDisplayState {
  isCopied: boolean;
}

interface MarketReviewProps {
  description: string;
  details: string;
  endTime: any;
  resolutionSource: string;
}

interface MarketReviewState {
  readMore: boolean;
}

interface CheckboxCTAProps {
  markModalAsSeen: Function;
  unmarkModalAsSeen: Function;
}

interface CheckboxCTAState {
  didCheck: boolean;
}

export interface DepositInfoProps {
  openZeroExInstant: Function;
  airSwapOnClick: Function;
  show0xInstant: boolean;
  showAirSwap: boolean;
}

export const Title = (props: TitleProps) => (
  <header className={Styles.TitleHeader}>
    <h1>{props.title}</h1>
    {props.closeAction && (
      <button onClick={() => props.closeAction()}>{XIcon}</button>
    )}
  </header>
);

export const Description = (props: DescriptionProps) =>
  props.description.map((descriptionText: string) => (
    <p key={descriptionText.slice(20).replace(" ", "-")}>{descriptionText}</p>
  ));

export const ButtonsRow = (props: ButtonsRowProps) => (
  <div className={Styles.ButtonsRow}>
    {props.buttons.map((Button: DefaultButtonProps, index: number) => {
      if (index === 0) return <PrimaryButton key={Button.text} {...Button} />;
      return <SecondaryButton key={Button.text} {...Button} />;
    })}
  </div>
);

export const DescriptionMessage = (props: DescriptionMessageProps) => (
  <div className={Styles.DescriptionMessage}>
    {props.messages.map(message => (
      <span key={message.boldText}>
        {message.preText}
        {message.boldText && (
          <b>
            &nbsp;
            {message.boldText}
            &nbsp;
          </b>
        )}
        {message.postText}
      </span>
    ))}
  </div>
);

export const AlertMessage = (props: AlertMessageProps) => (
  <div className={Styles.AlertMessage}>
    {props.preText}
    {props.boldText && (
      <b>
        &nbsp;
        {props.boldText}
        &nbsp;
      </b>
    )}
    {props.postText}
  </div>
);

export const MarketTitle = (props: MarketTitleProps) => <h2>{props.title}</h2>;

export const CallToAction = (props: CallToActionProps) => (
  <h3>{props.callToAction}</h3>
);

export const SelectableTable = (props: SelectableTableProps) => (
  <div className={Styles.SelectableTable}>
    {props.tableData.map((row: SelectableTableRow) => (
      <button key={`row_${row.columns[0]}`} onClick={() => row.action()}>
        {row.columns.map((columnText: string | number) => (
          <span key={`col_${columnText}`}>{columnText}</span>
        ))}
      </button>
    ))}
  </div>
);

export const Breakdown = (props: BreakdownProps) => (
  <div
    className={classNames({
      [Styles.ShortBreakdown]: props.short,
      [Styles.ReverseBreakdown]: props.reverse
    })}
  >
    {props.title && <h4>{props.title}</h4>}
    {props.rows.map((row: LinearPropertyLabelProps) => (
      <LinearPropertyLabel {...row} key={row.label} />
    ))}
  </div>
);

export const ActionRows = (props: ActionRowsProps) =>
  props.rows.map((row: ActionRow) => (
    <section key={row.title} className={Styles.ActionRow}>
      <section>
        <MarketTitle title={row.title} />
        <div>
          {row.properties.map(property => (
            <React.Fragment key={row.title + " " + property.label}>
              <LinearPropertyLabel
                label={property.label}
                value={property.value}
              />
              {property.addExtraSpace && <span />}
            </React.Fragment>
          ))}
        </div>
      </section>
      <div>
        {row.status === PENDING && <PendingLabel />}
        {row.status === SUCCESS && <ConfirmedLabel />}
        <SubmitTextButton
          disabled={row.status === SUCCESS || row.status === PENDING}
          text={row.text}
          action={row.action}
        />
      </div>
    </section>
  ));

export const ReadableAddress = (props: ReadableAddressProps) => (
  <div className={Styles.ReadableAddress}>
    {props.title && <h4>{props.title}</h4>}
    {props.showQR && (
      <QRCode
        value={props.address}
        style={{ width: "120px", height: "120px" }}
      />
    )}
    <AccountAddressDisplay address={props.address} copyable={props.copyable} />
  </div>
);

// for 1.13 we don't need the help section because we haven't written it up in the docs yet.
// <h3>Need Help?</h3>
// <p>Read our help articles on "How to buy eth and rep"</p>
export const DepositInfo = (props: DepositInfoProps) => (
  <section className={Styles.DepositInfo}>
    <h3>How to (ETH):</h3>
    <ul>
      <li>
        Buy ETH using{" "}
        <ExternalLinkButton
          label="Coinbase"
          URL="https://www.coinbase.com/buy/ETH"
        />{" "}
        or <ExternalLinkButton label="WYRE" URL="http://www.sendwyre.com/" /> or
        another provider
      </li>
      <li>Copy your connected wallet address shown here</li>
      <li>Transfer the ETH purchased to the copied address</li>
    </ul>
    <h3>How to (REP):</h3>
    <ul>
      <li>
        Buy REP using{" "}
        {props.show0xInstant && (
          <ExternalLinkButton
            label="0x Instant"
            action={props.openZeroExInstant}
          />
        )}
        {props.show0xInstant && props.showAirSwap && " or "}
        {props.showAirSwap && (
          <ExternalLinkButton label="AirSwap" action={props.airSwapOnClick} />
        )}
      </li>
      <li>
        Your purchased REP will automatically appear in your connected wallet
      </li>
    </ul>
  </section>
);

export class AccountAddressDisplay extends Component<
  AccountAddressDisplayProps,
  AccountAddressDisplayState
> {
  state: AccountAddressDisplayState = {
    isCopied: false
  };

  componentWrapper: any = null;
  clipboard: any = new Clipboard("#copy_address");

  copyClicked = () => {
    this.setState({ isCopied: true }, () => {
      setTimeout(() => {
        if (this.componentWrapper) this.setState({ isCopied: false });
      }, 3000);
    });
  };

  render() {
    const { isCopied } = this.state;
    const { address, copyable } = this.props;
    return (
      <span
        ref={container => {
          this.componentWrapper = container;
        }}
        className={Styles.AccountAddressDisplay}
      >
        {address}
        {copyable && (
          <>
            <button
              id="copy_address"
              data-clipboard-text={address}
              onClick={this.copyClicked}
              data-tip
              data-for="AccountAddressDisplay_copy_tooltip"
            >
              {isCopied ? CheckCircleIcon : CopyIcon}
            </button>
            {isCopied && (
              <ReactTooltip
                id="AccountAddressDisplay_copy_tooltip"
                className={TooltipStyles.Tooltip}
                effect="solid"
                place="top"
                type="light"
                event="mouseover"
                eventOff="mouseleave"
              >
                Copied
              </ReactTooltip>
            )}
          </>
        )}
      </span>
    );
  }
}

export class MarketReview extends Component<
  MarketReviewProps,
  MarketReviewState
> {
  state = {
    readMore: false
  };

  render() {
    const { description, details, endTime, resolutionSource } = this.props;

    const showReadMore = details && details.length > 126;
    const readMore = showReadMore && (
      <div>
        {`${details.substr(0, 126)}...`}{" "}
        <button
          onClick={() => this.setState({ readMore: true })}
          className={Styles.ModalMarketReview__ReadMore}
        >
          Read more
        </button>
      </div>
    );

    return (
      <section className={Styles.ModalMarketReview}>
        <div className={Styles.ModalMarketReview__TextBox}>
          <div>
            <p>Market Question</p>
            {description}
          </div>

          {details && (
            <div>
              <p>Additional details</p>
              {showReadMore && !this.state.readMore && readMore}
              {(!showReadMore || this.state.readMore) && <div>{details}</div>}
            </div>
          )}

          {endTime && (
            <div>
              <p>Reporting starts</p>
              <div>{endTime.formattedUtc}</div>
              <div>{endTime.formattedTimezone}</div>
            </div>
          )}

          <div>
            <p>Resolution source</p>
            {resolutionSource || "General knowledge"}
          </div>
        </div>
      </section>
    );
  }
}

export class CheckboxCTA extends Component<CheckboxCTAProps, CheckboxCTAState> {
  constructor(props: CheckboxCTAProps) {
    super(props);

    this.state = {
      didCheck: false
    };

    this.checkCheckbox = this.checkCheckbox.bind(this);
  }

  checkCheckbox() {
    this.setState({ didCheck: !this.state.didCheck }, () => {
      if (this.state.didCheck) {
        this.props.markModalAsSeen();
      } else {
        this.props.unmarkModalAsSeen();
      }
    });
  }

  render() {
    return (
      <div
        className={Styles.CheckboxCTA__checkbox}
        role="button"
        tabIndex={0}
        onClick={(e: React.SyntheticEvent) => {
          e.preventDefault();
          this.checkCheckbox();
        }}
      >
        <label htmlFor="marketReview">
          <Checkbox
            id="marketReview"
            type="checkbox"
            value={this.state.didCheck}
            isChecked={this.state.didCheck}
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              this.checkCheckbox();
            }}
          />
          Don’t show this message on any more markets
        </label>
      </div>
    );
  }
}
