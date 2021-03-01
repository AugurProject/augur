import axios from 'axios';
import { Filter, Log } from '@augurproject/types';
import { retry } from 'async';
import * as _ from 'lodash';

const RETRY_TIMES = 7;
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
  //"tokensTransferred": ["universe", "token", "from", "to", "value", "tokenType", "market"],
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

const GENERIC_LOG_FIELDS = ["name", "blockNumber", "logIndex", "logPosition"];

const entityPluralSuffix = 'Events';

type LogAndPosition = Log & {
  logPosition: string;
}
type LogFieldDescriptions = {
  [logName: string]: string[]
}

type LogQueryResponse = {
  [logEntityName:string]: LogAndPosition[]
};

type LastLogPositions = {[logEntityName: string]: string};

function buildQuery(fromBlockNumber: number, toBlockNumber: number, logFieldDescriptions: LogFieldDescriptions, lastLogPositions: LastLogPositions) {
  let eventQueries = "";
  for (const [logName, eventFields] of Object.entries(logFieldDescriptions)) {
    const entityName = `${logName}${entityPluralSuffix}`;
    const lastLogPosition = lastLogPositions[entityName];

    // When a particular entity type has no more logs to fetch it is removed from
    // `lastLogPositions` -- which means that we can skip it when fetching
    if(typeof lastLogPosition === "undefined") continue;

    const fields = GENERIC_LOG_FIELDS.concat(eventFields);
    eventQueries += `${entityName}(where: { blockNumber_gte: ${fromBlockNumber}, blockNumber_lte: ${toBlockNumber}, logPosition_gt: ${JSON.stringify(lastLogPosition)}}, first: 1000) {\n${fields.join(",\n")}}\n`;
  }
  return `{
      ${eventQueries}
    }`;
}

export function* logQuery(fromBlockNumber: number, toBlockNumber: number, logFieldDescriptions: LogFieldDescriptions): Generator<string, LogAndPosition[], LogQueryResponse> {
  let allLogs = [];
  let lastLogPositions = Object.keys(logFieldDescriptions).reduce<LastLogPositions>((acc, logName) => {
    return {
      ...acc,
      [`${logName}${entityPluralSuffix}`]: ""
    }
  }, {});

  while (Object.keys(lastLogPositions).length > 0) {
    const lastLogs = yield buildQuery(fromBlockNumber, toBlockNumber, logFieldDescriptions, lastLogPositions);
    lastLogPositions = Object.keys(lastLogPositions).reduce((acc, key) => {
      if(lastLogs[key].length === 1000) {
        // We've fetched the max number of logs for this range -- so we could have more that we need
        // to page through.
        acc[key] = _.last(lastLogs[key]).logPosition;
      }
      return acc;
    }, {});

    const flattenedLogs = _.flatten(_.values(lastLogs));
    allLogs = [
      ...allLogs,
      ...flattenedLogs
    ]
  }

  return allLogs;
}

function makeSubgraphRequest(subgraphUrl: string, query: string): Promise<LogQueryResponse> {
  return makeGraphRequest(subgraphUrl, query) as Promise<LogQueryResponse>
}

function makeGraphRequest(url: string, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    retry({
        times: RETRY_TIMES,
        interval (retryCount) {
          return INTERVAL * Math.pow(2, retryCount);
        },
        errorFilter (err) { return true; }
      },
      async () => {
        const result = await axios.post(url, { query });
        if (result.data.errors !== undefined) {
          const message = `GraphQL Log Request Got ${result.data.errors.length} Errors: ${JSON.stringify(result.data.errors)}`;
          console.warn(message);
          throw new Error(message);
        }
        return result.data.data;
      },
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    )
  });
}

export class GraphQLLogProvider {
  subgraphUrl: string;

  constructor(
    subgraphUrl: string,
  ) {
    this.subgraphUrl = subgraphUrl;
  }

  async getLogs(filter: Filter): Promise<Log[]> {
    const i = logQuery(Number(filter.fromBlock), Number(filter.toBlock), eventFields);
    let result = i.next();
    while(!result.done) {
      const response = await makeSubgraphRequest(this.subgraphUrl, result.value as string);
      result = i.next(response);
    }

    return result.value;
  }

  async getSyncStatus() {
    const response  = await makeGraphRequest(
      "https://api.thegraph.com/index-node/graphql", `
      {
        status: indexingStatusForCurrentVersion(subgraphName: "${this.subgraphUrl.replace("https://api.thegraph.com/subgraphs/name/", "")}") {
          synced
          health
          fatalError {
            message
          }
          chains {
            chainHeadBlock {
              number
            }
            latestBlock {
              number
            }
          }
        }
      }
    `);
    const {synced, health, fatalError, chains} = response.status;
    return {
      synced,
      health,
      fatalError,
      chainHeadBlockNumber: parseInt(chains[0].chainHeadBlock.number),
      latestBlockNumber: parseInt(chains[0].latestBlock.number)
    }
  }
}
