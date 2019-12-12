import React, { Component, useState, useEffect } from 'react';
import classNames from 'classnames';

import QRCode from 'qrcode.react';
import Clipboard from 'clipboard';
import { Checkbox, TextInput, InputDropdown } from 'modules/common/form';
import {
  XIcon,
  LargeDollarIcon,
  LargeDaiIcon,
  DaiLogoIcon,
  EthIcon,
  ViewIcon,
} from 'modules/common/icons';
import {
  DefaultButtonProps,
  PrimaryButton,
  SecondaryButton,
  SubmitTextButton,
  ExternalLinkButton,
} from 'modules/common/buttons';
import {
  LinearPropertyLabel,
  LinearPropertyLabelProps,
  PendingLabel,
  ConfirmedLabel,
} from 'modules/common/labels';
import Styles from 'modules/modal/modal.styles.less';
import { PENDING, SUCCESS, DAI, FAILURE } from 'modules/common/constants';
import { LinkContent } from 'modules/types';
import { generateDaiTooltip } from 'modules/modal/add-funds';
import { DismissableNotice, DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';

export interface TitleProps {
  title: string;
  closeAction: Function;
  bright?: boolean;
  subheader?: string;
}

export interface DescriptionProps {
  description: string[];
}

export interface ButtonsRowProps {
  buttons: Array<DefaultButtonProps>;
}

export interface AlertMessageProps {
  key?: string;
  preText: string;
  boldText?: string;
  postText?: string;
}

export interface DescriptionMessageProps {
  messages: AlertMessageProps[];
}

interface SubheaderContent {
  header: string;
  subheaders: Array<string>;
  numbered?: Boolean;
}

export interface SubheaderProps {
  subheaderContent: SubheaderContent;
}

export interface BaseSubheaderProps {
  text: string;
}

export interface CallToActionProps {
  callToAction: string;
}

export interface BreakdownProps {
  rows: LinearPropertyLabelProps[];
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
  notice?: string;
  action: Function;
  status: typeof PENDING | typeof SUCCESS | typeof FAILURE;
  properties: Array<{ value: string; label: string; addExtraSpace: boolean }>;
}

export interface ActionRowsProps {
  rows: ActionRow[];
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

export class CategorySelection extends Component<
  CategorySelectionProps,
  CategorySelectionState
> {
  state: CategorySelectionState = {
    showText: false,
    subCategory: '',
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
          onChange={subCategory => {
            if (subCategory === 'Other') {
              this.setState({ showText: true });
            } else {
              save(subCategory);
              this.setState({ showText: false, subCategory });
            }
          }}
        />
        {showText && (
          <TextInput
            onChange={v => this.onChange(v)}
            placeholder="Enter a sub-category"
          />
        )}
      </div>
    );
  }
}

export const Content = ({ content }: ContentProps) => (
  <div className={Styles.Content}>
    {content.map(item => (
      <React.Fragment key={item.paragraphs[0].slice(20).replace(/\s+/g, '-')}>
        {!!item.header && <h5>{item.header}</h5>}
        {item.paragraphs.map(text => (
          <p key={text.slice(15).replace(/\s+/g, '_')}>{text}</p>
        ))}
      </React.Fragment>
    ))}
  </div>
);

export const Examples = ({ header, previews }: ExamplesProps) => (
  <div className={Styles.Examples}>
    <h5>{header}</h5>
    {previews.map(item => (
      <div key={item.title.slice(20).replace(/\s+/g, '-')}>
        <h6>{item.title}</h6>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
);

export const Title = (props: TitleProps) => (
  <header
    className={classNames(Styles.TitleHeader, {
      [Styles.Bright]: props.bright,
      [Styles.ShortBorder]: props.subheader
    })}
  >
    <h1>{props.title}</h1>
    {props.subheader &&
      <h2>{props.subheader}</h2>
    }
    {props.closeAction && (
      <button onClick={() => props.closeAction()}>{XIcon}</button>
    )}
  </header>
);

export const Description = (props: DescriptionProps) =>
  props.description.map((descriptionText: string) => (
    <p key={descriptionText.slice(20).replace(/\s+/g, '-')}>
      {descriptionText}
    </p>
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
      <span key={message.boldText || message.key}>
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
    {props.subheaderContent.numbered && (
      <ol>
        {props.subheaderContent.subheaders.map((subheader, index) => (
          <li key={index}>{subheader}</li>
        ))}
      </ol>
    )}
    {!props.subheaderContent.numbered &&
      props.subheaderContent.subheaders.map((subheader, index) => (
        <span key={index}>{subheader}</span>
      ))}
  </div>
);

export const LargeSubheader = (props: BaseSubheaderProps) => (
  <div className={Styles.LargeSubheader}>{props.text}</div>
);

export const SmallSubheader = (props: BaseSubheaderProps) => (
  <div className={Styles.SmallSubheader}>{props.text}</div>
);

export const MediumSubheader = (props: BaseSubheaderProps) => (
  <div className={Styles.MediumSubheader}>{props.text}</div>
);

interface LinkContentSectionProps {
  linkContent: LinkContent[];
}

export const LinkContentSection = ({ linkContent }: LinkContentSectionProps) => (
  <div className={Styles.LinkContentSection}>
    {linkContent.map((content, idx) => (
      <div key={idx}>
        {content.link && (
          <a href={content.link} target="_blank">
            <ExternalLinkButton label={content.content} />
          </a>
        )}
        {!content.link && <span>{content.content}</span>}
      </div>
    ))}
  </div>
);

interface StepperProps {
  currentStep: number,
  maxSteps: number,
}

export const Stepper = ({ currentStep, maxSteps }: StepperProps) => (
  <div className={Styles.Stepper}>
  {[...Array(maxSteps).keys()]
    .map(key => key + 1)
    .map((step, idx) => (
    <span key={idx} className={currentStep === step ? Styles.Current : null}></span>
  ))}
</div>
)

export const DaiGraphic = () => (
  <div className={Styles.DaiGraphic}>
    <div>
      {LargeDaiIcon}
      <span>1 dai</span>
    </div>
    <span>=</span>
    <div>
      {LargeDollarIcon}
      <span>1 USD</span>
    </div>
  </div>
);

export interface DaiEthSelectorProps {
  daiSelected: boolean;
  handleClick: Function;
}

export const DaiEthSelector = ({ handleClick, daiSelected}: DaiEthSelectorProps) => (
  <div className={Styles.DaiEthSelector}>
    <div onClick={() => handleClick(true)} className={classNames({ [Styles.selected]: daiSelected })}>{DaiLogoIcon} DAI</div>
    <div onClick={() => handleClick(false)} className={classNames({ [Styles.selected]: !daiSelected })}>{EthIcon} ETH</div>
  </div>
);

export const TestBet = (
  <img height='141px' src='images/test-bet.png' />
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
      [Styles.ReverseBreakdown]: props.reverse,
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
            <React.Fragment key={row.title + ' ' + property.label}>
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
        {row.status !== SUCCESS && <PendingLabel status={row.status} />}
        {row.status === SUCCESS && <ConfirmedLabel />}
        <SubmitTextButton
          disabled={row.status === SUCCESS || row.status === PENDING}
          text={row.text}
          action={row.action}
        />
      </div>
      {row.notice && <DismissableNotice title={row.notice} description={''} show={true} buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE} />}
    </section>
  ));

export const ReadableAddress = (props: ReadableAddressProps) => (
  <div className={Styles.ReadableAddress}>
    {props.title && <h4>{props.title}</h4>}
    {props.showQR && (
      <QRCode
        value={props.address}
        style={{ width: '120px', height: '120px' }}
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
        Buy ETH using{' '}
        <ExternalLinkButton
          label="Coinbase"
          URL="https://www.coinbase.com/buy/ETH"
        />{' '}
        or <ExternalLinkButton label="WYRE" URL="http://www.sendwyre.com/" /> or
        another provider
      </li>
      <li>Copy your connected wallet address shown here</li>
      <li>Transfer the ETH purchased to the copied address</li>
    </ul>
    <h3>How to (REP):</h3>
    <ul>
      <li>
        Buy REP using{' '}
        {props.show0xInstant && (
          <ExternalLinkButton
            label="0x Instant"
            action={props.openZeroExInstant}
          />
        )}
        {props.show0xInstant && props.showAirSwap && ' or '}
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

export const AccountAddressDisplay = ({ address, copyable }) => {
  const [isCopied, setIsCopied] = useState(false);
  let timeoutId = null;

  const copyClicked = () => {
    setIsCopied(true);
    timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  useEffect(() => {
    new Clipboard('#copy_address');

    return function() {
      clearTimeout(timeoutId);
    }
  }, []);

  return (
    <span className={Styles.AccountAddressDisplay}>
      <div>{address ? address : '-'}</div>
      {copyable && (
        <>
          <button
            id='copy_address'
            data-clipboard-text={address}
            onClick={() => copyClicked()}
            className={isCopied ? Styles.ShowConfirmaiton : null}
          >
            Copy
          </button>
        </>
      )}
    </span>
  );
}

interface FundsHelpProps {
  fundType: string;
}

export const FundsHelp = ({ fundType = DAI }: FundsHelpProps) => (
  <div className={Styles.FundsHelp}>
    <span>Need help?</span>
    <span>Learn how to buy {fundType === DAI ? `Dai ($)` : fundType} {fundType === DAI ? generateDaiTooltip() : ''} and  send it to your Augur account address.</span>
    <ExternalLinkButton URL='https://docs.augur.net/' label='Learn More' />
  </div>
);

// tslint:disable-next-line: max-classes-per-file
export class MarketReview extends Component<
  MarketReviewProps,
  MarketReviewState
> {
  state = {
    readMore: false,
  };

  render() {
    const { description, details, endTime } = this.props;
    const { readMore } = this.state;

    const showReadMore = details && details.length > 126;
    const readMoreSection = showReadMore && (
      <div>
        {`${details.substr(0, 126)}...`}{' '}
        <button onClick={() => this.setState({ readMore: true })}>
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
            <p>Resolution rules</p>
            {showReadMore && !readMore && readMoreSection}
            {(!showReadMore || readMore) && <div>{details}</div>}
          </div>
        )}

        {endTime && (
          <div>
            <p>Event Expiration</p>
            <div>{endTime.formattedUtc}</div>
            <div>{endTime.formattedLocalShortDateTimeWithTimezone}</div>
          </div>
        )}
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
