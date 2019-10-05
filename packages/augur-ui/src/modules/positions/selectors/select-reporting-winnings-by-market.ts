import { createSelector } from 'reselect';
import {
  selectMarketInfosState,
  selectLoginAccountReportingState,
  selectDisputeWindowStats,
} from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { ZERO, REPORTING_STATE } from 'modules/common/constants';
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
      const claimable = userReporting.reporting.contracts.filter(
        contract => contract.isClaimable
      );
      claimableMarkets = {
        unclaimedRep: createBigNumber(userReporting.reporting.totalClaimable),
        marketContracts: claimable,
      };
    }
    if (
      userReporting &&
      userReporting.disputing &&
      userReporting.disputing.contracts.length > 0
    ) {
      const claimable = userReporting.disputing.contracts.filter(
        contract => contract.isClaimable
      );
      claimableMarkets = {
        unclaimedRep: claimableMarkets.unclaimedRep.plus(
          createBigNumber(userReporting.disputing.totalClaimable)
        ),
        marketContracts: [...claimableMarkets.marketContracts, ...claimable],
      };
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
