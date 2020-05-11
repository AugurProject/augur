import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Clipboard from 'clipboard';
import classNames from 'classnames';
import { ACCOUNT_TYPES, NEW_ORDER_GAS_ESTIMATE, ETH } from 'modules/common/constants';
import { DaiLogoIcon, EthIcon, helpIcon, LogoutIcon, Open, Pencil, v2AugurLogo, ClipboardCopy } from 'modules/common/icons';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { formatDai, formatEther, formatRep } from 'utils/format-number';
import { AccountBalances, FormattedNumber } from 'modules/types';
import ModalMetaMaskFinder from 'modules/modal/components/common/modal-metamask-finder';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';
import { displayGasInDai, ethToDai } from 'modules/app/actions/get-ethToDai-rate';

import Styles from 'modules/auth/components/connect-dropdown/connect-dropdown.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface ConnectDropdownProps {
  logout: Function;
  accountMeta: {
    accountType: string;
    openWallet: Function;
    email?: string;
  };
  balances: AccountBalances;
  gasModal: Function;
  userDefinedGasPrice: number;
  gasPriceSpeed: number;
  gasPriceTime: string;
  gasPrice: BigNumber;
  showAddFundsModal: Function;
  universeSelectorModal: Function;
  universeOutcomeName: string;
  parentUniverseId: string;
  universeHasChildren: boolean;
  loginAccountAddress: string;
  reserveEthAmount: FormattedNumber;
}

const ConnectDropdown = ({
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
  loginAccountAddress,
  reserveEthAmount,
  logout,
}: ConnectDropdownProps) => {
  const [showMetaMaskHelper, setShowMetaMaskHelper] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { isLogged, restoredAccount, gsnEnabled, ethToDaiRate, actions: { setGSNEnabled }} = useAppStatusStore();

  let gasCostTrade;

  if (gsnEnabled && ethToDaiRate) {
    gasCostTrade = displayGasInDai(NEW_ORDER_GAS_ESTIMATE, userDefinedGasPrice * 10**9);
  }

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

  if (!isLogged && !restoredAccount) return null;

  const renderToolTip = (id: string, content: JSX.Element) => (
    <span>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={id}
        data-iscapture={true}
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

  const ethReserveInDai = (ethToDai(reserveEthAmount.value, createBigNumber(ethToDaiRate?.value || 0))).formattedValue;

  const accountFunds = [
    {
      value: formatDai(balances.dai, {
        zeroStyled: false,
        decimalsRounded: 2,
      }).formattedValue,
      name: 'DAI',
      logo: DaiLogoIcon,
      disabled: false,
    },
    {
      value: formatEther(balances.eth, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formattedValue,
      name: 'ETH',
      logo: EthIcon,
      disabled: gsnEnabled ? balances.eth === 0 : false,
    },
    {
      name: 'REP',
      logo: v2AugurLogo,
      value: formatRep(balances.rep, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formattedValue,
      disabled: gsnEnabled ? balances.rep === 0 : false,
    },
    {
      name: 'ETH RESERVE',
      toolTip: renderToolTip(
        'tooltip--ethReserve',
        <div>
          <p>Augur is a peer-to-peer system, and certain actions require paying a small fee to other users of the system. The cost of these fees will be included in the total fees displayed when taking that action. Trades, Creating Markets, and Reporting on the market outcome are examples of such actions.</p>
          <p>Augur will reserve ${ethReserveInDai} of your funds in order to pay these fees. Your total balance can be cashed out at any time.</p>
        </div>
      ),
      logo: EthIcon,
      value: reserveEthAmount.formattedValue,
      subValue: ethReserveInDai,
      disabled: gsnEnabled ? balances.ethNonSafe === 0 : false,
    },
  ];

  const walletProviders = [
    {
      accountType: ACCOUNT_TYPES.PORTIS,
      action: () => accountMeta?.openWallet(),
      disabled: !accountMeta?.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.FORTMATIC,
      action: () => accountMeta?.openWallet(),
      disabled: !accountMeta?.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.TORUS,
      action: () => accountMeta?.openWallet(),
      disabled: !accountMeta?.openWallet,
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
          <div>Your account</div>
          <PrimaryButton action={() => showAddFundsModal()} text='Add Funds' />
        </div>

        {accountFunds
          .filter(fundType => !fundType.disabled)
          .map((fundType, idx) => (
            <div key={idx} className={Styles.AccountFunds}>
              <div>
                {fundType.logo} {fundType.name} {fundType.toolTip ? fundType.toolTip : null}
              </div>
              <div>
                <div>
                  <span>{fundType.value} {fundType.name === 'ETH RESERVE' ? ETH : fundType.name}</span>
                  {fundType.subValue && <span>${fundType.subValue}</span>}
                </div>
              </div>
            </div>
          ))}

        {walletProviders
          .filter(wallet => wallet.accountType === accountMeta?.accountType)
          .map((wallet, idx) => {
            return (
              <div
                key={idx}
                className={classNames(Styles.WalletProvider, {
                  [Styles.MetaMask]:
                    wallet?.accountType === ACCOUNT_TYPES.WEB3WALLET,
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
                  text='OPEN'
                  title='Open'
                  icon={Open}
                  disabled={wallet.disabled}
                />
              </div>
            );
          })}

        {gasCostTrade && <div className={Styles.GasEdit}>
          <div>
            <div>
              Transaction fee
              {renderToolTip(
                'tooltip--gasEdit',
                <p>The fee for processing your transactions.</p>
              )}
            </div>
            <div>
              {gasCostTrade} / Trade ({gasPriceSpeed} {gasPriceTime})
            </div>
          </div>
          <SecondaryButton
            action={() => gasModal()}
            text='EDIT'
            title='Edit'
            icon={Pencil}
          />
        </div>}

        <div className={Styles.GasEdit}>
          <div>
            <div>
              Refer a friend
              {renderToolTip('tooltip--referral', referralTooltipContent)}
            </div>
            <div>{referralLink}</div>
          </div>
          <button
            id='copy_referral'
            data-clipboard-text={referralLink}
            onClick={() => copyClicked()}
            className={isCopied ? Styles.ShowConfirmaiton : null}
          >
            {ClipboardCopy} Copy
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
              title='Change Universe'
            />
          </div>
        )}

        <button className={Styles.Logout} onClick={() => logout(setGSNEnabled)}>
            Logout {LogoutIcon}
        </button>
      </div>
    </div>
  );
};

export default ConnectDropdown;
