import React, { useRef } from 'react';
import classNames from 'classnames';
import Blockies from 'react-blockies';

import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import ChevronFlip from 'modules/common/chevron-flip';
import { LoginAccount } from 'modules/types';
import { formatDai } from 'utils/format-number';
import { useAppStatusStore } from 'modules/app/store/app-status';
import Styles from 'modules/auth/components/connect-account/connect-account.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';

interface ConnectAccountProps {
  isLogged: boolean;
  restoredAccount: boolean;
  updateMobileMenuState: Function;
  mobileMenuState: number;
  userInfo: LoginAccount['meta'];
  balances: LoginAccount['balances'];
}

const ConnectAccount = ({
  isLogged,
  restoredAccount,
  updateMobileMenuState,
  mobileMenuState,
  userInfo,
  balances,
}:ConnectAccountProps) => {
  const connectAccount = useRef(null);
  const connectDropdown = useRef(null);
  const { isConnectionTrayOpen, actions: { setIsConnectionTrayOpen }} = useAppStatusStore();
  if (!isLogged && !restoredAccount || !userInfo) return null;

  function toggleDropdown(cb?: Function) {
    if (mobileMenuState <= 0) {
      updateMobileMenuState(1);
    }
    setIsConnectionTrayOpen(!isConnectionTrayOpen);
    if (cb && typeof cb === 'function') cb();
  }

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={classNames(Styles.ConnectAccount, {
        [Styles.selected]: isConnectionTrayOpen,
      })}
      ref={connectAccount}
    >
      <div
        onClick={() => toggleDropdown()}
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
                  : userInfo.accountType}
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
        ref={connectDropdown}
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
};

export default ConnectAccount;
