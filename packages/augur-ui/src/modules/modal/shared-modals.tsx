import React from 'react';

import { Proceeds } from 'modules/modal/proceeds';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  CLAIM_FEES_GAS_COST,
  CLAIM_STAKE_FEES,
  REDEEMSTAKE,
  DISAVOWCROWDSOURCERS,
  TRANSACTIONS,
  FORKANDREDEEM,
  ZERO,
  CLAIM_FEE_WINDOWS,
  CLAIM_ALL_TITLE,
  CLAIM_MARKETS_PROCEEDS,
  PROCEEDS_TO_CLAIM_TITLE,
  MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT,
  NEW_ORDER_GAS_ESTIMATE,
} from 'modules/common/constants';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { getTransactionLabel } from 'modules/auth/helpers/get-gas-price';
import {
  MarketReportClaimableContracts,
  MarketClaimablePositions,
  MarketData,
} from 'modules/types';
import { ActionRowsProps } from './common';
import {
  redeemStakeBatches,
  redeemStake,
  redeemStakeGas,
} from 'modules/reporting/actions/claim-reporting-fees';
import {
  formatAttoRep,
  formatEther,
  formatBlank,
  formatAttoDai,
  formatDai,
  formatGasCostToEther,
} from 'utils/format-number';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { addPendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { disavowMarket } from 'modules/contracts/actions/contractCalls';
import { TXEventName } from '@augurproject/sdk/src';
import { getLoginAccountClaimableWinnings } from 'modules/positions/selectors/login-account-claimable-winnings';
import { labelWithTooltip } from 'modules/common/labels.styles.less';
import {
  startClaimingMarketsProceeds,
  claimMarketsProceedsGas,
} from 'modules/positions/actions/claim-markets-proceeds';
import { UnsignedOrders } from './unsigned-orders';
import { usePendingOrdersStore } from 'modules/app/store/pending-orders';
import { selectMarket } from 'modules/markets/selectors/market';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { createBigNumber } from 'utils/create-big-number';
import { startOrderSending } from 'modules/orders/actions/liquidity-management';
import { Getters } from '@augurproject/sdk';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';

export const ModalClaimFees = () => {
  const {
    pendingQueue = [],
    universe: { forkingInfo },
    modal,
    gasPriceInfo,
    actions: { closeModal },
  } = useAppStatusStore();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;

  const gasCost = CLAIM_FEES_GAS_COST.multipliedBy(gasPrice);
  const claimReportingFees = selectReportingWinningsByMarket();
  const transactionLabel = getTransactionLabel();

  const participationTokensOnly = modal.participationTokensOnly;
  const isForking = !!forkingInfo;
  const forkingMarket = isForking ? forkingInfo.forkingMarket : null;
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
  const showBreakdown =
    claimableMarkets.marketContracts.length + reportingParticipants.length > 1;
  const totalRep = `${
    formatAttoRep(claimReportingFees.totalUnclaimedRep).formatted
  } REP`;

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
        let action = () => redeemStake(redeemStakeOptions);
        let estimateGas = async () => {
          const gas = await redeemStakeGas(redeemStakeOptions);
          const displayfee = GsnEnabled
            ? displayGasInDai(gas)
            : formatEther(gas).formattedValue;
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
            buttonText = 'Disavow Market REP';
            notice =
              'Disavow Market disputing REP in order to release REP, releasing REP will be in a separate transaction';
            queueName = DISAVOWCROWDSOURCERS;
            queueId = market.id;
            action = () => {
              addPendingData(
                market.id,
                DISAVOWCROWDSOURCERS,
                TXEventName.Pending,
                '0',
                undefined
              );
              disavowMarket(market.id).catch(err => {
                addPendingData(
                  market.id,
                  DISAVOWCROWDSOURCERS,
                  TXEventName.Failure,
                  0,
                  undefined
                );
              });
            };
          } else if (market.disavowed && marketTxCount > 1) {
            notice = `Releasing REP will take ${marketTxCount} Transactions`;
            buttonText = 'Release REP';
          }

          if (isForkingMarket) {
            buttonText = 'Release and Migrate REP';
            queueName = TRANSACTIONS;
            queueId = FORKANDREDEEM;
            notice =
              marketTxCount > 1
                ? `Forking market, releasing REP will take ${marketTxCount} Transactions and be sent to corresponding child universe`
                : 'Forking market, release REP will be sent to corresponding child universe';
          }
        }

        if (market.disavowed) buttonText = 'Release REP';
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
              value: `${marketRep.formatted || 0} REP`,
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
        ? 'Release Participation REP'
        : 'Reedeem all participation tokens',
      queueName: REDEEMSTAKE,
      queueId: claimReportingFees.participationContracts.contracts[0],
      text: 'Claim',
      status: disputeWindowsPending,
      properties: [
        {
          label: 'Reporting Stake',
          value: `${repFormatted.formatted} REP`,
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
        redeemStake(redeemStakeOptions);
      },
      estimateGas: async () => {
        const redeemStakeOptions = {
          disputeWindows: claimReportingFees.participationContracts.contracts,
          reportingParticipants: [],
        };
        const gas = await redeemStakeGas(redeemStakeOptions);
        const displayfee = GsnEnabled
          ? displayGasInDai(gas)
          : formatEther(gas).formattedValue;
        return {
          label: transactionLabel,
          value: String(displayfee),
        };
      },
    });
  }

  if (modalRows.length === 0) {
    if (modal.cb) {
      modal.cb();
    }
    closeModal();
    return {};
  }

  const breakdown = showBreakdown
    ? [
        {
          label: 'Total REP',
          value: totalRep,
        },
        {
          label: 'Total DAI',
          value: `$${daiFormatted.formattedValue}`,
        },
      ]
    : null;

  return (
    <Proceeds
      title={isForking ? 'Release REP' : 'Claim Stake & Fees'}
      submitAllTxCount={isForking ? 0 : submitAllTxCount}
      descriptionMessage={
        participationTokensOnly
          ? [
              {
                preText: 'You have',
                boldText: `${
                  formatAttoRep(
                    claimReportingFees.participationContracts.unclaimedRep
                  ).formatted
                } REP`,
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
                boldText: `${claimReportingFees.totalUnclaimedRepFormatted.formatted} REP`,
                postText: 'available to be claimed from your reporting stake ',
              },
              {
                preText: ' and',
                boldText: `${claimReportingFees.totalUnclaimedDaiFormatted.formattedValue} DAI`,
                postText:
                  'of reporting fees to collect from the following markets:',
              },
            ]
      }
      rows={modalRows}
      closeAction={() => {
        if (modal.cb) {
          modal.cb();
        }
        closeModal();
      }}
      estimateGas={async () => {
        if (!!breakdown) {
          const gas = await redeemStakeGas(allRedeemStakeOptions);
          const displayfee = GsnEnabled
            ? displayGasInDai(gas)
            : formatEther(gas).formattedValue;
          return {
            label: transactionLabel,
            value: String(displayfee),
          };
        }
        return null;
      }}
      breakdown={breakdown}
      buttons={
        isForking || participationTokensOnly
          ? null
          : [
              {
                text: CLAIM_ALL_TITLE,
                disabled: modalRows.find(market => market.status === 'pending'),
                action: () => {
                  redeemStake(allRedeemStakeOptions, () => {
                    if (modal.cb) {
                      modal.cb();
                    }
                  });
                  closeModal();
                },
              },
              {
                text: 'Close',
                action: () => {
                  if (modal.cb) {
                    modal.cb();
                  }
                  closeModal();
                },
              },
            ]
      }
    />
  );
};

