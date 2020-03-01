import React, { Component } from 'react';
import classNames from 'classnames';
import Blockies from 'react-blockies';

import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import ChevronFlip from 'modules/common/chevron-flip';
import formatAddress from 'modules/auth/helpers/format-address';
import { LoginAccount } from 'modules/types';
import { formatDai } from 'utils/format-number';

import Styles from 'modules/auth/components/connect-account/connect-account.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';

interface ConnectAccountProps {
  isLogged: boolean;
  restoredAccount: boolean;
  isConnectionTrayOpen: boolean;
  updateConnectionTray: Function;
  updateHelpMenuState: Function;
  updateMobileMenuState: Function;
  mobileMenuState: number;
  userInfo: LoginAccount['meta'];
  balances: LoginAccount['balances'];
}

export default class ConnectAccount extends Component<ConnectAccountProps> {
  connectAccount;
  connectDropdown;

  toggleDropdown(cb?: Function) {
    const {
      updateConnectionTray,
      updateHelpMenuState,
      updateMobileMenuState,
      isConnectionTrayOpen,
      mobileMenuState,
    } = this.props;
    if (mobileMenuState > 0) {
      updateConnectionTray(!isConnectionTrayOpen);
      updateHelpMenuState(false);
    }
    else {
      updateMobileMenuState(1);
      updateConnectionTray(!isConnectionTrayOpen);
      updateHelpMenuState(false);
    }

    if (cb && typeof cb === 'function') cb();
  }

  render() {
    const {
      isLogged,
      restoredAccount,
      isConnectionTrayOpen,
      userInfo,
      balances,
    } = this.props;
    if (!isLogged && !restoredAccount || !userInfo) return null;

    return (
      <div
        onClick={(event) => event.stopPropagation()}
        className={classNames(Styles.ConnectAccount, {
          [Styles.selected]: isConnectionTrayOpen,
        })}
        ref={connectAccount => {
          this.connectAccount = connectAccount;
        }}
      >
        <div
          onClick={() => this.toggleDropdown()}
          role='button'
          tabIndex={-1}
        >
          <div>
            <div className={Styles.AccountInfo}>
              {userInfo.profileImage ? (
                <img src={userInfo.profileImage} />
              ) : (
                <Blockies seed={userInfo.address.toLowerCase()} />
              )}
              <div>
                <div>Account</div>
                <div>
                  {userInfo.email
                    ? userInfo.email
                    : formatAddress(userInfo.address)}
                </div>
                <span>{formatDai(balances.dai).full}</span>
              </div>
            </div>
            <span>
              <ChevronFlip
                pointDown={isConnectionTrayOpen}
                stroke='#fff'
                filledInIcon
                quick
              />
            </span>
          </div>
        </div>
        <div
          ref={connectDropdown => {
            this.connectDropdown = connectDropdown;
          }}
          className={classNames(
            Styles.ConnectDropdown,
            ToggleHeightStyles.target,
            ToggleHeightStyles.quick,
            {
              [ToggleHeightStyles.open]: isConnectionTrayOpen,
            }
          )}
        >
          <ConnectDropdown />
        </div>
      </div>
    );
  }
}
