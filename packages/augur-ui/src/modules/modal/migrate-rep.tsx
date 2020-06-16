import React, { useState, useEffect } from 'react';

import { Title, AccountAddressDisplay } from 'modules/modal/common';
import {
  formatRep,
  formatGasCostToEther,
  formatEther,
  formatDai,
} from 'utils/format-number';
import { toChecksumAddress } from 'ethereumjs-util';
import { AccountBalances } from 'modules/types';
import {
  ExternalLinkButton,
  ProcessingButton,
  SecondaryButton,
} from 'modules/common/buttons';
import { TransactionFeeLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';
import {
  displayGasInDai,
  getGasInDai,
} from 'modules/app/actions/get-ethToDai-rate';
import {
  V1_REP_MIGRATE_ESTIMATE,
  HELP_CENTER_LEARN_ABOUT_ADDRESS,
  HELP_CENTER_MIGRATE_REP,
  GWEI_CONVERSION,
  TRANSACTIONS,
  APPROVE,
  MIGRATE_FROM_LEG_REP_TOKEN,
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
  const inSigningWallet = walletBalances.signerBalances.legacyRep !== '0';
  const inTradingWallet = walletBalances.legacyRep !== '0';
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

  const gasInDai = getGasInDai(gasLimit).value;
  const hasEnoughDaiForGas = createBigNumber(walletBalances.dai).gte(
    createBigNumber(gasInDai)
  );

  const safeWalletContent = (
    <>
      <div>
        <span>V1 REP to migrate</span>
        <span>
          {inSigningWallet
            ? formatRep(walletBalances.signerBalances.legacyRep).formattedValue
            : formatRep(walletBalances.legacyRep).formattedValue}
        </span>
      </div>
      <div>
        <TransactionFeeLabel gasCostDai={displayGasInDai(gasLimit)} />
      </div>
      {!hasEnoughEthForGas && inSigningWallet && (
        <span className={Styles.Error}>
          {formatEther(gasEstimateInEth).formatted} ETH is needed for
          transaction fee
        </span>
      )}
      {!hasEnoughDaiForGas && !hasEnoughEthForGas && inTradingWallet && (
        <span className={Styles.Error}>
          ${formatDai(gasInDai).formatted} DAI is needed for transaction fee
        </span>
      )}
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
    <div className={Styles.MigrateRep}>
      <Title title={'Migrate V1 REP'} closeAction={closeAction} />

      <main>
        {!inSigningWallet && <h1>You have V1 REP in your trading account</h1>}
        {inSigningWallet && <h1>You have V1 REP in your wallet</h1>}

        <h2>
          Migrate your V1 REP to V2 REP to use it in Augur V2. The quantity of
          V1 REP shown below will migrate to an equal amount of V2 REP. For
          example 100 V1 REP will migrate to 100 V2 REP.
          <ExternalLinkButton
            label="Learn more"
            URL={HELP_CENTER_MIGRATE_REP}
          />
          {inSigningWallet && (
            <p>
              After migrating your REP, in order to use it for reporting, disputing or
              buying participation tokens transfer it to your trading account.
            </p>
          )}
        </h2>

        {safeWalletContent}
      </main>
      <div className={Styles.ButtonsRow}>
        <ProcessingButton
          small
          text={'Migrate'}
          action={() => convertV1ToV2(inSigningWallet)}
          queueName={TRANSACTIONS}
          queueId={MIGRATE_FROM_LEG_REP_TOKEN}
          disabled={
            (walletBalances.legacyRep === '0' &&
              walletBalances.signerBalances.legacyRep === '0') ||
            (inSigningWallet && !hasEnoughEthForGas) ||
            (inTradingWallet && !hasEnoughDaiForGas && !hasEnoughEthForGas)
          }
        />
        <SecondaryButton text={'Cancel'} action={closeAction} />
      </div>
    </div>
  );
};
