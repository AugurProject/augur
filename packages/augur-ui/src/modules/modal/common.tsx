import React, { Component, useState, useEffect } from 'react';
import classNames from 'classnames';

import QRCode from 'qrcode.react';
import Clipboard from 'clipboard';
import { Checkbox, TextInput, InputDropdown } from 'modules/common/form';
import {
  XIcon,
  DaiLogoIcon,
  EthIcon,
  helpIcon,
  OnboardingCheckIcon,
  QRCodeIcon,
  InformationIcon,
  tokenUSDC,
  tokenUSDT,
  tokenEth,
  MobileNavCloseIcon,
  ExclamationCircle,
} from 'modules/common/icons';
import {
  DefaultButtonProps,
  PrimaryButton,
  SecondaryButton,
  ExternalLinkButton,
  ProcessingButton,
} from 'modules/common/buttons';
import {
  LinearPropertyLabel,
  LinearPropertyLabelProps,
} from 'modules/common/labels';
import Styles from 'modules/modal/modal.styles.less';
import { PENDING, SUCCESS, DAI, REP, USDC, USDT, FAILURE, ACCOUNT_TYPES, ETH, HELP_CENTER_ADD_FUNDS, HELP_CENTER_LEARN_ABOUT_ADDRESS, ON_BORDING_STATUS_STEP, TRANSACTIONS, SETAPPROVALFORALL, APPROVE } from 'modules/common/constants';
import { LinkContent, LoginAccount, FormattedNumber, AccountBalances } from 'modules/types';
import { DismissableNotice, DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { toChecksumAddress } from 'ethereumjs-util';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import ReactTooltip from 'react-tooltip';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import titleCase from 'utils/title-case';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import { formatDai, formatDai } from 'utils/format-number';
import { swap } from 'modules/swap/components/index.styles.less';

export interface TitleProps {
  title: string;
  closeAction: Function;
  bright?: boolean;
  subheader?: string;
}

export interface DescriptionProps {
  description: string[];
}

export interface DescriptionWithLinkProps {
  description: string[];
  link: string;
  label: string;
}

export interface ButtonsRowProps {
  buttons: Array<DefaultButtonProps>;
  checkBox?: CheckboxCTAProps;
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
  rows?: LinearPropertyLabelProps[];
  title?: string;
  short?: boolean;
  reverse?: boolean;
  footer?: LinearPropertyLabelProps;
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
  label: string | JSX.Element;
  value: string;
  notice?: string;
  action: Function;
  status: typeof PENDING | typeof SUCCESS | typeof FAILURE;
  properties: Array<{ value: string; label: string; addExtraSpace: boolean }>;
  queueName?: string;
  queueId?: string;
  estimateGas?: Function;
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

export const Description = ({description}: DescriptionProps) => {
  return description.join(' ').toString().split('\n').map((descriptionText: string) => (
    <p key={descriptionText.slice(20).replace(/\s+/g, '-')}>
      {descriptionText}
    </p>
  ));
};

export const DescriptionWithLink = (props: DescriptionWithLinkProps) => {
  const description = props.description.toString().split('\n').map((descriptionText: string) => (
    <p key={descriptionText.slice(20).replace(/\s+/g, '-')}>
      {descriptionText}
    </p>
  ));

  return (
    <div className={Styles.DescriptionWithLink}>
      {description}
      <a href={props.link} target="_blank">{props.label}</a>
    </div>
  );
};

export const ButtonsRow = (props: ButtonsRowProps) => (
  <div className={Styles.ButtonsRow}>
    {props.buttons.map((Button: DefaultButtonProps, index: number) => {
      if (Button.text === '') {
        return null;
      }

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

export interface LinkContentSectionProps {
  linkContent: LinkContent[];
}

export const LinkContentSection = ({ linkContent }: LinkContentSectionProps) => (
  <div className={Styles.LinkContentSection}>
    {linkContent.map((content, idx) => (
      <div key={idx}>
        {content.link && (
          <a href={content.link} target="_blank" rel="noopener noreferrer">
            <ExternalLinkButton label={content.content} />
          </a>
        )}
        {!content.link && <span>{content.content}</span>}
      </div>
    ))}
  </div>
);

interface InfoBubbleProps {
  icon: React.Fragment;
  children: React.Fragment;
}

export const InfoBubble = ({ icon, children } : InfoBubbleProps) => (
  <div className={Styles.InfoBubble}>
    {icon}
    {children}
  </div>
);

interface DepositProps {
  address: string;
}

export const Deposit = ({ address }: DepositProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    new Clipboard('#copy_address');
  }, []);

  const toggleCopied = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className={Styles.OnboardingDeposit}>
      Buy ETH from an exchange and send to your wallet address below
      (recommended):
      <div>
        {showQRCode && (
          <div onClick={() => setShowQRCode(false)}>
            {MobileNavCloseIcon()}
            <QRCode value={address} />
          </div>
        )}
      </div>
      <div>
        <div onClick={() => setShowQRCode(true)}>{QRCodeIcon}</div>
        <div>{`${address.substr(0, 9)}...${address.substr(
          address.length - 9,
          address.length
        )}`}</div>
      </div>
      {!isCopied && (
        <button
          id='copy_address'
          data-clipboard-text={address}
          onClick={() => toggleCopied()}
        >
          Copy your address
        </button>
      )}
      {isCopied && (
        <SecondaryButton disabled text='Copied!' action={() => null} />
      )}
      <div>
        Unsure of an crypto exchange? Try{' '}
        <a target='_blank' href='https://coinbase.com'>
          Coinbase
        </a>{' '}
        or{' '}
        <a target='_blank' href='https://Binance.com'>
          Binance
        </a>
      </div>
    </div>
  );
};

interface TokenSelectProps {
  balances: AccountBalances;
  handleSelection: Function;
  ethToDaiRate: number;
}

export const TokenSelect = ({
  balances,
  handleSelection,
  ethToDaiRate,
}: TokenSelectProps) => {
  const ethAmountInDai: FormattedNumber = formatDai(
    createBigNumber(balances?.signerBalances?.eth || 0).times(ethToDaiRate)
  );

  if (!ethAmountInDai) {
    return null;
  }

  const ethAmount = createBigNumber(balances?.signerBalances?.eth || 0);
  const usdcAmount = createBigNumber(balances?.signerBalances?.usdc || 0);
  const usdtAmount = createBigNumber(balances?.signerBalances?.usdt || 0);

  if (ethAmount.gt(0) && !usdcAmount.gt(0) && !usdtAmount.gt(0)) {
    handleSelection(ETH);
  }

  if (!ethAmount.gt(0) && !usdcAmount.gt(0) && !usdtAmount.gt(0)) {
    handleSelection(ETH);
  }

  return (
    <div className={Styles.OnboardingTokenSelect}>
      <div onClick={() => handleSelection(ETH)}>
        <div>{tokenEth} ETH</div>
        <div>
          <div>Wallet Balance:</div>
          <div>${ethAmountInDai.formattedValue}</div>
        </div>
      </div>

      {usdcAmount.gt(0) && <div onClick={() => handleSelection(USDC)}>
        <div>{tokenUSDC} USDC</div>
        <div>
          <div>Wallet Balance:</div>
          <div>${formatDai(usdcAmount).formatted}</div>
        </div>
      </div>}

      {usdtAmount.gt(0) && <div onClick={() => handleSelection(USDT)}>
        <div>{tokenUSDT} USDT</div>
        <div>
          <div>Wallet Balance:</div>
          <div>${formatDai(usdtAmount).formatted}</div>
        </div>
      </div>}
    </div>
  );
};

interface BankrollProps {
  approveModal: Function;
  swapModal: Function;
  token: string;
  triggerOnRamp: Function;
  accountType: string;
  hasBalanceOver50k: boolean;
}

export const Bankroll = ({
  swapModal,
  approveModal,
  token,
  accountType,
  triggerOnRamp,
  hasBalanceOver50k,
}: BankrollProps) => {
  const [show1InchExchange, setShow1InchExchange] = useState(false);
  const [showWalletOnRamp, setShowWalletOnRamp] = useState(false);
  const [showSwap, setShowSwap] = useState(false);

  if (!hasBalanceOver50k) {
    swapModal();
  }
  const isWalletProvider =
    [ACCOUNT_TYPES.FORTMATIC, ACCOUNT_TYPES.TORUS].includes(accountType) ||
    false;

  return (
    <div className={Styles.OnboardingBankroll}>
      <span>
        (This step is designed to guide you through the best way to acquire DAI
        for use within Augur){' '}
      </span>
      <div
        className={showSwap || showWalletOnRamp ? 'Selected' : 'NotSelected'}
        onClick={() => {
          if (isWalletProvider) {
            setShowWalletOnRamp(true);
            setShow1InchExchange(false);
            setShowSwap(false);
          } else {
            setShowSwap(true);
            setShowWalletOnRamp(false);
            setShow1InchExchange(false);
          }
        }}
      >
        $0 - 50k
      </div>
      {showSwap && (
        <div className={Styles.OnboardingBankroll1Inch}>
          <div>Use the in-app converter to convert {token} to DAI</div>
          <div>This is simpler to use but may have greater slippage</div>
          <PrimaryButton
            action={() => swapModal()}
            text={'In-app converter'}
          />
        </div>
      )}
      {showWalletOnRamp && (
        <div className={Styles.OnboardingBankroll1Inch}>
          <div>Buy DAI through your ETH wallet</div>
          <div>This is simpler to use but may have a greater slippage.</div>
          <PrimaryButton
            action={() => triggerOnRamp(DAI)}
            text={`Buy DAI through ${accountType}`}
          />
          <div onClick={() => approveModal()}>Continue</div>
        </div>
      )}
      {hasBalanceOver50k && (
        <div
          className={show1InchExchange ? 'Selected' : 'NotSelected'}
          onClick={() => {
            setShowWalletOnRamp(false);
            setShowSwap(false);
            setShow1InchExchange(true);
          }}
        >
          $50k+
        </div>
      )}
      {show1InchExchange && (
        <div className={Styles.OnboardingBankroll1Inch}>
          <div>Use 1inch.exchange to convert {token} to DAI</div>
          <div>Convert quantities greater than $50k at a lower slippage.</div>
          <ExternalLinkButton
            URL={'https://1inch.exchange'}
            label='1inch.exchange'
          />
          <div onClick={() => approveModal()}>Continue</div>
        </div>
      )}
      <span>
        <div>{ExclamationCircle}</div>
        <div>
          Due to current high gas prices it’s recommended you maintain a $50
          minimum worth of ETH.
        </div>
      </span>
    </div>
  );
};

interface ApprovalData {
  label: string;
  isApproved: boolean;
  action: Function;
}

interface ApprovalsProps {
  approvalData: ApprovalData[];
  currentApprovalStep: number;
}

export const Approvals = ({ currentApprovalStep, approvalData }: ApprovalsProps) => {
  const ApproveBox = (label, completed = false, handleApprove, idx) => (
    <div
      className={classNames(Styles.ApproveBox, {
        [Styles.ApproveBoxCompleted]: completed,
      })}
      key={idx}
    >
      <span>{label}</span>
      {completed ? (
        OnboardingCheckIcon
      ) : (
        idx === 0 && currentApprovalStep === 0 ?
          <ProcessingButton
            text={'Approve'}
            action={() => handleApprove()}
            queueName={TRANSACTIONS}
            queueId={APPROVE}
            skipConfirm={true}
          />
        : idx === 1 && currentApprovalStep === 1 ?
          <ProcessingButton
            text={'Approve'}
            action={() => handleApprove()}
            queueName={TRANSACTIONS}
            queueId={SETAPPROVALFORALL}
            skipConfirm={true}
          />
        : idx === 2 && currentApprovalStep === 2 ?
          <ProcessingButton
            text={'Approve'}
            action={() => handleApprove()}
            queueName={TRANSACTIONS}
            queueId={APPROVE}
            skipConfirm={true}
          />
        : <PrimaryButton disabled action={() => null} text={'Approve'} />
      )}
    </div>
  );

  return (
    <div className={Styles.OnboardingApprovals}>
      {approvalData.map((approval, idx) =>
        ApproveBox(approval.label, approval.isApproved, approval.action, idx)
      )}
      <div>
        {InformationIcon} There will be an additional approval if creating
        markets
      </div>
    </div>
  );
};

interface TransferMyDaiProps {
  walletType: string;
  tokenAmount: FormattedNumber;
  showTransferModal: Function;
  isCondensed: boolean;
  tokenName: string;
  autoClose?: boolean;
}

export const TransferMyTokens = ({ walletType, tokenAmount, showTransferModal, tokenName, isCondensed = false, autoClose = false }: TransferMyDaiProps) => {
  if (isCondensed) {
    return (
      <div className={Styles.TransferMyDaiCondensed}>
        <div>
          <span>{tokenAmount.formattedValue} {tokenName}</span>
          <span>in {walletType} wallet</span>
        </div>
        <SecondaryButton
          action={() => showTransferModal()}
          text={'Transfer to wallet address'}
        />
      </div>
    );
  }

  return (
    <div className={Styles.TransferMyTokens}>
      <div>
        <span>{tokenAmount.formattedValue} {titleCase(tokenName)} in your {walletType} wallet</span>
        <span>Transfer any amount to your wallet address.</span>
      </div>
      <PrimaryButton
        action={() => showTransferModal(autoClose)}
        text={`Transfer my ${titleCase(tokenName)}`}
      />
    </div>
  );
}

interface ConvertToDaiProps {
  walletType: string;
  balance: FormattedNumber;
  showAddFundsModal: Function;
  isCondensed: boolean;
  tokenName: string;
}

export const ConvertToDai = ({ walletType, balance, showAddFundsModal, isCondensed = false, tokenName}: ConvertToDaiProps) => {
  if (isCondensed) {
    return (
      <div className={Styles.TransferMyDaiCondensed}>
        <div>
          <span>{balance.formattedValue} {tokenName}</span>
          <span>in {walletType} wallet</span>
        </div>
        <SecondaryButton
          action={() => showAddFundsModal()}
          text={'Convert to DAI'}
        />
      </div>
    );
  }

  return (
    <div className={Styles.TransferMyDai}>
      <div>
        <span>{balance.formattedValue} {tokenName} in your {walletType} wallet</span>
        <span>Convert any amount of this to DAI.</span>
      </div>
      <PrimaryButton
        action={() => showAddFundsModal()}
        text={'Convert to DAI'}
      />
    </div>
  );
}

interface AccountStatusTrackerProps {
  accountStatusTracker: number;
}

export const AccountStatusTracker = ({ accountStatusTracker } :AccountStatusTrackerProps) => (
  <div className={Styles.AccountStatusTracker}>
    <div>
      <div className={classNames(Styles.AccountStep, {
        [Styles.AccountStepCompleted]: accountStatusTracker >= ON_BORDING_STATUS_STEP.ONE
      })}>
        {accountStatusTracker >= ON_BORDING_STATUS_STEP.ONE && OnboardingCheckIcon}
      </div>
      <div className={Styles.line}/>
      <div className={classNames(Styles.AccountStep, {
        [Styles.AccountStepCompleted]: accountStatusTracker >= ON_BORDING_STATUS_STEP.TWO
      })}>
        {accountStatusTracker >= ON_BORDING_STATUS_STEP.TWO && OnboardingCheckIcon}
      </div>
      <div className={Styles.line}/>
      <div className={classNames(Styles.AccountStep, {
        [Styles.AccountStepCompleted]: accountStatusTracker === ON_BORDING_STATUS_STEP.THREE
      })}>
        {accountStatusTracker === ON_BORDING_STATUS_STEP.THREE && OnboardingCheckIcon}
      </div>
    </div>

    <div>
      <div>Create log-in</div>
      <div>Add funds</div>
      <div>Activate account</div>
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
    {props.rows && props.rows.map((row: LinearPropertyLabelProps) => (
      <LinearPropertyLabel {...row} key={row.label} />
    ))}
    {props.footer && (
      <LinearPropertyLabel {...props.footer} key={props.footer.label} />
    )}
  </div>
);

export const ActionRows = ({ rows }: ActionRowsProps) => {
  const [estimatedRows, setEstimatedRows] = useState(rows);
  useEffect(() => {
    const timer = setTimeout(async () => {
      Promise.all(rows.map(async row => await row.estimateGas())).then(
        estimates => {
          const newRows = [...rows];
          estimates.map((estimate, index) => {
            newRows[index].properties = [
              ...rows[index].properties,
              estimate,
            ];
          });
          setEstimatedRows(newRows);
        }
      );
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    estimatedRows.map((row: ActionRow) => (
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
          {row.action &&
            <ProcessingButton
              text={row.text}
              queueName={row.queueName}
              queueId={row.queueId}
              action={row.action}
              submitTextButtton={true}
            />
          }
        </div>
        {row.notice && <DismissableNotice title={row.notice} description={''} show={true} buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE} />}
      </section>
    ))
  )
}


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
    <h3>How to (REPv2):</h3>
    <ul>
      <li>
        Buy REPv2 using{' '}
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
        Your purchased REPv2 will automatically appear in your connected wallet
      </li>
    </ul>
  </section>
);

export const AccountAddressDisplay = ({ address, copyable }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isTestnet, setIsTestnet] = useState(false);
  let timeoutId = null;

  const getIsTestnet = () => {
    const isMainnet = checkIfMainnet();
    setIsTestnet(!isMainnet);
  }

  const copyClicked = () => {
    setIsCopied(true);
    timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  useEffect(() => {
    new Clipboard('#copy_address');
    getIsTestnet();

    return function() {
      clearTimeout(timeoutId);
    }
  }, []);

  return (
    <>
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
      {isTestnet && <DismissableNotice error title="Warning: This is a Testnet" description="Do not send mainnet tokens to this address, they will be lost forever" show={true} buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE} />}
    </>
  );
}

interface FundsHelpProps {
  fundType: string;
}

export const FundsHelp = ({ fundType = DAI }: FundsHelpProps) => (
  <div className={Styles.FundsHelp}>
    <p>Need help?</p>
    <div>
      <span>Learn how to buy {fundType === DAI ? `DAI ($)` : fundType === REP ? 'REPv2' : fundType} {fundType === DAI ? generateDaiTooltip() : ''} and  send it to your wallet address.</span>
      <ExternalLinkButton URL={HELP_CENTER_ADD_FUNDS} label='Learn More' />
    </div>
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


interface CreditCardProps {
  accountMeta: LoginAccount['meta'];
  walletAddress: string;
  addFundsTorus: Function,
  addFundsFortmatic: Function,
  fundTypeLabel: string;
  fundTypeToUse: string;
  validateAndSet: Function;
  BUY_MIN: number;
  BUY_MAX: number;
  amountToBuy: BigNumber;
  isAmountValid: boolean;
}


export const CreditCard = ({
  accountMeta,
  walletAddress,
  addFundsTorus,
  addFundsFortmatic,
  fundTypeLabel,
  fundTypeToUse,
  validateAndSet,
  BUY_MIN,
  BUY_MAX,
  amountToBuy,
  isAmountValid,
}: CreditCardProps) => (
  <>
    <h1>Credit/debit card</h1>
    <h2>
      Add {fundTypeLabel} {fundTypeToUse === DAI ? generateDaiTooltip() : null}{' '}
      instantly
    </h2>

    <h3>Amount</h3>
    <TextInput
      placeholder='0'
      onChange={value => validateAndSet(Number(value))}
      value={String(amountToBuy)}
      innerLabel={fundTypeToUse === DAI ? 'USD' : fundTypeToUse}
    />
    {amountToBuy.gt(0) && !isAmountValid && (
      <div className={Styles.AddFundsError}>
        Sorry, amount must be between ${BUY_MIN} and ${BUY_MAX}.
      </div>
    )}

    {accountMeta.accountType === ACCOUNT_TYPES.TORUS && (
      <PrimaryButton
        disabled={!isAmountValid}
        action={() => addFundsTorus(amountToBuy, toChecksumAddress(walletAddress))}
        text={`Buy with ${accountMeta.accountType}`}
      />
    )}
    {accountMeta.accountType === ACCOUNT_TYPES.FORTMATIC && (
      <PrimaryButton
        disabled={!isAmountValid}
        action={() =>
          addFundsFortmatic(
            amountToBuy,
            fundTypeToUse,
            toChecksumAddress(walletAddress)
          )
        }
        text={`Buy with ${accountMeta.accountType}`}
      />
    )}
    <h4>
      {[
        ACCOUNT_TYPES.TORUS,
        ACCOUNT_TYPES.FORTMATIC,
      ].includes(accountMeta.accountType) && (
        <div>
          Buy {fundTypeLabel} with our secure payments partner,{' '}
          {accountMeta.accountType}. Funds will appear in your User account
          when payment finalizes.
        </div>
      )}
    </h4>
  </>
);

interface CoinbaseProps {
  walletAddress: string;
  fundTypeLabel: string;
  fundTypeToUse: string;
}


export const Coinbase = ({
  fundTypeToUse,
  fundTypeLabel,
  walletAddress,
}: CoinbaseProps) => (
  <>
    <h1>Coinbase</h1>
    <h2>
      Add{' '}
      {fundTypeToUse === DAI ? (
        <>
          {fundTypeLabel} {generateDaiTooltip()}
        </>
      ) : (
        fundTypeLabel
      )}{' '}
      using a Coinbase account
    </h2>
    <ol>
      <li>
        Login to your account at{' '}
        <a href='https://www.coinbase.com' target='_blank' rel="noopener noreferrer">
          www.coinbase.com
        </a>
      </li>
      <li>Buy the cryptocurrency {fundTypeLabel}</li>
      <li>
        Send the {fundTypeLabel} to your wallet address
      </li>
    </ol>
    <h3>wallet address</h3>
    <AccountAddressDisplay
      copyable
      address={toChecksumAddress(walletAddress)}
    />

  </>
);

interface TransferProps {
  walletAddress: string;
  fundTypeLabel: string;
  fundTypeToUse: string;
}

export const Transfer = ({
  fundTypeToUse,
  fundTypeLabel,
  walletAddress,
}: TransferProps) => (
  <>
    <h1>Transfer</h1>
    <h2>
      Send funds to your{' '}
      wallet address
    </h2>
    <ol>
      <li>
        Buy{' '}
        {fundTypeToUse === DAI ? (
          <>
            {fundTypeLabel} {generateDaiTooltip()}
          </>
        ) : (
          fundTypeLabel
        )}{' '}
        using an app or exchange - see our list of{' '}
        <a target='_blank' href={HELP_CENTER_ADD_FUNDS}>
          popular ways to buy {fundTypeLabel}
        </a>
      </li>
      <li>
        Transfer the {fundTypeLabel} to your wallet address
      </li>
    </ol>
    <h3>wallet address</h3>
    <AccountAddressDisplay
      copyable
      address={toChecksumAddress(walletAddress)}
    />
  </>
);

export const generateDaiTooltip = (
  tipText = 'Augur requires deposits in DAI ($), a currency pegged 1 to 1 to the US Dollar.'
) => {
  return (
    <span className={Styles.AddFundsToolTip}>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for='tooltip--confirm'
        data-iscapture={true}
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id='tooltip--confirm'
        className={TooltipStyles.Tooltip}
        effect='solid'
        place='top'
        type='light'
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>{tipText}</p>
      </ReactTooltip>
    </span>
  );
};
