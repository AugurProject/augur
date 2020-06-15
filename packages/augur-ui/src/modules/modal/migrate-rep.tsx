import React, { useState, useEffect } from 'react';

import { ButtonsRow, Title, AccountAddressDisplay } from 'modules/modal/common';
import { formatRep, formatGasCostToEther } from 'utils/format-number';
import { toChecksumAddress } from 'ethereumjs-util';
import { LoginAccount } from 'modules/types';
import { ExternalLinkButton } from 'modules/common/buttons';
import { LinearPropertyLabel, TransactionFeeLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import {
  V1_REP_MIGRATE_ESTIMATE, HELP_CENTER_LEARN_ABOUT_ADDRESS, HELP_CENTER_MIGRATE_REP, GWEI_CONVERSION,
} from 'modules/common/constants';
import convertV1ToV2, {
  convertV1ToV2Estimate,
} from 'modules/account/actions/convert-v1-rep-to-v2';

import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const MigrateRep = () => {
  const {
    loginAccount,
    modal,
    gsnEnabled: GsnEnabled,
    gasPriceInfo,
    actions: { closeModal }
  } = useAppStatusStore();

  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const walletBalances = loginAccount.balances;
  const showForSafeWallet = walletBalances.legacyRep > 0;


  const [gasLimit, setGasLimit] = useState(V1_REP_MIGRATE_ESTIMATE);

  useEffect(() => {
    if (GsnEnabled) {
      convertV1ToV2Estimate().then(gasLimit => {
        setGasLimit(gasLimit);
      });
    }
  }, []);

  const gasEstimateInEth = formatGasCostToEther(
    gasLimit,
    { decimalsRounded: 4 },
    createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
  );

  const safeWalletContent = (
    <>
      <div>
        <span>V1 REP to migrate</span>
        <span>{formatRep(loginAccount.balances.legacyRep).formattedValue}</span>
      </div>
      <div>
        <TransactionFeeLabel gasCostDai={displayGasInDai(gasLimit)} />
      </div>
      <div>
        {InfoIcon} Your wallet will need to sign <span>2</span> transactions
      </div>
    </>
  );

  const mainWalletContent = (
    <>
      <h3>Trading account</h3>
      <AccountAddressDisplay
        copyable
        address={toChecksumAddress(loginAccount.address)}
      />
      <ExternalLinkButton
        URL={HELP_CENTER_LEARN_ABOUT_ADDRESS}
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
        closeAction={closeModal}
      />

      <main>
        {showForSafeWallet && (
          <h1>You have V1 REP in your trading account</h1>
        )}
        {!showForSafeWallet && <h1>You have V1 REP in your wallet</h1>}

        {showForSafeWallet && (
          <h2>
            Migrate your V1 REP to V2 REP to use it in Augur V2. The quantity of
            V1 REP shown below will migrate to an equal amount of V2 REP. For
            example 100 V1 REP will migrate to 100 V2 REP.
            <ExternalLinkButton
              label="Learn more"
              URL={HELP_CENTER_MIGRATE_REP}
            />
          </h2>
        )}

        {!showForSafeWallet && (
          <h2>
            In order to migrate your V1 REP to V2 REP to use it in Augur V2, you
            need to send your V1 REP to your trading account shown below.
            <p />
            When your V1 REP is in your trading account you will see a
            button named “Migrate V1 to V2 REP” in the Augur app navigation.
            From here you can migrate all V1 REP in your account to V2 REP.
            <ExternalLinkButton
              label="Learn more"
              URL={HELP_CENTER_MIGRATE_REP}
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
                closeModal();
                convertV1ToV2();
              }
              : () => closeModal(),
            disabled:
              formatRep(loginAccount.balances.legacyRep).fullPrecision < 0,
          },
          {
            text: 'Close',
            action: closeModal,
          },
        ]}
      />
    </div>
  );
};
