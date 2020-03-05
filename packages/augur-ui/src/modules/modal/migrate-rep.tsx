import React, { useState, useEffect } from 'react';

import { ButtonsRow, Title, AccountAddressDisplay } from 'modules/modal/common';
import { formatRep, formatGasCostToEther } from 'utils/format-number';
import { BigNumber } from 'utils/create-big-number';
import { toChecksumAddress } from 'ethereumjs-util';
import { LoginAccount } from 'modules/types';
import { ExternalLinkButton } from 'modules/common/buttons';
import { LinearPropertyLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import {
  V1_REP_MIGRATE_ESTIMATE,
} from 'modules/common/constants';

import Styles from 'modules/modal/modal.styles.less';

interface MigrateRepForm {
  closeAction: Function;
  loginAccount: LoginAccount;
  convertV1ToV2: Function;
  Gnosis_ENABLED: boolean;
  ethToDaiRate: BigNumber;
  convertV1ToV2Estimate: Function;
  gasPrice: number;
  addPendingData: Function;
  showForSafeWallet: boolean;
}

export const MigrateRep = (props: MigrateRepForm) => {
  const {
    closeAction,
    convertV1ToV2,
    loginAccount,
    Gnosis_ENABLED,
    convertV1ToV2Estimate,
    ethToDaiRate,
    gasPrice,
    showForSafeWallet,
  } = props;

  const [gasLimit, setGasLimit] = useState(V1_REP_MIGRATE_ESTIMATE);

  useEffect(() => {
    if (Gnosis_ENABLED) {
      convertV1ToV2Estimate().then(gasLimit => {
        setGasLimit(gasLimit);
      });
    }
  }, []);

  const gasEstimate = formatGasCostToEther(
    gasLimit,
    { decimalsRounded: 4 },
    gasPrice
  );

  const safeWalletContent = (
    <>
      <div>
        <span>V1 REP to migrate</span>
        <span>{formatRep(loginAccount.balances.legacyRep).formattedValue}</span>
      </div>
      <div>
        <LinearPropertyLabel
          key="cost"
          label={Gnosis_ENABLED ? 'Transaction Fee' : 'Gas Cost'}
          value={
            Gnosis_ENABLED
              ? displayGasInDai(gasEstimate, ethToDaiRate)
              : gasEstimate
          }
        />
      </div>
      <div>
        {InfoIcon} Your wallet will need to sign <span>2</span> transactions
      </div>
    </>
  );

  const mainWalletContent = (
    <>
      <h3>Augur account address</h3>
      <AccountAddressDisplay
        copyable
        address={toChecksumAddress(loginAccount.address)}
      />
      <ExternalLinkButton
        URL="https://docs.augur.net/"
        label={'Learn about your address'}
      />
    </>
  );

  return (
    <div
      className={showForSafeWallet ? Styles.MigrateRep : Styles.MigrateRepInfo}
    >
      <Title
        title={showForSafeWallet ? 'Migrate Rep' : 'Migrate V1 REP'}
        closeAction={closeAction}
      />

      <main>
        {showForSafeWallet && (
          <h1>You have V1 REP in your Augur account address</h1>
        )}
        {!showForSafeWallet && <h1>You have V1 REP in your wallet</h1>}

        {showForSafeWallet && (
          <h2>
            Migrate your V1 REP to V2 REP to use it in Augur V2. The quantity of
            V1 REP shown below will migrate to an equal amount of V2 REP. For
            example 100 V1 REP will migrate to 100 V2 REP.
            <ExternalLinkButton
              label="Learn more"
              URL="http://docs.augur.net/"
            />
          </h2>
        )}

        {!showForSafeWallet && (
          <h2>
            In order to migrate your V1 REP to V2 REP to use it in Augur V2, you
            need to send your V1 REP to your Augur Account Address shown below.
            <p />
            When your V1 REP is in your Augur Account Address you will see a
            button named “Migrate V1 to V2 REP” in the Augur app navigation.
            From here you can migrate all V1 REP in your account to V2 REP.
            <ExternalLinkButton
              label="Learn more"
              URL="http://docs.augur.net/"
            />
          </h2>
        )}

        {showForSafeWallet ? safeWalletContent : mainWalletContent}
      </main>
      <ButtonsRow
        buttons={[
          {
            text: showForSafeWallet ? 'Migrate' : 'OK',
            action: showForSafeWallet
              ? () => {
                  closeAction();
                  convertV1ToV2();
                }
              : () => closeAction(),
            disabled:
              formatRep(loginAccount.balances.legacyRep).fullPrecision < 0,
          },
          {
            text: 'Close',
            action: closeAction,
          },
        ]}
      />
    </div>
  );
};
