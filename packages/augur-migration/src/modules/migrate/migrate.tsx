import React from 'react';
import Styles from './migrate.styles.less';
import { PrimaryButton, ExternalLinkButton } from '@augurproject/augur-comps';

export const Migrate = () => {
  return (
    <div className={Styles.Migrate}>
      <span>
        Migrate your V1 REP to V2 REP to use it in Augur V2. The quantity of V1
        REP shown below will migrate to an equal amount of V2 REP. For example
        100 V1 REP will migrate to 100 V2 REP.{' '}
        <ExternalLinkButton label="learn more" URL="https://www.google.com/" />
      </span>
      <PrimaryButton text="Connect your wallet" darkTheme />
    </div>
  );
};
