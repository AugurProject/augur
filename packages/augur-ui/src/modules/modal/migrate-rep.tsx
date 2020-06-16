import React, { useState, useEffect } from 'react';

import { Title, AccountAddressDisplay } from 'modules/modal/common';
import { formatRep, formatGasCostToEther, formatEther } from 'utils/format-number';
import { toChecksumAddress } from 'ethereumjs-util';
import { AccountBalances } from 'modules/types';
import { ExternalLinkButton, ProcessingButton, SecondaryButton } from 'modules/common/buttons';
import { TransactionFeeLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import {
  V1_REP_MIGRATE_ESTIMATE, HELP_CENTER_LEARN_ABOUT_ADDRESS, HELP_CENTER_MIGRATE_REP, GWEI_CONVERSION, TRANSACTIONS, APPROVE, MIGRATE_FROM_LEG_REP_TOKEN,
} from 'modules/common/constants';

import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';

interface MigrateRepForm {
  closeAction: Function;
  tradingAccount: string;
  convertV1ToV2: Function;
  GsnEnabled: boolean;
  convertV1ToV2Estimate: Function;
  gasPrice: number;
  walletBalances: AccountBalances;
}

export const MigrateRep = ({
  closeAction,
  convertV1ToV2,
  tradingAccount,
  GsnEnabled,
  convertV1ToV2Estimate,
  gasPrice,
  walletBalances,
}: MigrateRepForm) => {

  const [gasLimit, setGasLimit] = useState(V1_REP_MIGRATE_ESTIMATE);
  const showForSafeWallet = walletBalances.signerBalances.legacyRep !== '0';
  const intradingWallet = walletBalances.legacyRep !== '0';
  const ethForGas = walletBalances.signerBalances.eth;

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

  const hasEnoughEthForGas = createBigNumber(ethForGas).gte(
    createBigNumber(gasEstimateInEth)
  );

  const safeWalletContent = (
    <>
      <div>
        <span>V1 REP to migrate</span>
        <span>{showForSafeWallet ? formatRep(walletBalances.signerBalances.legacyRep).formattedValue : formatRep(walletBalances.legacyRep).formattedValue}</span>
      </div>
      <div>
      <TransactionFeeLabel gasCostDai={displayGasInDai(gasLimit)} />
      </div>
      {!hasEnoughEthForGas && <span className={Styles.Error}>{formatEther(gasEstimateInEth).formatted} ETH is needed for transaction fee</span>}
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
        address={toChecksumAddress(tradingAccount)}
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
        closeAction={closeAction}
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
      <div className={Styles.ButtonsRow}>
          <ProcessingButton
            small
            text={'Migrate'}
            action={() =>  convertV1ToV2(showForSafeWallet)}
            queueName={TRANSACTIONS}
            queueIds={[APPROVE, MIGRATE_FROM_LEG_REP_TOKEN]}
            disabled={formatRep(walletBalances.legacyRep).fullPrecision === 0 ||
              formatRep(walletBalances.signerBalances.legacyRep)
                .fullPrecision === 0 ||
              !hasEnoughEthForGas}
          />
          <SecondaryButton
            text={'Cancel'}
            action={closeAction}
          />
        </div>
    </div>
  );
};
