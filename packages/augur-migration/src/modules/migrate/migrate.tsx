import React from 'react';
import Styles from './migrate.styles.less';
import { PrimaryButton, ExternalLinkButton } from '@augurproject/augur-comps';
import { useAppStatusStore } from '../stores/app-status';
import { ConnectAccountButton } from '../shared/connect-account-button';
import {
  convertV1ToV2Approve,
  isRepV2Approved,
  convertV1ToV2,
} from '../../utils/contract-calls';
import { useUserStore } from '../stores/user';

export const Migrate = () => {
  const { isLogged } = useAppStatusStore();
  const { loginAccount } = useUserStore();
  loginAccount && isRepV2Approved(loginAccount.library, loginAccount.account);
  //console.log(isApproved);
  return (
    <div className={Styles.Migrate}>
      <span>
        Migrate your V1 REP to V2 REP to use it in Augur V2. The quantity of V1
        REP shown below will migrate to an equal amount of V2 REP. For example
        100 V1 REP will migrate to 100 V2 REP.{' '}
        <ExternalLinkButton label="learn more" URL="https://www.google.com/" />
      </span>
      {isLogged ? (
        <>
          <PrimaryButton
            text="Approve"
            darkTheme
            action={() =>
              convertV1ToV2Approve(loginAccount.library, loginAccount.account)
            }
          />{' '}
          <PrimaryButton
            text="Migrate"
            darkTheme
            action={() =>
              {
                convertV1ToV2(loginAccount.library, loginAccount.account)

              }
            }
          />
        </>
      ) : (
        <ConnectAccountButton />
      )}
    </div>
  );
};
