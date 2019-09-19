import React, { Component } from "react";
import classNames from "classnames";

import QRCode from "qrcode.react";
import Clipboard from "clipboard";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/tooltip.styles";
import { Checkbox, TextInput, InputDropdown } from "modules/common/form";
import {
  XIcon,
  CopyIcon,
  CheckCircleIcon,
} from "modules/common/icons";
import {
  DefaultButtonProps,
  PrimaryButton,
  SecondaryButton,
  SubmitTextButton,
  ExternalLinkButton,
} from "modules/common/buttons";
import {
  LinearPropertyLabel,
  LinearPropertyLabelProps,
  PendingLabel,
  ConfirmedLabel,
} from "modules/common/labels";
import Styles from "modules/modal/modal.styles.less";
import { PENDING, SUCCESS } from "modules/common/constants";

export interface TitleProps {
  title: string;
  closeAction: Function;
  bright?: boolean;
}

export interface DescriptionProps {
  description: Array<string>;
}

export interface ButtonsRowProps {
  buttons: Array<DefaultButtonProps>;
}

export interface AlertMessageProps {
  preText: string;
  boldText?: string;
  postText?: string;
}

export interface DescriptionMessageProps {
  messages: Array<AlertMessageProps>;
}

interface SubheaderContent {
  header: string;
  subheaders: Array<string>;
  numbered?: Boolean;
}

export interface SubheaderProps {
  subheaderContent: SubheaderContent;
}

export interface CallToActionProps {
  callToAction: string;
}

export interface BreakdownProps {
  rows: Array<LinearPropertyLabelProps>;
  title?: string;
  short?: boolean;
  reverse?: boolean;
}

export interface MarketTitleProps {
  title: string;
}

export interface SelectableTableRow {
  columns: Array<string | number>;
  action: Function;
}

export interface SelectableTableProps {
  tableData: Array<SelectableTableRow>;
}

export interface ActionRow {
  title: string;
  text: string;
  label: string;
  value: string;
  action: Function;
  status: typeof PENDING | typeof SUCCESS;
  properties: Array<{ value: string, label: string, addExtraSpace: boolean }>;
}

export interface ActionRowsProps {
  rows: Array<ActionRow>;
}

export interface ReadableAddressProps {
  address: string;
  copyable?: boolean;
  showQR?: boolean;
  title?: string;
}

export interface AccountAddressDisplayProps {
  address: string;
  copyable?: boolean;
}

export interface AccountAddressDisplayState {
  isCopied: boolean;
}

export interface MarketReviewProps {
  description: string;
  details: string;
  endTime: any;
  resolutionSource: string;
}

export interface MarketReviewState {
  readMore: boolean;
}

export interface CheckboxCTAProps {
  markModalAsSeen: Function;
  unmarkModalAsSeen: Function;
}

export interface CheckboxCTAState {
  didCheck: boolean;
}

export interface DepositInfoProps {
  openZeroExInstant: Function;
  airSwapOnClick: Function;
  show0xInstant: boolean;
  showAirSwap: boolean;
}

export interface ContentItem {
  header: string | null;
  paragraphs: Array<string>;
}

export interface ContentProps {
  content: Array<ContentItem>;
}

export interface PreviewItem {
  title: string;
  description: string;
}

export interface ExamplesProps {
  header: string;
  previews: Array<PreviewItem>;
}

export interface CategorySelectionProps {
  categoriesList: Array<string>;
  selectedCategory: string;
  save: Function;
}

export interface CategorySelectionState {
  showText: boolean;
  subCategory: string;
}

export class CategorySelection extends Component<CategorySelectionProps, CategorySelectionState> {
  state: CategorySelectionState = {
    showText: false,
    subCategory: ""
  };

  onChange(subCategory) {
    const { save } = this.props;
    save(subCategory);
    this.setState({ subCategory });
  }

