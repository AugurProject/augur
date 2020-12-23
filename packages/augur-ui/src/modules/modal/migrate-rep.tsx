import React, { useState, useEffect } from 'react';

import { Title } from 'modules/modal/common';
import {
  formatRep,
  formatGasCostToEther,
  formatEther,
} from 'utils/format-number';
import { ExternalLinkButton, ProcessingButton, SecondaryButton } from 'modules/common/buttons';
import { TransactionFeeLabel } from 'modules/common/labels';
import {
  V1_REP_MIGRATE_ESTIMATE,
  HELP_CENTER_MIGRATE_REP,
  GWEI_CONVERSION,
  TRANSACTIONS,
  APPROVE, MIGRATE_FROM_LEG_REP_TOKEN
} from 'modules/common/constants';
import {
  approveRepV2,
  convertRepV2,
} from 'modules/account/actions/convert-v1-rep-to-v2';
import { createBigNumber } from 'utils/create-big-number';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { DISMISSABLE_NOTICE_BUTTON_TYPES, DismissableNotice } from 'modules/reporting/common';
import { getGasCost } from 'modules/modal/gas';
import { isRepV2Approved } from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/modal/modal.styles.less';

export const MigrateRep = () => {
  const {
    loginAccount: { address, balances },
    gasPriceInfo,
    ethToDaiRate,
    actions: { closeModal },
  } = useAppStatusStore();

  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const [gasLimit, setGasLimit] = useState(V1_REP_MIGRATE_ESTIMATE);
  const [isApproved, setIsApproved] = useState(false);
  const ethForGas = balances.eth;
  const gasCostDai = getGasCost(gasLimit, gasPrice, ethToDaiRate);
  const displayfee = `$${gasCostDai.formattedValue}`;

  const showApproval = async () => {
    const approved = await isRepV2Approved(address);
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
  }, [balances]);

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
          {formatRep(balances.legacyRep).formattedValue}
        </span>
      </div>
      <div>
        <TransactionFeeLabel gasCostDai={displayfee} />
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
      <Title title={'Migrate REP'} closeAction={closeModal} />

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
            action={() => approveRepV2()}
            queueName={TRANSACTIONS}
            queueId={APPROVE}
            disabled={isApproved}
          />
        )}

        {isApproved && (
          <ProcessingButton
            small
            text={'Migrate'}
            action={() => convertRepV2()}
            queueName={TRANSACTIONS}
            queueId={MIGRATE_FROM_LEG_REP_TOKEN}
            disabled={
              balances.legacyRep === '0' ||
              !hasEnoughEthForGas ||
              !isApproved
            }
          />
        )}
        <SecondaryButton text={'Cancel'} action={closeModal} />
      </div>
    </div>
  );
};
