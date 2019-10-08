import React, { useState } from 'react';
import { ACCOUNT_TYPES } from 'modules/common/constants';
import {
  LogoutIcon,
  DaiLogoIcon,
  RepLogoIcon,
  EthIcon,
  Pencil,
  Open,
  DirectionArrow,
} from 'modules/common/icons';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { formatRep, formatEther, formatDai } from 'utils/format-number';
import { AccountBalances, Universe } from 'modules/types';

import Styles from 'modules/auth/components/connect-dropdown/connect-dropdown.styles.less';
import ModalMetaMaskFinder from 'modules/modal/components/common/modal-metamask-finder';
import classNames from 'classnames';

interface ConnectDropdownProps {
  isLogged: boolean;
  logout: Function;
  accountMeta: {
    accountType: string;
    openWallet: Function;
    email?: string;
  };
  balances: AccountBalances;
  gasModal: Function;
  userDefinedGasPrice: string;
  gasPriceSpeed: number;
  showAddFundsModal: Function;
  universeSelectorModal: Function;
  universeOutcomeName: string;
  parentUniverseId: string;
  universeHasChildren: boolean;
}

const ConnectDropdown = (props: ConnectDropdownProps) => {
  const {
    isLogged,
    userDefinedGasPrice,
    accountMeta,
    gasPriceSpeed,
    gasModal,
    balances,
    showAddFundsModal,
    universeSelectorModal,
    universeOutcomeName,
    parentUniverseId,
    universeHasChildren,
  } = props;

  if (!isLogged) return null;

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
    },
    {
      value: formatEther(balances.eth, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formattedValue,
      name: 'ETH',
      logo: EthIcon,
    },
    {
      name: 'REP',
      logo: RepLogoIcon,
      value: formatRep(balances.rep, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formattedValue,
    },
  ];

  const walletProviders = [
    {
      accountType: ACCOUNT_TYPES.PORTIS,
      action: () => accountMeta.openWallet(),
    },
    {
      accountType: ACCOUNT_TYPES.FORTMATIC,
      action: () => accountMeta.openWallet(),
    },
    {
      accountType: ACCOUNT_TYPES.TORUS,
      action: () => accountMeta.openWallet(),
    },
    {
      accountType: ACCOUNT_TYPES.WEB3WALLET,
      action: () => setShowMetaMaskHelper(true),
    },
  ];

  return (
    <div>
      {showMetaMaskHelper && <ModalMetaMaskFinder handleClick={() => setShowMetaMaskHelper(false)} />}
      <div className={Styles.AccountInfo}>
        <div className={Styles.AddFunds}>
          <div>Your account</div>
          <PrimaryButton action={() => showAddFundsModal()} text="Add Funds" />
        </div>

        {accountFunds.map((fundType, idx) => (
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
          <PrimaryButton action={() => showAddFundsModal()} text="Add Funds" />
        </div>

        {walletProviders
          .filter(wallet => wallet.accountType === accountMeta.accountType)
          .map((wallet, idx) => {
            return (
              <div
                key={idx}
                className={classNames(Styles.WalletProvider, {
                  [Styles.MetaMask]: wallet.accountType === ACCOUNT_TYPES.WEB3WALLET,
                })}>
                <div>
                  <div>Wallet provider</div>
                  <div>
                    {wallet.accountType}{' '}
                    {accountMeta.email ? `(${accountMeta.email})` : null}
                  </div>
                </div>
                <SecondaryButton
                  action={() => wallet.action()}
                  text="OPEN"
                  icon={Open}
                />
              </div>
            );
          })}

        <div className={Styles.GasEdit}>
          <div>
            <div>Gas price</div>
            <div>
              {userDefinedGasPrice} GWEI ({gasPriceSpeed})
            </div>
          </div>
          <SecondaryButton
            action={() => gasModal()}
            text="EDIT"
            icon={Pencil}
          />
        </div>

        {(parentUniverseId !== null || universeHasChildren) &&
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
        }

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
