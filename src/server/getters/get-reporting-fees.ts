import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, AsyncCallback, ReportingState } from "../../types";
import Augur from "augur.js";
import { ZERO } from "../../constants";
import { groupByAndSum } from "./database";

export interface CrowdsourcerState {
  crowdsourcerId: Address;
  isForked: boolean;
}

export interface InitialReporterState {
  initialReporterId: Address;
  isForked: boolean;
}

export interface ForkedMarket {
  marketId: Address;
  universe: Address;
  isFinalized: boolean;
  crowdsourcers: Array<CrowdsourcerState>;
  initialReporter: InitialReporterState|null;
}

export interface NonforkedMarket {
  marketId: Address;
  universe: Address;
  crowdsourcersAreDisavowed: boolean;
  isFinalized: boolean;
  isMigrated: boolean;
  crowdsourcers: Array<Address>;
  initialReporter: Address|null;
}

export interface FeeDetails {
  total: {
    unclaimedEth: string;
    unclaimedRepStaked: string;
    unclaimedRepEarned: string;
    lostRep: string;
  };
  feeWindows: Array<Address>;
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: Array<NonforkedMarket>;
}

interface FormattedMarketInfo {
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: Array<NonforkedMarket>;
}

interface FeeWindowTokenRow {
  feeWindow: Address;
  participationTokenStake: BigNumber|null;
  supply: BigNumber|null;
  balance: BigNumber|null;
}

interface FeeWindowTotalTokens {
  feeWindow: Address;
  totalTokens: BigNumber;
  cashBalance: BigNumber;
}

interface ReporterStakes {
  participationTokens: Array<ParticipationTokensRow>;
  crowdsourcers: Array<CrowdsourcersRow>;
}

interface ParticipationTokensRow {
  feeWindow: Address;
  participationTokens: BigNumber;
}

interface CrowdsourcersRow {
  feeWindow: Address;
  amountStaked: BigNumber;
}

interface FeeWindowCompletionStakeRow {
  feeWindow: Address;
  amountStaked: BigNumber;
  winning: number;
}

interface RepStakeResults {
  unclaimedRepStaked: BigNumber;
  unclaimedRepEarned: BigNumber;
  lostRep: BigNumber;
}

interface UnclaimedInitialReporterRow {
  initialReporter: Address;
  disavowed: boolean;
  marketId: Address;
  universe: Address;
  reportingState: ReportingState;
  forking: boolean;
  needsMigration: boolean;
}

interface UnclaimedCrowdsourcerRow {
  crowdsourcerId: Address;
  disavowed: boolean;
  marketId: Address;
  universe: Address;
  reportingState: ReportingState;
  forking: boolean;
  needsMigration: boolean;
  amountStaked: BigNumber;
}

interface MarketParticipantRows {
  initialReporters: Array<UnclaimedInitialReporterRow>;
  crowdsourcers: Array<UnclaimedCrowdsourcerRow>;
}

function getUniverse(db: Knex, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: Address) => void) {
  const query = db("fee_windows")
  .first("universes.universe", "universes.parentUniverse")
  .join("universes", "fee_windows.universe", "universes.universe")
  .groupBy("fee_windows.universe");
  if (universe != null) {
    query.where("fee_windows.universe", universe);
  } else if (feeWindow != null) {
    query.where("fee_windows.feeWindow", feeWindow);
  }
  query.asCallback((err, currentUniverse: {universe: Address}) => {
    if (err) return callback(err);
    if (!currentUniverse || !currentUniverse.universe) return callback(new Error("Universe or feeWindow not found"));
    return callback(null, currentUniverse.universe);
  });
}

