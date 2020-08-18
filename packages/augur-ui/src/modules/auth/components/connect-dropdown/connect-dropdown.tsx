import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Clipboard from 'clipboard';
import classNames from 'classnames';
import { ACCOUNT_TYPES, TRADE_ORDER_GAS_MODAL_ESTIMATE, GWEI_CONVERSION,ETH, DAI, FEE_RESERVES_LABEL, REP } from 'modules/common/constants';
import {
  EthIcon,
  helpIcon,
  LogoutIcon,
  Open,
  Pencil,
  ClipboardCopy,
  AugurLogo,
  WethIcon as WethIcon,
} from 'modules/common/icons';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { formatEther, formatRep, } from 'utils/format-number';
import { AccountBalances, FormattedNumber } from 'modules/types';
import ModalMetaMaskFinder from 'modules/modal/components/common/modal-metamask-finder';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';
import { getGasCost } from 'modules/modal/gas';
import { BigNumber } from 'utils/create-big-number';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/auth/components/connect-dropdown/connect-dropdown.styles.less';
import { WrapUnwrapEth } from 'modules/modal/common';

interface ConnectDropdownProps {
  isLogged: boolean;
  restoredAccount: boolean;
  logout: Function;
  accountMeta: {
    accountType: string;
    openWallet: Function;
    email?: string;
  };
  balances: AccountBalances;
  gasModal: Function;
  averageGasPrice: number;
  userDefinedGasPrice: number;
  gasPriceSpeed: number;
  gasPriceTime: string;
  gasPrice: BigNumber;
  showAddFundsModal: Function;
  universeSelectorModal: Function;
  universeOutcomeName: string;
  parentUniverseId: string;
  universeHasChildren: boolean;
  GsnEnabled: boolean;
  ethToDaiRate: FormattedNumber;
  loginAccountAddress: string;
  reserveEthAmount: FormattedNumber;
  showTransferMyDai: boolean;
  showTransferMyRep: boolean;
  showWrapEther?: boolean;
  showWrapAddFundsModal?: Function;
  walletType?: string;
}

