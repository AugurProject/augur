import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { getGasPrice, getTransactionLabel } from 'modules/auth/selectors/get-gas-price';
import {
  formatGasCostToEther,
  formatAttoRep,
  formatAttoDai,
  formatEther,
  formatBlank,
} from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { Proceeds } from 'modules/modal/proceeds';
import { ActionRowsProps } from 'modules/modal/common';
import {
  redeemStake,
  redeemStakeBatches,
  redeemStakeGas,
} from 'modules/reporting/actions/claim-reporting-fees';
import {
  CLAIM_FEE_WINDOWS,
  CLAIM_STAKE_FEES,
  CLAIM_FEES_GAS_COST,
  ZERO,
  CLAIM_ALL_TITLE,
  REDEEMSTAKE,
  FORKANDREDEEM,
  DISAVOWCROWDSOURCERS,
  GWEI_CONVERSION,
} from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MarketReportClaimableContracts } from 'modules/types';
import { disavowMarket } from 'modules/contracts/actions/contractCalls';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { TRANSACTIONS } from 'modules/routes/constants/views';
import { TXEventName } from '@augurproject/sdk-lite';
import { addPendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { createBigNumber } from 'utils/create-big-number';
import { getGasCost } from 'modules/modal/gas';

const mapStateToProps = (state: AppState) => {
  const gasPrice = state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average;
  return {
    modal: state.modal,
    gasCost: CLAIM_FEES_GAS_COST.multipliedBy(gasPrice),
    pendingQueue: state.pendingQueue || [],
    claimReportingFees: selectReportingWinningsByMarket(state),
    forkingInfo: state.universe.forkingInfo,
    transactionLabel: getTransactionLabel(state),
    gasPrice,
    ethToDaiRate: state.appStatus.ethToDaiRate,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  redeemStake: (options, callback) => redeemStake(options, callback),
  redeemStakeGas: options => redeemStakeGas(options),
  disavowMarket: marketId => disavowMarket(marketId),
  addPendingData: (pendingId, queueName, status, hash, info) =>
    dispatch(addPendingData(pendingId, queueName, status, hash, info)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const transactionLabel = sP.transactionLabel;
  const participationTokensOnly = sP.modal.participationTokensOnly;
  const isForking = !!sP.forkingInfo;
  const forkingMarket = isForking ? sP.forkingInfo.forkingMarket : null;
  const { pendingQueue } = sP;
  const claimReportingFees = sP.claimReportingFees as MarketReportClaimableContracts;
  const modalRows: ActionRowsProps[] = [];

  const reportingParticipants = participationTokensOnly
    ? []
    : claimReportingFees.claimableMarkets.marketContracts.reduce(
        (p, c) => [...p, ...c.contracts],
        []
      );
  const allRedeemStakeOptions = {
    disputeWindows: claimReportingFees.participationContracts.contracts,
    reportingParticipants,
  };
  const submitAllTxCount = redeemStakeBatches(allRedeemStakeOptions);
  const claimableMarkets = claimReportingFees.claimableMarkets;
  const showBreakdown = (claimableMarkets.marketContracts.length + reportingParticipants.length) > 1;
  const totalRep = `${formatAttoRep(claimReportingFees.totalUnclaimedRep).formatted} REPv2`;

  if (!participationTokensOnly) {
    claimableMarkets.marketContracts.map(marketObj => {
      const market = marketObj.marketObject;
      if (market) {
        const marketRep = formatAttoRep(marketObj.totalAmount);
        const isForkingMarket = market.id === forkingMarket;

        const pending =
          pendingQueue[CLAIM_STAKE_FEES] &&
          pendingQueue[CLAIM_STAKE_FEES][marketObj.marketId];
        const redeemStakeOptions = {
          disputeWindows: [],
          reportingParticipants: marketObj.contracts,
          disavowed: market.disavowed ? true : false,
          isForkingMarket,
        };
        const marketTxCount = redeemStakeBatches(redeemStakeOptions);
        let notice = undefined;
        let action = () => dP.redeemStake(redeemStakeOptions);
        let estimateGas = async () => {
          const gasLimit = await dP.redeemStakeGas(redeemStakeOptions);
          const gasCostDai = getGasCost(gasLimit, sP.gasPrice, sP.ethToDaiRate);
          const displayfee = `$${gasCostDai.formattedValue}`;
          return {
            label: transactionLabel,
            value: String(displayfee),
          };
        };
        let buttonText = 'Claim';
        let queueName = REDEEMSTAKE;
        let queueId = marketObj.contracts[0];

        if (isForking) {
          if (!market.disavowed) {
            buttonText = 'Disavow Market REPv2';
            notice =
              'Disavow Market disputing REPv2 in order to release REPv2, releasing REPv2 will be in a separate transaction';
            queueName = DISAVOWCROWDSOURCERS;
            queueId = market.id;
            action = () => {
              dP.addPendingData(market.id, DISAVOWCROWDSOURCERS, TXEventName.Pending, '0', undefined);
              dP.disavowMarket(market.id).catch(err => {
                dP.addPendingData(market.id, DISAVOWCROWDSOURCERS, TXEventName.Failure, 0, undefined)
              });
            };
          } else if (market.disavowed && marketTxCount > 1) {
            notice = `Releasing REPv2 will take ${marketTxCount} Transactions`;
            buttonText = 'Release REPv2';
          }

          if (isForkingMarket) {
            buttonText = 'Release and Migrate REPv2';
            queueName = TRANSACTIONS;
            queueId = FORKANDREDEEM;
            notice =
              marketTxCount > 1
                ? `Forking market, releasing REPv2 will take ${marketTxCount} Transactions and be sent to corresponding child universe`
                : 'Forking market, release REPv2 will be sent to corresponding child universe';
          }
        }

        if (market.disavowed) buttonText = 'Release REPv2';
        modalRows.push({
          title: market.description,
          text: buttonText,
          status: pending && pending.status,
          notice,
          marketTxCount,
          queueName,
          queueId,
          properties: [
            {
              label: 'Reporting stake',
              value: `${marketRep.formatted || 0} REPv2`,
              addExtraSpace: true,
            },
          ],
          action: showBreakdown ? action : null,
          estimateGas,
        });
      }
    });
  }

  let daiFormatted = formatBlank();

  if (claimReportingFees.participationContracts.unclaimedRep.gt(ZERO)) {
    const disputeWindowsPending =
      pendingQueue[CLAIM_STAKE_FEES] &&
      pendingQueue[CLAIM_STAKE_FEES][CLAIM_FEE_WINDOWS];

    const repFormatted = formatAttoRep(
      claimReportingFees.participationContracts.unclaimedRep
    );
    daiFormatted = formatAttoDai(
      claimReportingFees.participationContracts.unclaimedDai
    );
    modalRows.push({
      title: isForking
        ? 'Release Participation REPv2'
        : 'Reedeem all participation tokens',
      queueName: REDEEMSTAKE,
      queueId: claimReportingFees.participationContracts.contracts[0],
      text: 'Claim',
      status: disputeWindowsPending,
      properties: [
        {
          label: 'Reporting Stake',
          value: `${repFormatted.formatted} REPv2`,
          addExtraSpace: true,
        },
        {
          label: 'Reporting Fees',
          value: `$${daiFormatted.formattedValue}`,
        },
      ],
      action: () => {
        const redeemStakeOptions = {
          disputeWindows: claimReportingFees.participationContracts.contracts,
          reportingParticipants: [],
        };
        dP.redeemStake(redeemStakeOptions);
      },
      estimateGas: async () => {
        const redeemStakeOptions = {
          disputeWindows: claimReportingFees.participationContracts.contracts,
          reportingParticipants: [],
        };
        const gasLimit = await dP.redeemStakeGas(redeemStakeOptions);
        const gasCostDai = getGasCost(gasLimit, sP.gasPrice, sP.ethToDaiRate);
        const displayfee = `$${gasCostDai.formattedValue}`;
        return {
          label: transactionLabel,
          value: String(displayfee),
        };
      },
    });
  }

  if (modalRows.length === 0) {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
    return {};
  }

  const breakdown = showBreakdown ? [
    {
      label: 'Total REPv2',
      value: totalRep,
    },
    {
      label: 'Total DAI',
      value: `$${daiFormatted.formattedValue}`,
    },
  ] : null;

  return {
    title: isForking ? 'Release REPv2' : 'Claim Stake & Fees',
    submitAllTxCount: isForking ? 0 : submitAllTxCount,
    descriptionMessage: participationTokensOnly
      ? [
          {
            preText: 'You have',
            boldText: `${
              formatAttoRep(
                claimReportingFees.participationContracts.unclaimedRep
              ).formatted
            } REPv2`,
            postText: 'available to be claimed from your reporting stake ',
          },
          {
            preText: ' and',
            boldText: `${claimReportingFees.totalUnclaimedDaiFormatted.formattedValue} DAI`,
            postText:
              'of reporting fees to collect from the following markets:',
          },
        ]
      : [
          {
            preText: 'You have',
            boldText: `${claimReportingFees.totalUnclaimedRepFormatted.formatted} REPv2`,
            postText: 'available to be claimed from your reporting stake ',
          },
          {
            preText: ' and',
            boldText: `${claimReportingFees.totalUnclaimedDaiFormatted.formattedValue} DAI`,
            postText:
              'of reporting fees to collect from the following markets:',
          },
        ],
    rows: modalRows,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    estimateGas: async () => {
      if (!!breakdown) {
        const gasLimit = await dP.redeemStakeGas(allRedeemStakeOptions);
        const gasCostDai = getGasCost(gasLimit, sP.gasPrice, sP.ethToDaiRate);
        return {
          label: transactionLabel,
          value: `$${gasCostDai.formattedValue}`,
        };
      }
      return null;
    },
    breakdown,
    buttons:
      isForking || participationTokensOnly
        ? null
        : [
            {
              text: CLAIM_ALL_TITLE,
              disabled: modalRows.find(market => market.status === 'pending'),
              action: () => {
                dP.redeemStake(allRedeemStakeOptions, () => {
                  if (sP.modal.cb) {
                    sP.modal.cb();
                  }
                });
                dP.closeModal();
              },
            },
            {
              text: 'Close',
              action: () => {
                if (sP.modal.cb) {
                  sP.modal.cb();
                }
                dP.closeModal();
              },
            },
          ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);