export const ModalClaimMarketsProceeds = () => {
  const {
    pendingQueue = [],
    loginAccount: { address: account },
    modal,
    gasPriceInfo,
    ethToDaiRate,
    blockchain: { currentAugurTimestamp: currentTimestamp },
    actions: { closeModal },
  } = useAppStatusStore();
  const accountMarketClaimablePositions: MarketClaimablePositions = getLoginAccountClaimableWinnings();

  const totalUnclaimedProfit =
    accountMarketClaimablePositions.totals.totalUnclaimedProfit;
  const totalUnclaimedProceeds =
    accountMarketClaimablePositions.totals.totalUnclaimedProceeds;
  const totalFees = accountMarketClaimablePositions.totals.totalFees;
  const transactionLabel = getTransactionLabel();
  const showBreakdown = accountMarketClaimablePositions.markets.length > 1;
  let claimableMarkets = [];
  if (
    accountMarketClaimablePositions.markets &&
    accountMarketClaimablePositions.markets.length > 0
  ) {
    claimableMarkets = accountMarketClaimablePositions.markets.map(
      (market: MarketData) => {
        const marketId = market.id;
        const claimablePosition =
          accountMarketClaimablePositions.positions[marketId];
        const pending =
          pendingQueue[CLAIM_MARKETS_PROCEEDS] &&
          pendingQueue[CLAIM_MARKETS_PROCEEDS][marketId];

        const unclaimedProceeds = formatDai(
          claimablePosition.unclaimedProceeds
        );
        return {
          marketId,
          title: market.description,
          status: pending && pending.status,
          properties: [
            {
              label: 'Proceeds after market fees',
              value: unclaimedProceeds.full,
            },
          ],
          text: PROCEEDS_TO_CLAIM_TITLE,
          action: showBreakdown
            ? () => startClaimingMarketsProceeds([marketId], account, () => {})
            : null,
          estimateGas: async () => {
            const gas = await claimMarketsProceedsGas([marketId], account);
            const displayfee = GsnEnabled
              ? displayGasInDai(gas)
              : formatEther(gas).formattedValue;
            return {
              label: transactionLabel,
              value: String(displayfee),
            };
          },
        };
      }
    );
  }

  const multiMarket = claimableMarkets.length > 1 ? 's' : '';
  const totalUnclaimedProceedsFormatted = formatDai(totalUnclaimedProceeds);
  const submitAllTxCount = Math.ceil(
    claimableMarkets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  if (claimableMarkets.length === 0) {
    if (modal.cb) {
      modal.cb();
    }
    closeModal();
    return null;
  }

  const breakdown = showBreakdown
    ? [
        {
          label: 'Total Proceeds',
          value: totalUnclaimedProceedsFormatted.formatted,
        },
      ]
    : null;

  return (
    <Proceeds
      title={PROCEEDS_TO_CLAIM_TITLE}
      descriptionMessage={[
        {
          preText: 'You currently have a total of',
          boldText: totalUnclaimedProceedsFormatted.full,
        },
      ]}
      rows={claimableMarkets}
      submitAllTxCount={submitAllTxCount}
      estimateGas={async () => {
        if (breakdown) {
          const gas = await claimMarketsProceedsGas(
            claimableMarkets.map(m => m.marketId),
            account
          );
          const displayfee = GsnEnabled
            ? displayGasInDai(gas)
            : formatEther(gas).formattedValue;
          return {
            label: transactionLabel,
            value: String(displayfee),
          };
        }
        return null;
      }}
      breakdown={breakdown}
      closeAction={() => {
        if (modal.cb) {
          modal.cb();
        }
        closeModal();
      }}
      buttons={[
        {
          text: `${multiMarket ? CLAIM_ALL_TITLE : PROCEEDS_TO_CLAIM_TITLE}`,
          disabled: claimableMarkets.find(
            market => market.status === 'pending'
          ),
          action: () => {
            startClaimingMarketsProceeds(
              claimableMarkets.map(m => m.marketId),
              account,
              modal.cb
            );
            closeModal();
          },
        },
        {
          text: 'Close',
          action: () => {
            if (modal.cb) {
              modal.cb();
            }
            closeModal();
          },
        },
      ]}
    />
  );
};

export const ModalOpenOrders = () => {
  const {
    loginAccount,
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
  const market = selectMarket(modal.marketId);
  const userOpenOrders = getUserOpenOrders(modal.marketId) || [];
  const openOrders = userOpenOrders;
  const { description: marketTitle, marketId } = market;

  return (
    <UnsignedOrders
      title='Open Orders in resolved market'
      description={['You have open orders in this resolved market:']}
      marketId={marketId}
      openOrders
      marketTitle={marketTitle}
      orders={openOrders}
      buttons={[
        {
          text: 'Cancel All',
          action: () => {
            cancelAllOpenOrders(openOrders);
            closeModal();
          },
        },
        {
          text: 'Close',
          action: () => {
            if (modal.cb) {
              modal.cb();
            }
            closeModal();
          },
        },
      ]}
      closeAction={() => {
        if (modal.cb) {
          modal.cb();
        }
        closeModal();
      }}
    />
  );
};

export const ModalUnsignedOrders = () => {
  const {
    loginAccount,
    modal,
    ethToDaiRate,
    gasPriceInfo,
    actions: { closeModal },
  } = useAppStatusStore();
  const {
    pendingLiquidityOrders,
  } = usePendingOrdersStore();
  const market = selectMarket(modal.marketId);
  let availableDai = totalTradingBalance();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;

  const liquidity = pendingLiquidityOrders[market.transactionHash];
  let numberOfTransactions = 0;
  let totalCost = ZERO;

  market.outcomes.forEach((outcome: Getters.Markets.MarketInfoOutcome) => {
    liquidity &&
      liquidity[outcome.id] &&
      liquidity[outcome.id].forEach((order: any, index: number) => {
        totalCost = totalCost.plus(order.orderEstimate);
        numberOfTransactions += 1;
      });
  });

  const gasCost = GsnEnabled
    ? NEW_ORDER_GAS_ESTIMATE.times(numberOfTransactions).multipliedBy(gasPrice)
    : formatGasCostToEther(
        NEW_ORDER_GAS_ESTIMATE.times(numberOfTransactions).toFixed(),
        { decimalsRounded: 4 },
        gasPrice
      );

  const bnAllowance = createBigNumber(loginAccount.allowance, 10);
  const needsApproval = bnAllowance.lte(ZERO);
  const insufficientFunds = availableDai.lt(totalCost);
  const {
    marketType,
    scalarDenomination,
    description: marketTitle,
    id: marketId,
    numTicks,
    minPrice,
    maxPrice,
    transactionHash,
  } = market;
  // all orders have been created or removed.
  if (numberOfTransactions === 0) {
    if (modal.cb) {
      modal.cb();
    }
    closeModal();
  }
  return (
    <UnsignedOrders
      title='Unsigned Orders'
      description={[
        "You have unsigned orders pending for this market's initial liquidity:",
      ]}
      scalarDenomination={scalarDenomination}
      marketType={marketType}
      marketTitle={marketTitle}
      marketId={marketId}
      numTicks={numTicks}
      maxPrice={maxPrice}
      minPrice={minPrice}
      transactionHash={transactionHash}
      needsApproval={needsApproval}
      insufficientFunds={insufficientFunds}
      numberOfTransactions={numberOfTransactions}
      breakdown={[
        {
          label: 'Total Cost (DAI)',
          value: formatDai(totalCost.toFixed()).full,
          highlight: true,
        },
      ]}
      header={[
        'outcome',
        'type',
        'quantity',
        'price',
        'estimated costs (dai)',
        '',
        '',
      ]}
      liquidity={liquidity}
      outcomes={liquidity && Object.keys(liquidity)}
      bnAllowance={bnAllowance}
      buttons={[
        {
          disabled: insufficientFunds,
          text: 'Submit All',
          action: () => startOrderSending({ marketId }),
        },
        // Temporarily removed because there is no confirmation, the button just cancels everything on a single click
        // {
        //   text: 'Cancel All',
        //   action: () => {
        //     clearMarketLiquidityOrders(market.transactionHash);
        //     closeModal();
        //   },
        // },
        {
          text: 'Close',
          action: () => {
            closeModal();
          },
        },
      ]}
      closeAction={() => {
        closeModal();
      }}
    />
  );
};