const ConnectDropdown = (props: ConnectDropdownProps) => {
  const {
    isLogged,
    restoredAccount,
    userDefinedGasPrice,
    accountMeta,
    gasPriceSpeed,
    gasPriceTime,
    gasModal,
    balances,
    showAddFundsModal,
    universeSelectorModal,
    universeOutcomeName,
    parentUniverseId,
    universeHasChildren,
    GsnEnabled,
    ethToDaiRate,
    loginAccountAddress,
    showWrapEther,
    showWrapAddFundsModal,
    walletType,
  } = props;

  const [showMetaMaskHelper, setShowMetaMaskHelper] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const gasCostDai = getGasCost(TRADE_ORDER_GAS_MODAL_ESTIMATE, userDefinedGasPrice, ethToDaiRate);

  if (!isLogged && !restoredAccount) return null;

  let timeoutId = null;
  const referralLink = `${window.location.origin}?${AFFILIATE_NAME}=${loginAccountAddress}`;

  const copyClicked = () => {
    setIsCopied(true);
    timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    new Clipboard('#copy_referral');

    return function() {
      clearTimeout(timeoutId);
    };
  }, []);

  const logout = () => {
    const { logout } = props;
    logout();
  };

  const renderToolTip = (id: string, content: JSX.Element) => (
    <span>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={id}
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id={id}
        className={TooltipStyles.Tooltip}
        effect='solid'
        place='top'
        type='light'
        data-event="mouseover mouseenter"
        data-eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        {content}
      </ReactTooltip>
    </span>
  );

  const accountFunds = [
    {
      value: formatEther(balances.weth, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formatted,
      name: 'WETH',
      logo: WethIcon,
      wrapped: true,
      disabled: GsnEnabled ? balances.weth === "0" : false,
    },
    {
      value: formatEther(balances.eth, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formatted,
      name: 'ETH',
      logo: EthIcon,
      disabled: GsnEnabled ? balances.eth === "0" : false,
    },
    {
      name: 'REPv2',
      logo: AugurLogo,
      value: formatRep(balances.rep, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formatted,
      disabled: GsnEnabled ? balances.rep === "0" : false,
    },
  ];

  const walletProviders = [
    {
      accountType: ACCOUNT_TYPES.PORTIS,
      action: () => accountMeta.openWallet(),
      disabled: !accountMeta.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.FORTMATIC,
      action: () => accountMeta.openWallet(),
      disabled: !accountMeta.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.TORUS,
      action: () => accountMeta.openWallet(),
      disabled: !accountMeta.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.WEB3WALLET,
      action: () => setShowMetaMaskHelper(true),
    },
  ];

  const referralTooltipContent = (
    <div>
      <p>Referral Link</p>
      <p>
        Invite friends to Augur using this link and collect a portion of the
        market fees whenever they trade in markets.
      </p>
    </div>)

  return (
    <div onClick={event => event.stopPropagation()}>
      {showMetaMaskHelper && (
        <ModalMetaMaskFinder handleClick={() => setShowMetaMaskHelper(false)} />
      )}
      <div className={Styles.AccountInfo}>

        <div className={Styles.MobileAddFunds}>
          <PrimaryButton action={() => showAddFundsModal()} text='Add Funds' />
        </div>

        <div className={Styles.AddFunds}>
          <div></div>
          <PrimaryButton action={() => showAddFundsModal()} text='Add Funds' />
        </div>

        {showWrapEther && <WrapUnwrapEth walletType={walletType} tokenName={ETH} tokenAmount={formatEther(balances.eth)} isCondensed={true} showConvertModal={showWrapAddFundsModal} />}

        {accountFunds
          .filter(fundType => !fundType.disabled)
          .map((fundType, idx) => (
            <div key={idx} className={classNames(Styles.AccountFunds, {
              [Styles.Wrapped]: fundType.wrapped
            })}>
              {fundType.logo} {fundType.name}
              <div>
                  {fundType.value} {fundType.name}
              </div>
            </div>
          ))}
        {walletProviders
          .filter(wallet => wallet.accountType === accountMeta.accountType)
          .map((wallet, idx) => {
            return (
              <div
                key={idx}
                className={classNames(Styles.WalletProvider, {
                  [Styles.MetaMask]:
                    wallet.accountType === ACCOUNT_TYPES.WEB3WALLET,
                })}
              >
                <div>
                  <div>
                    Wallet provider
                    {renderToolTip(
                      'tooltip--walleProvider',
                      <p>
                        Your wallet provider allows you to create a private and
                        secure account for accessing and using Augur.
                      </p>
                    )}
                  </div>
                  <div>
                    {wallet.accountType}{' '}
                    {accountMeta.email ? `(${accountMeta.email})` : null}
                  </div>
                </div>
                <SecondaryButton
                  action={() => wallet.action()}
                  text='Open'
                  icon={Open}
                  disabled={wallet.disabled}
                />
              </div>
            );
          })}

        {gasCostDai.value && <div className={Styles.GasEdit}>
          <div>
            <div>
              <div>
                Transaction fee
                {renderToolTip(
                  'tooltip--gasEdit',
                  <p>The fee for processing your transactions.</p>
                )}
              </div>
              <div>
                ${gasCostDai.formattedValue} / Trade ({gasPriceSpeed} {gasPriceTime})
              </div>
            </div>
          </div>
          <SecondaryButton
            action={() => gasModal()}
            text='Edit'
            icon={Pencil}
          />
        </div>}

        <div className={Styles.GasEdit}>
          <div>
            <div>
              <div>
                Refer a friend
                {renderToolTip('tooltip--referral', referralTooltipContent)}
              </div>
              <div>{referralLink}</div>
            </div>
          </div>
          <button
            id='copy_referral'
            data-clipboard-text={referralLink}
            onClick={() => copyClicked()}
            className={isCopied ? Styles.ShowConfirmaiton : null}
          >
            Copy {ClipboardCopy}
          </button>
        </div>

        {(parentUniverseId !== null || universeHasChildren) && (
          <div className={Styles.WalletProvider}>
            <div>
              <div>Universe</div>
              <div>{universeOutcomeName}</div>
            </div>
            <SecondaryButton
              action={() => universeSelectorModal()}
              text='CHANGE UNIVERSE'
            />
          </div>
        )}

        <div className={Styles.Logout}>
          <div onClick={() => logout()}>
            <div>Logout</div>
            <div>{LogoutIcon()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectDropdown;
