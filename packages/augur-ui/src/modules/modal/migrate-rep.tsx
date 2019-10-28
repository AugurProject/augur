import React, { Component } from 'react';

import { ButtonsRow, Breakdown, Title } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO } from 'modules/common/constants';
import { formatEther, formatRep } from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { FormattedNumber, LoginAccount } from 'modules/types';
import { FormDropdown, TextInput } from 'modules/common/form';
import { CloseButton, ExternalLinkButton } from 'modules/common/buttons';
import { LinearPropertyLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';

interface MigrateRepForm {
  closeAction: Function;
  loginAccount: LoginAccount;
  convertV1ToV2: Function;
}

export class MigrateRep extends Component<MigrateRepForm, {}> {
  render() {
    const { closeAction, convertV1ToV2 } = this.props;

    return (
      <div className={Styles.MigrateRep}>
        <Title title={'Migrate Rep'} closeAction={closeAction} />

        <main>
          <h1>You have V1 REP in your wallet</h1>
          <h2>
            Migrate your V1 REP to V2 REP to use it in Augur V2. 
            <ExternalLinkButton
              label="Learn more"
              URL="http://docs.augur.net/"
            />
          </h2>

          <div>
            <div>
              <span>V1 REP Balance</span>
              <span>80.0000</span>
              <span>-</span>
            </div>
            <div>
              <span>V1 REP Balance</span>
              <span>80.0000</span>
              <span>-</span>
            </div>
          </div>

          <div>
            <label>Amount</label>
            <button onClick={null}>MAX</button>
            <TextInput type="number" placeholder="0.00" onChange={null} />
          </div>

          <div>
            <LinearPropertyLabel
              key="migrate"
              label="Migrate"
              value={'0.0000'}
            />
            <LinearPropertyLabel
              key="cost"
              label="Gas Cost (est)"
              value={'0.0000'}
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
              action: () => convertV1ToV2,
            },
            {
              text: 'Cancel',
              action: closeAction,
            },
          ]}
        />
      </div>
    );
  }
}