function formatMarketInfo(marketParticipants: MarketParticipantRows) {
  let forkedMarket: ForkedMarket|null = null;
  const keyedNonforkedMarkets: {[marketId: string]: NonforkedMarket} = {};
  let i: number;
  for (i = 0; i < marketParticipants.initialReporters.length; i++) {
    if (marketParticipants.initialReporters[i].forking) {
      forkedMarket = {
        marketId: marketParticipants.initialReporters[i].marketId,
        universe: marketParticipants.initialReporters[i].universe,
        isFinalized: marketParticipants.initialReporters[i].reportingState === ReportingState.FINALIZED,
        crowdsourcers: [],
        initialReporter: {
          initialReporterId: marketParticipants.initialReporters[i].initialReporter,
          isForked: marketParticipants.initialReporters[i].disavowed ? true : false,
        },
      };
    } else {
      keyedNonforkedMarkets[marketParticipants.initialReporters[i].marketId] = {
        marketId: marketParticipants.initialReporters[i].marketId,
        universe: marketParticipants.initialReporters[i].universe,
        crowdsourcersAreDisavowed: false,
        isMigrated: !marketParticipants.initialReporters[i].needsMigration,
        isFinalized: marketParticipants.initialReporters[i].reportingState === ReportingState.FINALIZED,
        crowdsourcers: [],
        initialReporter: marketParticipants.initialReporters[i].initialReporter,
      };
    }
  }
  for (i = 0; i < marketParticipants.crowdsourcers.length; i++) {
    if (marketParticipants.crowdsourcers[i].forking) {
      if (forkedMarket) {
        forkedMarket.crowdsourcers.push({crowdsourcerId: marketParticipants.crowdsourcers[i].crowdsourcerId, isForked: marketParticipants.crowdsourcers[i].disavowed ? true : false});
      } else {
        forkedMarket = {
          marketId: marketParticipants.crowdsourcers[i].marketId,
          universe: marketParticipants.crowdsourcers[i].universe,
          isFinalized: marketParticipants.crowdsourcers[i].reportingState === ReportingState.FINALIZED,
          crowdsourcers: [{crowdsourcerId: marketParticipants.crowdsourcers[i].crowdsourcerId, isForked: marketParticipants.crowdsourcers[i].disavowed ? true : false}],
          initialReporter: null,
        };
      }
    } else {
      if (!keyedNonforkedMarkets[marketParticipants.crowdsourcers[i].marketId]) {
        keyedNonforkedMarkets[marketParticipants.crowdsourcers[i].marketId] = {
          marketId: marketParticipants.crowdsourcers[i].marketId,
          universe: marketParticipants.crowdsourcers[i].universe,
          crowdsourcersAreDisavowed: marketParticipants.crowdsourcers[i].disavowed ? true : false,
          isMigrated: !marketParticipants.crowdsourcers[i].needsMigration,
          isFinalized: marketParticipants.crowdsourcers[i].reportingState === ReportingState.FINALIZED,
          crowdsourcers: [marketParticipants.crowdsourcers[i].crowdsourcerId],
          initialReporter: null,
        };
      } else {
        keyedNonforkedMarkets[marketParticipants.crowdsourcers[i].marketId].crowdsourcersAreDisavowed = marketParticipants.crowdsourcers[i].disavowed ? true : false;
        keyedNonforkedMarkets[marketParticipants.crowdsourcers[i].marketId].crowdsourcers.push(marketParticipants.crowdsourcers[i].crowdsourcerId);
      }
    }
  }

  const nonforkedMarkets = Object.keys(keyedNonforkedMarkets).map((key) => keyedNonforkedMarkets[key]);

  return {forkedMarket, nonforkedMarkets};
}