  render() {
    const { categoriesList, selectedCategory, save } = this.props;
    const { showText } = this.state;

    return (
      <div className={Styles.CategorySelection}>
        <InputDropdown
          default={selectedCategory}
          label="Select sub-category"
          options={categoriesList}
          isMobileSmall={false}
          onChange={(subCategory) => {
            if (subCategory === "Other") {
              this.setState({ showText: true });
            } else {
              save(subCategory);
              this.setState({ showText: false, subCategory });
            }
          }}
        />
        {showText && <TextInput onChange={v => (this.onChange(v))} placeholder="Enter a sub-category" />}
      </div>
    );
  }
};

export const Content = ({ content }: ContentProps) => (
  <div className={Styles.Content}>
    {content.map(item => (
      <React.Fragment key={item.paragraphs[0].slice(20).replace(/\s+/g, "-")}>
        {!!item.header && <h5>{item.header}</h5>}
        {item.paragraphs.map(text => (
            <p key={text.slice(15).replace(/\s+/g, "_")}>{text}</p>
          ))
        }
      </React.Fragment>
    ))}
  </div>
);

export const Examples = ({ header, previews }: ExamplesProps) => (
  <div className={Styles.Examples}>
    <h5>{header}</h5>
    {previews.map(item => (
      <div key={item.title.slice(20).replace(/\s+/g, "-")}>
        <h6>{item.title}</h6>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
);

export const Title = (props: TitleProps) => (
  <header className={classNames(Styles.TitleHeader, {[Styles.Bright]: props.bright})}>
    <h1>{props.title}</h1>
    {props.closeAction && (
      <button onClick={() => props.closeAction()}>{XIcon}</button>
    )}
  </header>
);

export const Description = (props: DescriptionProps) =>
  props.description.map((descriptionText: string) => (
    <p key={descriptionText.slice(20).replace(/\s+/g, "-")}>{descriptionText}</p>
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
    {props.messages.map((message) => (
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

export const Subheader = (props: SubheaderProps) => (
  <div className={Styles.Subheader}>
    <span>{props.subheaderContent.header}</span>
    {props.subheaderContent.numbered && 
      <ol>
        {props.subheaderContent.subheaders.map((subheader, index) => (
          <li key={index}>
            {subheader}
          </li>
        ))}
      </ol>
    }
    {!props.subheaderContent.numbered && props.subheaderContent.subheaders.map((subheader, index) => (
      <span key={index}>
        {subheader}
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
          {row.properties.map((property) => (
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
    isCopied: false,
  };

  public componentWrapper: any = null;
  public clipboard: any = new Clipboard("#copy_address");

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
        ref={(container) => {
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

// tslint:disable-next-line: max-classes-per-file
export class MarketReview extends Component<
  MarketReviewProps,
  MarketReviewState
> {
  state = {
    readMore: false
  };

  render() {
    const { description, details, endTime, resolutionSource } = this.props;
    const { readMore } = this.state;

    const showReadMore = details && details.length > 126;
    const readMoreSection = showReadMore && (
      <div>
        {`${details.substr(0, 126)}...`}{" "}
        <button
          onClick={() => this.setState({ readMore: true })}
        >
          Read more
        </button>
      </div>
    );

    return (
      <section className={Styles.ModalMarketReview}>
          <div>
            <p>Market Question</p>
            {description}
          </div>

          {details && (
            <div>
              <p>Additional details</p>
              {showReadMore && !readMore && readMoreSection}
              {(!showReadMore || readMore) && <div>{details}</div>}
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
      </section>
    );
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CheckboxCTA extends Component<CheckboxCTAProps, CheckboxCTAState> {
  constructor(props: CheckboxCTAProps) {
    super(props);

    this.state = {
      didCheck: false,
    };

    this.checkCheckbox = this.checkCheckbox.bind(this);
  }

  checkCheckbox() {
    const { markModalAsSeen, unmarkModalAsSeen } = this.props;
    const { didCheck } = this.state;
    this.setState({ didCheck: !didCheck }, () => {
      if (this.state.didCheck) {
        markModalAsSeen();
      } else {
        unmarkModalAsSeen();
      }
    });
  }

  render() {
    const { didCheck } = this.state;

    return (
      <div
        className={Styles.CheckboxCTA}
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
            value={didCheck}
            isChecked={didCheck}
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
