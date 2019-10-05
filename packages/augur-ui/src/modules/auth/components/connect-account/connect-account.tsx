import React, { Component } from 'react';
import classNames from 'classnames';
import Blockies from 'react-blockies';

import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import ChevronFlip from 'modules/common/chevron-flip';
import formatAddress from 'modules/auth/helpers/format-address';
import { LoginAccount } from 'modules/types';

import Styles from 'modules/auth/components/connect-account/connect-account.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { LoginAccount } from 'modules/types';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';

interface ConnectAccountProps {
  isLogged: boolean;
  isConnectionTrayOpen: boolean;
  updateConnectionTray: Function;
  updateMobileMenuState: Function;
  mobileMenuState: number;
  userInfo: LoginAccount['meta'];
  accountAddress: string;
  universeId: string;
}

export default class ConnectAccount extends Component<ConnectAccountProps> {
  connectAccount;
  connectDropdown;


  toggleDropdown(cb?: Function) {
    const { updateConnectionTray, updateMobileMenuState, isConnectionTrayOpen, mobileMenuState } = this.props;
    if (mobileMenuState > 0) {
      updateConnectionTray(!isConnectionTrayOpen);
    }
    else {
      updateMobileMenuState(1);
      updateConnectionTray(!isConnectionTrayOpen);
    }

    if (cb && typeof cb === 'function') cb();
  }

  render() {
    const {
      isLogged,
      isConnectionTrayOpen,
      userInfo,
    } = this.props;

    if (!isLogged || !userInfo) return null;

    return (
      <div
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
