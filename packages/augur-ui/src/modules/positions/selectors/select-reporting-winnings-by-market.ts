import { createSelector } from 'reselect';
import {
  selectMarketInfosState,
  selectLoginAccountReportingState,
} from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import { Getters } from '@augurproject/sdk';
import {
  MarketReportClaimableContracts,
  marketsReportingCollection,
} from 'modules/types';
import { formatAttoDai, formatAttoRep } from 'utils/format-number';

export const selectReportingWinningsByMarket = createSelector(
  selectLoginAccountReportingState,
  selectMarketInfosState,
  (
    userReporting,
    marketInfos // this is needed to trigger the selector if marketInfos changes
  ): MarketReportClaimableContracts => {
    let claimableMarkets = {
      unclaimedRep: ZERO,
      marketContracts: [],
    };

    let participationContracts = {
      contracts: [],
      unclaimedDai: ZERO,
      unclaimedRep: ZERO,
    };
    if (
      userReporting &&
      userReporting.participationTokens &&
      userReporting.participationTokens.contracts.length > 0
    ) {
      const calcUnclaimed = userReporting.participationTokens.contracts.reduce(
        (p, c) =>
          c.isClaimable
            ? {
                contracts: [...p.contracts, c.address],
                dai: p.dai.plus(c.amountFees),
                rep: p.rep.plus(createBigNumber(c.amount)),
              }
            : p,
        { contracts: [], dai: ZERO, rep: ZERO }
      );
      participationContracts = {
        contracts: calcUnclaimed.contracts,
        unclaimedDai: calcUnclaimed.dai,
        unclaimedRep: calcUnclaimed.rep,
      };
    }
    if (
      userReporting &&
      userReporting.reporting &&
      userReporting.reporting.contracts.length > 0
    ) {
      claimableMarkets = userReporting.reporting.contracts.reduce(
        (p, contract) => (contract.isClaimable ? sumClaims(contract, p) : p),
        claimableMarkets
      );
    }
    if (
      userReporting &&
      userReporting.disputing &&
      userReporting.disputing.contracts.length > 0
    ) {
      claimableMarkets = userReporting.disputing.contracts.reduce(
        (p, contract) => (contract.isClaimable ? sumClaims(contract, p) : p),
        claimableMarkets
      );
    }
    const totalUnclaimedDai = participationContracts.unclaimedDai;
    const totalUnclaimedRep = participationContracts.unclaimedRep.plus(
      claimableMarkets.unclaimedRep
    );
    return {
      participationContracts,
      claimableMarkets,
      totalUnclaimedDai,
      totalUnclaimedRep,
      totalUnclaimedDaiFormatted: formatAttoDai(totalUnclaimedDai),
      totalUnclaimedRepFormatted: formatAttoRep(totalUnclaimedRep),
    };
  }
);

function sumClaims(
  contractInfo: Getters.Accounts.ContractInfo,
  marketsCollection: marketsReportingCollection
): marketsReportingCollection {
  const marketId = contractInfo.marketId;
  let addedValue = ZERO;
  const found = marketsCollection.marketContracts.find(
    c => c.marketId === marketId
  );
  if (found) {
    found.totalAmount = createBigNumber(found.totalAmount).plus(
      createBigNumber(contractInfo.amount)
    );
    found.contracts = [...found.contracts, contractInfo.address];
    addedValue = createBigNumber(contractInfo.amount);
  } else {
    addedValue = createBigNumber(contractInfo.amount);
    marketsCollection.marketContracts = [
      ...marketsCollection.marketContracts,
      {
        ...contractInfo,
        contracts: [contractInfo.address],
        totalAmount: createBigNumber(contractInfo.amount),
        marketObject: selectMarket(contractInfo.marketId),
      },
    ];
  }
  marketsCollection.unclaimedRep = marketsCollection.unclaimedRep.plus(
    addedValue
  );
  return marketsCollection;
}