function getMarketsReportingParticipants(db: Knex, reporter: Address, universe: Address, callback: (err: Error|null, formattedMarketInfo?: FormattedMarketInfo) => void) {
  const initialReportersQuery = db("initial_reports")
    .distinct("initial_reports.initialReporter")
    .select(["initial_reports.disavowed", "initial_reports.marketId", "markets.universe", "market_state.reportingState", "markets.forking", "markets.needsMigration"])
    .join("markets", "initial_reports.marketId", "markets.marketId")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId")
    .whereRaw("(market_state.reportingState IN (?, ?) OR initial_reports.disavowed IN (?, ?))", [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, 1, 2])
    .where("markets.universe", universe)
    .where("initial_reports.reporter", reporter)
    .where("initial_reports.redeemed", 0);
  const crowdsourcersQuery = db("crowdsourcers")
    .distinct("crowdsourcers.crowdsourcerId")
    .select(["crowdsourcers.disavowed", "crowdsourcers.marketId", "markets.universe", "market_state.reportingState", "markets.forking", "markets.needsMigration", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .join("markets", "crowdsourcers.marketId", "markets.marketId")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId")
    .whereRaw("(market_state.reportingState IN (?, ?) OR crowdsourcers.disavowed IN (?, ?))", [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, 1, 2])
    .andWhere("markets.universe", universe)
    .andWhere("balances.owner", reporter);

  parallel({
    initialReporters: (next: AsyncCallback) => initialReportersQuery.asCallback(next),
    crowdsourcers: (next: AsyncCallback) => crowdsourcersQuery.asCallback(next),
  }, (err: Error|null, result: MarketParticipantRows) => {
    if (err) return callback(err);
    return callback(null, formatMarketInfo(result));
  });
}

function getTotalFeeWindowTokens(db: Knex, augur: Augur, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: { [feeWindow: string]: FeeWindowTotalTokens }) => void) {
  const query = db.select(["fee_windows.feeWindow", "participationToken.supply AS participationTokenStake", "feeToken.supply", "cash.balance"]).from("fee_windows");
  query.leftJoin("token_supply AS participationToken", "fee_windows.feeWindow", "participationToken.token");
  query.leftJoin("token_supply AS feeToken", "fee_windows.feeToken", "feeToken.token");
  query.leftJoin("balances AS cash", function () {
    this
      .on("cash.owner", db.raw("fee_windows.feeWindow"))
      .andOn("cash.token", db.raw("?", augur.contracts.addresses[augur.rpc.getNetworkID()].Cash));
  });
  if (universe != null) query.where("fee_windows.universe", universe);
  if (feeWindow != null) query.where("fee_windows.feeWindow", feeWindow);
  query.asCallback((err, feeWindowTokenRows: Array<FeeWindowTokenRow>) => {
    if (err) return callback(err);
    callback(null, _.reduce(feeWindowTokenRows, (acc: { [feeWindow: string]: FeeWindowTotalTokens }, feeWindowTokens: FeeWindowTokenRow) => {
      acc[feeWindowTokens.feeWindow] = {
        feeWindow: feeWindowTokens.feeWindow,
        totalTokens: (feeWindowTokens.participationTokenStake || ZERO).plus(feeWindowTokens.supply || ZERO),
        cashBalance: feeWindowTokens.balance || ZERO,
      };
      return acc;
    }, {}));
  });
}

function getStakedRepResults(db: Knex, reporter: Address, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: { redeemableFeeWindows: Array<string>, fees: RepStakeResults }) => void) {
  const query = db.select(["fee_windows.feeWindow", "stakedRep.balance as amountStaked", "payouts.winning"]).from("fee_windows");
  query.join("crowdsourcers", "crowdsourcers.feeWindow", "fee_windows.feeWindow");
  query.join("payouts", "crowdsourcers.payoutId", "payouts.payoutId");
  query.whereNotNull("payouts.winning");
  query.leftJoin("balances AS stakedRep", function () {
    this
      .on("crowdsourcers.crowdsourcerId", db.raw("stakedRep.token"))
      .andOn("stakedRep.owner", db.raw("?", reporter));
  });
  if (universe != null) query.where("fee_windows.universe", universe);
  if (feeWindow != null) query.where("fee_windows.feeWindow", feeWindow);
  query.asCallback((err, feeWindowCompletionStakes: Array<FeeWindowCompletionStakeRow>) => {
    if (err) return callback(err);
    const redeemableFeeWindows = _.uniq(_.map(feeWindowCompletionStakes, (feeWindowCompletionStake) => feeWindowCompletionStake.feeWindow));
    const fees = _.reduce(feeWindowCompletionStakes, (acc: RepStakeResults, feeWindowCompletionStake: FeeWindowCompletionStakeRow) => {
      return {
        unclaimedRepStaked: acc.unclaimedRepStaked.plus(feeWindowCompletionStake.winning === 0 ? ZERO : (feeWindowCompletionStake.amountStaked || ZERO)),
        unclaimedRepEarned: acc.unclaimedRepEarned.plus(feeWindowCompletionStake.winning === 0 ? ZERO : (feeWindowCompletionStake.amountStaked || ZERO).div(2)),
        lostRep: acc.lostRep.plus(feeWindowCompletionStake.winning === 0 ? (feeWindowCompletionStake.amountStaked || ZERO) : ZERO),
      };
    }, { unclaimedRepStaked: ZERO, unclaimedRepEarned: ZERO, lostRep: ZERO });
    return callback(null, { redeemableFeeWindows, fees });
  });
}

