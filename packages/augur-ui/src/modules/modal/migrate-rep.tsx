import React, { useState, useEffect } from 'react';

import { Title } from 'modules/modal/common';
import {
  formatRep,
  formatGasCostToEther,
  formatEther,
} from 'utils/format-number';
import { AccountBalances } from 'modules/types';
import {
  ExternalLinkButton,
  ProcessingButton,
  SecondaryButton,
} from 'modules/common/buttons';
import { TransactionFeeLabel } from 'modules/common/labels';
import {
  V1_REP_MIGRATE_ESTIMATE,
  HELP_CENTER_MIGRATE_REP,
  GWEI_CONVERSION,
  TRANSACTIONS,
  MIGRATE_FROM_LEG_REP_TOKEN,
  APPROVE,
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import {
  DISMISSABLE_NOTICE_BUTTON_TYPES,
  DismissableNotice,
} from 'modules/reporting/common';
import { isRepV2Approved } from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/modal/modal.styles.less';

interface MigrateRepForm {
  closeAction: Function;
  tradingAccount: string;
  convertV1ToV2: Function;
  approveV1ToV2: Function;
  gasPrice: number;
  walletBalances: AccountBalances;
}

export const MigrateRep = ({
  closeAction,
  convertV1ToV2,
  approveV1ToV2,
  tradingAccount,
  gasPrice,
  walletBalances,
}: MigrateRepForm) => {
  const [gasLimit, setGasLimit] = useState(V1_REP_MIGRATE_ESTIMATE);
  const [isApproved, setIsApproved] = useState(false);
  const ethForGas = walletBalances.signerBalances.eth;

  const showApproval = async () => {
    const approved = await isRepV2Approved(tradingAccount);
    return approved;
  };

  useEffect(() => {
    if (!isApproved) {
      const checkApproval = async () => {
        const tokenUnlocked = await showApproval();
        setIsApproved(tokenUnlocked);
      };
      checkApproval();
    }
  }, [walletBalances]);

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
        <span>
          {formatRep(walletBalances.signerBalances.legacyRep).formattedValue}
        </span>
      </div>
      <div>
        <TransactionFeeLabel gasEstimate={gasLimit} />
      </div>
      {!hasEnoughEthForGas && (
        <span className={Styles.Error}>
          {formatEther(gasEstimateInEth).formatted} ETH is needed for
          transaction fee
        </span>
      )}
      <DismissableNotice
        show
        title={`Your wallet will need to sign ${
          isApproved ? '1' : '2'
        } transactions`}
        buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.CLOSE}
      />
    </>
  );

  return (
    <div className={Styles.MigrateRep}>
      <Title title={'Migrate REP'} closeAction={closeAction} />

      <main>
        <h1>You have REP in your wallet</h1>

        <h2>
          Migrate your REP to REPv2 to use it in Augur v2. The quantity of REP
          shown below will migrate to an equal amount of REPv2. For example 100
          REP will migrate to 100 REPv2.
          <ExternalLinkButton
            label="Learn more"
            URL={HELP_CENTER_MIGRATE_REP}
          />
        </h2>

        {safeWalletContent}
      </main>
      <div className={Styles.ButtonsRow}>
        {!isApproved && (
          <ProcessingButton
            small
            text={'Approve'}
            action={() => approveV1ToV2()}
            queueName={TRANSACTIONS}
            queueId={APPROVE}
            disabled={isApproved}
          />
        )}

        {isApproved && (
          <ProcessingButton
            small
            text={'Migrate'}
            action={() => convertV1ToV2()}
            queueName={TRANSACTIONS}
            queueId={MIGRATE_FROM_LEG_REP_TOKEN}
            disabled={
              walletBalances.signerBalances.legacyRep === '0' ||
              !hasEnoughEthForGas ||
              !isApproved
            }
          />
        )}
        <SecondaryButton text={'Cancel'} action={closeAction} />
      </div>
    </div>
  );
};
