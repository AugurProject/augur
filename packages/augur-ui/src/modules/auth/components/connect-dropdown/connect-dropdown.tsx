import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ACCOUNT_TYPES } from 'modules/common/constants';
import { DaiLogoIcon, EthIcon, helpIcon, LogoutIcon, Open, Pencil, v2AugurLogo } from 'modules/common/icons';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { formatDai, formatEther, formatRep } from 'utils/format-number';
import { AccountBalances } from 'modules/types';
import ModalMetaMaskFinder from 'modules/modal/components/common/modal-metamask-finder';
import classNames from 'classnames';
import Styles from 'modules/auth/components/connect-dropdown/connect-dropdown.styles.less';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { getGasCostInDai } from 'modules/modal/gas';
import { createBigNumber, BigNumber } from 'utils/create-big-number';

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
  userDefinedGasPrice: number;
  gasPriceSpeed: number;
  gasPriceTime: string;
  showAddFundsModal: Function;
  universeSelectorModal: Function;
  universeOutcomeName: string;
  parentUniverseId: string;
  universeHasChildren: boolean;
  Gnosis_ENABLED: boolean;
  ethToDaiRate: BigNumber;
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
    Gnosis_ENABLED,
    ethToDaiRate,
  } = props;

  if (!isLogged && !restoredAccount) return null;

  const [showMetaMaskHelper, setShowMetaMaskHelper] = useState(false);

  const logout = () => {
    const { logout } = props;
    logout();
  };

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
      disabled: Gnosis_ENABLED ? balances.eth === 0 : false,
    },
    {
      name: 'REP',
      logo: v2AugurLogo,
      value: formatRep(balances.rep, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formattedValue,
      disabled: Gnosis_ENABLED ? balances.rep === 0 : false,
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

  const renderToolTip = (id: string, text: string) => (
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
      >
        <p>{text}</p>
      </ReactTooltip>
    </span>
  );

  return (
    <div onClick={event => event.stopPropagation()}>
      {showMetaMaskHelper && (
        <ModalMetaMaskFinder handleClick={() => setShowMetaMaskHelper(false)} />
      )}
      <div className={Styles.AccountInfo}>
        <div className={Styles.AddFunds}>
          <div>Your account</div>
          <PrimaryButton action={() => showAddFundsModal()} text='Add Funds' />
        </div>

        {accountFunds
          .filter(fundType => !fundType.disabled)
          .map((fundType, idx) => (
          <div key={idx} className={Styles.AccountFunds}>
            <div>
              {fundType.logo} {fundType.name}
            </div>
            <div>
              {fundType.value} {fundType.name}
            </div>
          </div>
        ))}

        <div className={Styles.MobileAddFunds}>
          <PrimaryButton action={() => showAddFundsModal()} text='Add Funds' />
        </div>

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
                    {renderToolTip('tooltip--walleProvider', 'Your wallet provider allows you to create a private and secure account for accessing and using Augur.')}
                  </div>
                  <div>
                    {wallet.accountType}{' '}
                    {accountMeta.email ? `(${accountMeta.email})` : null}
                  </div>
                </div>
                <SecondaryButton
                  action={() => wallet.action()}
                  text='OPEN'
                  icon={Open}
                  disabled={wallet.disabled}
                />
              </div>
            );
          })}

        <div className={Styles.GasEdit}>
          <div>
            <div>
              <div>
                Transaction fee
                {renderToolTip('tooltip--gasEdit', 'The fee for processing your transactions.')}
              </div>
              <div>
                ${getGasCostInDai(ethToDaiRate, createBigNumber(userDefinedGasPrice).toNumber())} / Trade  ({gasPriceSpeed} {gasPriceTime})
              </div>
            </div>
          </div>
          <SecondaryButton
            action={() => gasModal()}
            text='EDIT'
            icon={Pencil}
          />
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

        <button className={Styles.Logout} onClick={() => logout()}>
            Logout {LogoutIcon}
        </button>
      </div>
    </div>
  );
};

export default ConnectDropdown;
