import React from 'react';
import {fortmatic, injected, portis, walletconnect, walletlink} from '../ConnectAccount/connectors';
import Identicon from '../ConnectAccount/components/Identicon';
import WalletConnectIcon from '../ConnectAccount/assets/walletConnectIcon.svg';
import CoinbaseWalletIcon from '../ConnectAccount/assets/coinbaseWalletIcon.svg';
import FortmaticIcon from '../ConnectAccount/assets/fortmaticIcon.png';
import PortisIcon from '../ConnectAccount/assets/portisIcon.png';
import Styles from './get-wallet-icon.styles.less';
import {TinyButton} from './buttons';
import {AbstractConnector} from '@web3-react/abstract-connector';
import { useAppStatusStore } from '../../stores/app-status';

export interface GetWalletIconProps {
  account: string;
  connector: AbstractConnector;
  showPortisButton?: boolean;
};

export const GetWalletIcon = ({connector, account, showPortisButton = false }: GetWalletIconProps) => {
  const { isMobile } = useAppStatusStore();
  let icon;
  let iconAlt;

  switch (connector) {
    case injected:
      icon = <Identicon account={account} />;
      iconAlt = 'Identicon Image';
      break;
    case walletconnect:
      icon = WalletConnectIcon;
      iconAlt = 'Wallet Connect Logo';
      break;
    case walletlink:
      icon = CoinbaseWalletIcon;
      iconAlt = 'Coinbase Wallet Logo';
      break;
    case fortmatic:
      icon = FortmaticIcon;
      iconAlt = 'Fortmatic Logo';
      break;
    case portis:
      icon = PortisIcon;
      iconAlt = 'Portis Logo';
      break;
    default:
      return null;
  }

  return (
    <div className={Styles.WalletIcon}>
      {connector === injected ? icon : <img src={icon} alt={iconAlt} />}
      {showPortisButton && connector === portis && !isMobile && (
        <TinyButton
          action={() => portis.portis.showPortis()}
          text='Show Portis'
        />
      )}
    </div>
  );
}