function getReporterFeeTokens(db: Knex, reporter: Address, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: {}) => void) {
  const participationTokenQuery = db.select(["fee_windows.feeWindow", "participationToken.balance AS participationTokens"]).from("fee_windows");
  participationTokenQuery.leftJoin("balances AS participationToken", function () {
    this
      .on("participationToken.token", db.raw("fee_windows.feeWindow"))
      .andOn("participationToken.owner", db.raw("?", [reporter]));
  });
  if (universe != null) participationTokenQuery.where("fee_windows.universe", universe);
  if (feeWindow != null) participationTokenQuery.where("fee_windows.feeWindow", feeWindow);

  const crowdsourcerQuery = db.select(["fee_windows.feeWindow", "disputes.amountStaked"]).from("fee_windows");
  crowdsourcerQuery.join("crowdsourcers", "crowdsourcers.feeWindow", "fee_windows.feeWindow");
  crowdsourcerQuery.join("disputes", "crowdsourcers.crowdsourcerId", "disputes.crowdsourcerId");
  crowdsourcerQuery.where("disputes.reporter", reporter);
  if (universe != null) crowdsourcerQuery.where("fee_windows.universe", universe);
  if (feeWindow != null) crowdsourcerQuery.where("fee_windows.feeWindow", feeWindow);

  parallel({
    participationTokens: (next: AsyncCallback) => participationTokenQuery.asCallback(next),
    crowdsourcers: (next: AsyncCallback) => crowdsourcerQuery.asCallback(next),
  }, (err: Error|null, result: ReporterStakes) => { // change to ReporterStakes
    if (err) return callback(err);
    const groupedCrowdsourcers = groupByAndSum(result.crowdsourcers, ["feeWindow"], ["amountStaked"]);
    const crowdsourcersByFeeWindow = _.keyBy(groupedCrowdsourcers, "feeWindow");
    const participationTokensByFeeWindow = _.keyBy(result.participationTokens, "feeWindow");
    const allFeeWindows = _.union(_.keys(crowdsourcersByFeeWindow), _.keys(participationTokensByFeeWindow));
    const totalTokensByFeeWindow = _.reduce(allFeeWindows, (acc: { [feeWindow: string]: BigNumber }, feeWindow) => {
        const crowdsourcerTokens = (crowdsourcersByFeeWindow[feeWindow] && crowdsourcersByFeeWindow[feeWindow].amountStaked) || ZERO;
        const participationTokens = (participationTokensByFeeWindow[feeWindow] && participationTokensByFeeWindow[feeWindow].participationTokens) || ZERO;
        acc[feeWindow] = crowdsourcerTokens.plus(participationTokens);
        return acc;
      }, {},
    );
    callback(null, totalTokensByFeeWindow);
  });
}

export function getReportingFees(db: Knex, augur: Augur, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: FeeDetails) => void): void {
  if (reporter == null) return callback(new Error("Must provide reporter"));
  if (universe == null && feeWindow == null) return callback(new Error("Must provide universe or feeWindow"));

  getUniverse(db, universe, feeWindow, (err, currentUniverse: Address) => {
    if (err || !currentUniverse) return callback(new Error("Universe or feeWindow not found"));
    getTotalFeeWindowTokens(db, augur, universe, feeWindow, (err, totalFeeWindowTokens?: { [feeWindow: string]: FeeWindowTotalTokens }) => {
      if (err) return callback(err);
      getReporterFeeTokens(db, reporter, universe, feeWindow, (err, totalReporterTokensByFeeWindow: { [feeWindow: string]: BigNumber }) => {
        if (err) return callback(err);
        getStakedRepResults(db, reporter, universe, feeWindow, (err, repStakeResults) => {
          if (err || repStakeResults == null) return callback(err);
          getMarketsReportingParticipants(db, reporter, currentUniverse, (err, result: FormattedMarketInfo) => {
            if (err || repStakeResults == null) return callback(err);
            const unclaimedEth = _.reduce(_.keys(totalReporterTokensByFeeWindow), (acc, feeWindow) => {
              if (totalReporterTokensByFeeWindow[feeWindow].isEqualTo(ZERO)) return acc;
              const thisFeeWindowTokens = (totalFeeWindowTokens && totalFeeWindowTokens[feeWindow]) || { totalTokens: ZERO, cashBalance: ZERO };
              const feesForThisWindow = totalReporterTokensByFeeWindow[feeWindow].dividedBy(thisFeeWindowTokens.totalTokens).times(thisFeeWindowTokens.cashBalance);
              acc = acc.plus(feesForThisWindow);
              return acc;
            }, ZERO);
            const redeemableFeeWindows = _.uniq(_.keys(totalReporterTokensByFeeWindow).concat(repStakeResults.redeemableFeeWindows));
            const response = {
              total: {
                unclaimedEth: unclaimedEth.toFixed(),
                unclaimedRepStaked: repStakeResults.fees.unclaimedRepStaked.toFixed(),
                unclaimedRepEarned: repStakeResults.fees.unclaimedRepEarned.toFixed(),
                lostRep: repStakeResults.fees.lostRep.toFixed(),
              },
              feeWindows: redeemableFeeWindows,
              forkedMarket: result.forkedMarket,
              nonforkedMarkets: result.nonforkedMarkets,
            };
            callback(null, response);
          });
        });
      });
    });
  });
}
