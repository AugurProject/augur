import axios from 'axios';
import { Filter, Log } from '@augurproject/types';
import { retry } from 'async';
import * as _ from 'lodash';

const RETRY_TIMES = 3;
const INTERVAL = 1000;

const eventFields = {
  "marketCreated": ["universe", "endTime", "extraInfo", "market", "marketCreator", "designatedReporter", "feePerCashInAttoCash", "prices", "marketType", "numTicks", "outcomes", "noShowBond", "timestamp"],
  "initialReportSubmitted": ["universe", "reporter", "market", "initialReporter", "amountStaked", "isDesignatedReporter", "payoutNumerators", "description", "nextWindowStartTime", "nextWindowEndTime", "timestamp"],
  "disputeCrowdsourcerCreated": ["universe", "market", "disputeCrowdsourcer", "payoutNumerators", "size", "disputeRound"],
  "disputeCrowdsourcerContribution": ["universe", "reporter", "market", "disputeCrowdsourcer", "amountStaked", "description", "payoutNumerators", "currentStake", "stakeRemaining", "disputeRound", "timestamp"],
  "disputeCrowdsourcerCompleted": ["universe", "market", "disputeCrowdsourcer", "payoutNumerators", "nextWindowStartTime", "nextWindowEndTime", "pacingOn", "totalRepStakedInPayout", "totalRepStakedInMarket", "disputeRound", "timestamp"],
  "initialReporterRedeemed": ["universe", "reporter", "market", "initialReporter", "amountRedeemed", "repReceived", "payoutNumerators", "timestamp"],
  "disputeCrowdsourcerRedeemed": ["universe", "reporter", "market", "disputeCrowdsourcer", "amountRedeemed", "repReceived", "payoutNumerators", "timestamp"],
  "reportingParticipantDisavowed": ["universe", "market", "reportingParticipant"],
  "marketParticipantsDisavowed": ["universe", "market"],
  "marketFinalized": ["universe", "market", "timestamp", "winningPayoutNumerators"],
  "marketMigrated": ["market", "originalUniverse", "newUniverse"],
  "universeForked": ["universe", "forkingMarket"],
  "universeCreated": ["parentUniverse", "childUniverse", "payoutNumerators", "creationTimestamp"],
  "completeSetsPurchased": ["universe", "market", "account", "numCompleteSets", "timestamp"],
  "completeSetsSold": ["universe", "market", "account", "numCompleteSets", "fees", "timestamp"],
  "tradingProceedsClaimed": ["universe", "sender", "market", "outcome", "numShares", "numPayoutTokens", "fees", "timestamp"],
  "tokensTransferred": ["universe", "token", "from", "to", "value", "tokenType", "market"],
  "tokensMinted": ["universe", "token", "target", "amount", "tokenType", "market", "totalSupply"],
  "tokensBurned": ["universe", "token", "target", "amount", "tokenType", "market", "totalSupply"],
  "tokenBalanceChanged": ["universe", "owner", "token", "tokenType", "market", "balance", "outcome"],
  "disputeWindowCreated": ["universe", "disputeWindow", "startTime", "endTime", "id", "initial"],
  "initialReporterTransferred": ["universe", "market", "from", "to"],
  "marketTransferred": ["universe", "market", "from", "to"],
  "marketOIChanged": ["universe", "market", "marketOI"],
  "participationTokensRedeemed": ["universe", "disputeWindow", "account", "attoParticipationTokens", "feePayoutShare", "timestamp"],
  "timestampSet": ["newTimestamp"],
  "validityBondChanged": ["universe", "validityBond"],
  "designatedReportStakeChanged": ["universe", "designatedReportStake"],
  "noShowBondChanged": ["universe", "noShowBond"],
  "reportingFeeChanged": ["universe", "reportingFee"],
  "shareTokenBalanceChanged": ["universe", "account", "market", "outcome", "balance"],
  "marketRepBondTransferred": ["universe", "market", "from", "to"],
  "warpSyncDataUpdated": ["universe", "warpSyncHash", "marketEndTime"],
  "orderEvent": ["universe", "market", "eventType", "orderType", "orderId", "tradeGroupId", "addressData", "uint256Data"],
  "profitLossChanged": ["universe", "market", "account", "outcome", "netPosition", "avgPrice", "realizedProfit", "frozenFunds", "realizedCost", "timestamp"],
  "marketVolumeChanged": ["universe", "market", "volume", "outcomeVolumes", "totalTrades", "timestamp"],
  "cancelZeroXOrder": ["universe", "market", "account", "outcome", "price", "amount", "orderType", "orderHash"]
}

const GENERIC_LOG_FIELDS = ["name", "blockNumber", "logIndex"];

export class GraphQLLogProvider {
  subgraphUrl: string;

  constructor(
    subgraphUrl: string,
  ) {
    this.subgraphUrl = subgraphUrl;
  }

  async getLogs(filter: Filter): Promise<Log[]> {

    return new Promise((resolve, reject) => {
      retry({
          times: RETRY_TIMES,
          interval (retryCount) {
            return INTERVAL * Math.pow(2, retryCount);
          },
          errorFilter (err) { return true; }
        },
        async () => {
          const query = buildQuery(filter.fromBlock, filter.toBlock);
          const result = await axios.post(this.subgraphUrl, { query });
          if (result.data.errors !== undefined) {
            const message = `GraphQL Log Request Got ${result.data.errors.length} Errors: ${JSON.stringify(result.data.errors)}`;
            console.warn(message);
            throw new Error(message);
          }
          return _.flatten(_.values(result.data.data));
        },
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      )
    });
  }
}

function buildQuery(fromBlock: string | number, toBlock: string | number): string {
    let eventQueries = "";
    for (const eventName in eventFields) {
        const fields = GENERIC_LOG_FIELDS.concat(eventFields[eventName]);
        eventQueries += `${eventName}Events(where: { blockNumber_gte: ${fromBlock}, blockNumber_lte: ${toBlock} }) {${fields.join(",")}}`;
    }
    return `
    {
      ${eventQueries}
    }
    `;
}
