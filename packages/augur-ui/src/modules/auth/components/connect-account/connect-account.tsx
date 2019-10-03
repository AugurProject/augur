import React, { Component } from 'react';
import classNames from 'classnames';
import Blockies from 'react-blockies';

import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import ChevronFlip from 'modules/common/chevron-flip';
import formatAddress from 'modules/auth/helpers/format-address';

import Styles from 'modules/auth/components/connect-account/connect-account.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { LoginAccount } from 'modules/types';

interface ConnectAccountProps {
  isLogged: boolean;
  isConnectionTrayOpen: boolean;
  updateConnectionTray: Function;
  userInfo: LoginAccount['meta'];
}

export default class ConnectAccount extends Component<ConnectAccountProps> {
  connectAccount;
  connectDropdown;

  toggleDropdown(cb?: Functio) {
    const { updateConnectionTray, isConnectionTrayOpen } = this.props;
    updateConnectionTray(!isConnectionTrayOpen);
    if (cb && typeof cb === "function") cb();
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
        className={Styles.ConnectAccount}
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
          <ConnectDropdown toggleDropdown={(cb) => this.toggleDropdown(cb)} />
        </div>
      </div>
    );
  }
}
