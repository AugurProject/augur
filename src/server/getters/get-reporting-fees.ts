import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, AsyncCallback } from "../../types";
import Augur from "augur.js";
import { QueryBuilder } from "knex";
import { ZERO } from "../../constants";
import { groupByAndSum } from "./database";
// import { CONNECTING } from "ws";
// import { rollbackMarketState } from "../../blockchain/log-processors/database";

export interface CrowdsourcerState {
  address: string;
  isForked: boolean;
}

export interface InitialReporterState {
  address: string;
  isForked: boolean;
}

export interface ForkedMarket {
  address: string;
  universeAddress: string;
  isFinalized: boolean;
  crowdsourcers: Array<CrowdsourcerState>;
  initialReporter: Array<InitialReporterState>;
}

export interface NonforkedMarket {
  address: string;
  // universeAddress: string;
  // crowdsourcersAreDisavowed: boolean;
  // isFinalized: boolean;
  // isMigrated: boolean;
  // crowdsourcers: Array<CrowdsourcerState>;
  // initialReporter: Array<InitialReporterState>;
}

export interface FeeDetails {
  total: {
    unclaimedEth: string;
    unclaimedRepStaked: string;
    unclaimedRepEarned: string;
    lostRep: string;
    claimedEth: string;
    claimedRepStaked: string;
    claimedRepEarned: string;
  };
  feeWindows: Array<Address>;
  // crowdsourcers: Array<Address>;
  // initialReporters: Array<Address>;
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: any;//Array<NonforkedMarket>;
}

interface ReportingParticipants {
  crowdsourcers: Array<string>;
  initialReporters: Array<string>; 
}

interface ForkedMarketRow {
  address: string;
  universeAddress: string;
  initialReporterAddress: string;
  crowdsourcerAddress: string;
}

interface NonforkedMarketRow {
  address: string;
  universeAddress: string;
  initialReporterAddress: string;
  crowdsourcerAddress: string;
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
  feeWindow: string;
  participationTokens: BigNumber;
}

interface CrowdsourcersRow {
  feeWindow: string;
  amountStaked: BigNumber;
}

interface FeeWindowCompletionStakeRow {
  feeWindow: string;
  amountStaked: BigNumber;
  winning: number;
}

interface RepStakeResults {
  unclaimedRepStaked: BigNumber;
  unclaimedRepEarned: BigNumber;
  lostRep: BigNumber;
}

// function getForkedMarket(db: Knex, reporter: Address, universe: Address, callback: (err: Error|null, forkedMarket?: ForkedMarket) => void) {
//   const query = db.select(["markets.marketId AS address", "markets.universe AS universeAddress", "initial_reports.reporter AS initialReporteraddress", "crowdsourcers.crowdsourcerId AS crowdsourcerAddress"]).from("markets");
//   query.leftJoin("initial_reports", "markets.marketId", "initial_reports.marketId");
//   query.leftJoin("crowdsourcers", "markets.marketId", "crowdsourcers.marketId");
//   if (universe != null) participationTokenQuery.where("fee_windows.universe", universe);
//   if (feeWindow != null) participationTokenQuery.where("fee_windows.feeWindow", feeWindow);

//   query.where("markets.universe", universe);
//   query.asCallback((err, forkedMarketRows: Array<ForkedMarketRow>) => {
//     if (err) return callback(err);
//     callback(null, _.reduce(forkedMarketRows, (acc: ForkedMarket?) => {

//     }
//   }
// }

function getRelevantUniverses(db: Knex, reporter: Address, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: any) => void) {
  let query = db("fee_windows")
  .select("universes.universe", "universes.parentUniverse")
  .join("universes", "fee_windows.universe", "universes.universe")
  .groupBy("fee_windows.universe");
  if (universe != null) {
    query.where("fee_windows.universe", universe);
  } else if (feeWindow != null) {
    query.where("fee_windows.feeWindow", feeWindow);
  }
  query.asCallback((err, relevantUniverses: any) => {
    if (err) return callback(err);
    return callback(null, relevantUniverses);
  });
}

