import React, { Component, useState } from 'react';

import { ButtonsRow, Breakdown, Title } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO } from 'modules/common/constants';
import { formatEther, formatRep } from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { FormattedNumber, LoginAccount } from 'modules/types';
import { FormDropdown, Input, TextInput } from 'modules/common/form';
import { CloseButton, ExternalLinkButton } from 'modules/common/buttons';
import { LinearPropertyLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';

interface MigrateRepForm {
  closeAction: Function;
  loginAccount: LoginAccount;
  convertV1ToV2: Function;
  Gnosis_ENABLED: boolean;
}

export const MigrateRep = (props: MigrateRepForm) => {
  const { closeAction, convertV1ToV2, loginAccount, Gnosis_ENABLED } = props;

  return (
    <div className={Styles.MigrateRep}>
      <Title title={'Migrate Rep'} closeAction={closeAction} />

      <main>
        <h1>You have V1 REP in your wallet</h1>
        <h2>
          Migrate your V1 REP to V2 REP to use it in Augur V2.
          <ExternalLinkButton label='Learn more' URL='http://docs.augur.net/' />
        </h2>

        <div>
          <div>
            <span>V1 REP Balance</span>
            <span>
              {formatRep(loginAccount.balances.legacyRep).formattedValue}
            </span>
            <span>
              -{formatRep(loginAccount.balances.legacyRep).formattedValue}
            </span>
          </div>
          <div>
            <span>V2 REP Balance</span>
            <span>{formatRep(loginAccount.balances.rep).formattedValue}</span>
            <span>
              +{formatRep(loginAccount.balances.legacyRep).formattedValue}
            </span>
          </div>
        </div>
        <div>
          <LinearPropertyLabel
            key='cost'
            label='Gas Cost (est)'
            value={Gnosis_ENABLED ? '0.00' : '0.0000'} // TODO Gas UI Work
          />
        </div>

        <div>
          {InfoIcon} Your wallet will need to sign <span>2</span> transactions
        </div>
      </main>
      <ButtonsRow
        buttons={[
          {
            text: 'Convert',
            action: () => {
              closeAction();
              convertV1ToV2();
            },
            disabled:
              formatRep(loginAccount.balances.legacyRep).fullPrecision < 0,
          },
          {
            text: 'Cancel',
            action: closeAction,
          },
        ]}
      />
    </div>
  );
};
