import { createSelector } from "reselect";
import { createBigNumber } from "utils/create-big-number";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { constants } from "services/augurjs";
import { isEmpty, orderBy } from "lodash";
import selectDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import { selectUniverseState } from "src/select-state";

export const selectMarketsInDisputeSelector = () =>
  createSelector(
    selectMarkets,
    selectDisputeOutcomes,
    selectUniverseState,
    (markets, disputeOutcomes, universe) => {
      if (isEmpty(markets)) {
        return [];
      }
      let filteredMarkets = markets.filter(
        market =>
          market.reportingState ===
            constants.REPORTING_STATE.AWAITING_FORK_MIGRATION ||
          market.reportingState ===
            constants.REPORTING_STATE.CROWDSOURCING_DISPUTE ||
          market.id === universe.forkingMarket
      );
      // Sort disputed markets by: 1) dispute round, and 2) highest percent staked in non-tentative-winning outcome
      Object.keys(filteredMarkets).forEach(marketKey => {
        if (filteredMarkets[marketKey].disputeInfo) {
          filteredMarkets[
            marketKey
          ].disputeInfo.highestPercentStaked = createBigNumber(0);
          Object.keys(filteredMarkets[marketKey].disputeInfo.stakes).forEach(
            stakeKey => {
              if (
                !filteredMarkets[marketKey].disputeInfo.stakes[stakeKey]
                  .tentativeWinning &&
                filteredMarkets[marketKey].disputeInfo.stakes[stakeKey]
                  .bondSizeCurrent
              ) {
                const percentStakedInOutcome = createBigNumber(
                  filteredMarkets[marketKey].disputeInfo.stakes[stakeKey]
                    .stakeCurrent
                ).div(
                  createBigNumber(
                    filteredMarkets[marketKey].disputeInfo.stakes[stakeKey]
                      .bondSizeCurrent
                  )
                );
                if (
                  percentStakedInOutcome.gt(
                    filteredMarkets[marketKey].disputeInfo.highestPercentStaked
                  )
                ) {
                  filteredMarkets[
                    marketKey
                  ].disputeInfo.highestPercentStaked = percentStakedInOutcome;
                }
              }
              filteredMarkets[
                marketKey
              ].disputeInfo.highestPercentStaked = filteredMarkets[
                marketKey
              ].disputeInfo.highestPercentStaked.toString();
            }
          );
        }
      });
      filteredMarkets = orderBy(
        filteredMarkets,
        ["disputeInfo.disputeRound", "disputeInfo.highestPercentStaked"],
        ["desc", "desc"]
      );

      // Potentially forking or forking markets come first
      const potentialForkingMarkets = [];
      const nonPotentialForkingMarkets = [];
      let forkingMarket = null;
      filteredMarkets.forEach(market => {
        if (market.id === universe.forkingMarket) {
          forkingMarket = market;
          return;
        }
        const outcomes = disputeOutcomes[market.id] || [];
        let potentialFork = false;
        outcomes.forEach((outcome, index) => {
          if (outcome.potentialFork) {
            potentialFork = true;
          }
        });
        if (potentialFork) {
          potentialForkingMarkets.push(market);
        } else {
          nonPotentialForkingMarkets.push(market);
        }
      });

      const orderedMarkets = potentialForkingMarkets.concat(
        nonPotentialForkingMarkets
      );
      if (!universe.isForking) return orderedMarkets;
      return [forkingMarket].concat(orderedMarkets);
    }
  );

export const selectMarketsInDispute = selectMarketsInDisputeSelector();