function getNonforkedMarkets(db: Knex, reporter: Address, universe: Address, parentUniverse: Address, callback: (err: Error|null, result?: any/*{ [nonforkedMarketAddress: string]: Array<NonforkedMarket> }*/) => void) {
  let initialReportersQuery = db("initial_reports")
    .select(["initial_reports.marketId", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "initial_reports.initialReporter")
    .join("markets", "initial_reports.marketId", "markets.marketId")
    .whereIn("markets.universe", [universe, parentUniverse])
    .where("balances.owner", reporter || "");
  let crowdsourcersQuery = db("crowdsourcers")
    .select(["crowdsourcers.marketId", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .join("markets", "crowdsourcers.marketId", "markets.marketId")
    .whereIn("markets.universe", [universe, parentUniverse])
    .where("balances.owner", reporter || "");

    parallel({
      initialReporters: (next: AsyncCallback) => initialReportersQuery.asCallback(next),
      crowdsourcers: (next: AsyncCallback) => crowdsourcersQuery.asCallback(next),
    }, (err: Error|null, result: ReportingParticipants) => { // change to ReportingParticipants
      if (err) return callback(err);
      // const groupedCrowdsourcers = _.groupBy(result.crowdsourcers, ["marketId"]);
      const crowdsourcersByMarketId = _.keyBy(result.crowdsourcers, "marketId");
      const initialReportersByMarketId = _.keyBy(result.initialReporters, "marketId");
      callback(null, { crowdsourcersByMarketId: crowdsourcersByMarketId, initialReportersByMarketId: result.initialReporters });
    });

  /*
  const crowdsourcersQuery = db.select(["fee_windows.universe as universeAddress", "markets.marketId AS marketAddress", "crowdsourcers.crowdsourcerId AS crowdsourcerAddress"]).from("fee_windows");
  crowdsourcersQuery.leftJoin("markets", "markets.universe", "fee_windows.universe");
  crowdsourcersQuery.leftJoin("crowdsourcers", "markets.marketId", "crowdsourcers.marketId");
  const initialReportersQuery = db.select(["fee_windows.universe as universeAddress", "markets.marketId AS marketAddress", "initial_reports.reporter AS initialReporterAddress",]).from("fee_windows");
  initialReportersQuery.leftJoin("markets", "markets.universe", "fee_windows.universe");
  initialReportersQuery.leftJoin("initial_reports", "markets.marketId", "initial_reports.marketId");

  if (universe != null) {
    crowdsourcersQuery.where("fee_windows.universe", universe);
    initialReportersQuery.where("fee_windows.universe", universe);

  } else if (feeWindow != null) {
    crowdsourcersQuery.where("fee_windows.feeWindow", feeWindow);
    initialReportersQuery.where("fee_windows.feeWindow", universe);
  }
  // crowdsourcersQuery.groupBy("markets.marketId");
  // initialReportersQuery.groupBy("initial_reports.reporter");

  parallel({
    initialReporters: (next: AsyncCallback) => initialReportersQuery.asCallback(next),
    crowdsourcers: (next: AsyncCallback) => crowdsourcersQuery.asCallback(next),
  }, (err: Error|null, result: ReportingParticipants) => { // change to ReportingParticipants
    if (err) return callback(err);
    // const groupedCrowdsourcers = _.groupBy(result.crowdsourcers, ["marketId"]);
    const crowdsourcersByMarketId = _.keyBy(result.crowdsourcers, "marketId");
    const initialReportersByMarketId = _.keyBy(result.initialReporters, "marketId");
    callback(null, { crowdsourcersByMarketId: crowdsourcersByMarketId, initialReportersByMarketId: result.initialReporters });
  });

  // query.asCallback((err, nonforkedMarketRows: Array<NonforkedMarketRow>) => {
  //   if (err) return callback(err); 
  //   console.log(nonforkedMarketRows);
  //   var i = 0;
  //   const nonforkedMarkets = _.reduce(nonforkedMarketRows, (acc: Array<NonforkedMarket>, nonforkedMarketRow) => {
  //     acc[nonforkedMarketRow.address] = {
  //       address: nonforkedMarketRow.address,
  //       universeAddress: nonforkedMarketRow.universeAddress,
  //       crowdsourcersAreDisavowed: false,
  //       isMigrated: false,
  //       isFinalized: false,
  //       initialReporterAddress: nonforkedMarketRow.initialReporterAddress,
  //       crowdsourcers: {},
  //     };
  //     i++;
  //     return acc;
  //   }, {});
  //   return callback(null, nonforkedMarkets);
  // });
  */
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

function getClaimedEth(db: Knex, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: any) => void): void {
  const claimedEthQuery = db.select(["fee_windows.feeWindow", "participationToken.balance AS participationTokens"]).from("fee_windows");

}

export function getReportingFees(db: Knex, augur: Augur, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: any) => void): void {
  if (reporter == null) return callback(new Error("Must provide reporter"));
  if (universe == null && feeWindow == null) return callback(new Error("Must provide universe or feeWindow"));

  getTotalFeeWindowTokens(db, augur, universe, feeWindow, (err, totalFeeWindowTokens?: { [feeWindow: string]: FeeWindowTotalTokens }) => {
    if (err) return callback(err);
    getReporterFeeTokens(db, reporter, universe, feeWindow, (err, totalReporterTokensByFeeWindow: { [feeWindow: string]: BigNumber }) => {
      if (err) return callback(err);
      getStakedRepResults(db, reporter, universe, feeWindow, (err, repStakeResults) => {
        if (err || repStakeResults == null) return callback(err);
        getRelevantUniverses(db, reporter, universe, feeWindow, (err, relevantUniverses: any) => {
          // callback(null, relevantUniverses);
          if (err || relevantUniverses == null) return callback(err);
          getNonforkedMarkets(db, reporter, relevantUniverses[0].universe, relevantUniverses[0].parentUniverse, (err, markets: any/*{ nonforkedMarkets: Array<NonforkedMarket> }*/) => {
            if (err || repStakeResults == null) return callback(err);

          //   const unclaimedEth = _.reduce(_.keys(totalReporterTokensByFeeWindow), (acc, feeWindow) => {
          //     if (totalReporterTokensByFeeWindow[feeWindow].isEqualTo(ZERO)) return acc;
          //     const thisFeeWindowTokens = (totalFeeWindowTokens && totalFeeWindowTokens[feeWindow]) || { totalTokens: ZERO, cashBalance: ZERO };
          //     const feesForThisWindow = totalReporterTokensByFeeWindow[feeWindow].dividedBy(thisFeeWindowTokens.totalTokens).times(thisFeeWindowTokens.cashBalance);
          //     acc = acc.plus(feesForThisWindow);
          //     return acc;
          //   }, ZERO);
          //   const redeemableFeeWindows = _.uniq(_.keys(totalReporterTokensByFeeWindow).concat(repStakeResults.redeemableFeeWindows));
          //   const response = {
          //     total: {
          //       unclaimedEth: unclaimedEth.toFixed(),
          //       unclaimedRepStaked: repStakeResults.fees.unclaimedRepStaked.toFixed(),
          //       unclaimedRepEarned: repStakeResults.fees.unclaimedRepEarned.toFixed(),
          //       lostRep: repStakeResults.fees.lostRep.toFixed(),
          //       claimedEth: "4",
          //       claimedRepStaked: "5",
          //       claimedRepEarned: "6",
          //     },
          //     feeWindows: redeemableFeeWindows,
          //     forkedMarket: null,
          //     nonforkedMarkets: markets,
          //   };
            callback(null, markets);
          });
        });
      });
    });
  });
}
