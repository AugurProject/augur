import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, AsyncCallback } from "../../types";
import Augur from "augur.js";
import { ZERO } from "../../constants";
import { groupByAndSum } from "./database";

export interface FeeDetails {
  unclaimedEth: string;
  unclaimedRepStaked: string;
  unclaimedRepEarned: string;
  claimedEth: string;
  claimedRepStaked: string;
  claimedRepEarned: string;
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

function getTotalFeeWindowTokens(db: Knex, augur: Augur, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: { [feeWindow: string]: FeeWindowTotalTokens }) => void) {
  const query = db.select(["fee_windows.feeWindow", "participationToken.supply AS participationTokenStake", "feeToken.supply", "cash.balance"]).from("fee_windows");
  query.leftJoin("token_supply AS participationToken", "fee_windows.feeWindow", "participationToken.token");
  query.leftJoin("token_supply AS feeToken", "fee_windows.feeToken", "feeToken.token");
  query.leftJoin("balances AS cash", function () {
    this
      .on("cash.owner", db.raw("fee_windows.feeWindow"))
      .andOn("cash.token", db.raw(`'${augur.contracts.addresses[augur.rpc.getNetworkID()].Cash}'`));
  });
  if (universe != null) query.where("fee_windows.universe", universe);
  if (feeWindow != null) query.where("fee_windows.feeWindow", feeWindow);
  query.asCallback((err, feeWindowTokenRows: Array<FeeWindowTokenRow>) => {
    if (err) return callback(err);
    callback(null, _.reduce(feeWindowTokenRows, (acc: {[feeWindow: string]: FeeWindowTotalTokens }, feeWindowTokens: FeeWindowTokenRow) => {
      acc[feeWindowTokens.feeWindow] = {
        feeWindow: feeWindowTokens.feeWindow,
        totalTokens: (feeWindowTokens.participationTokenStake || ZERO).plus(feeWindowTokens.supply || ZERO),
        cashBalance: feeWindowTokens.balance || ZERO,
      };
      return acc;
    }, {}));
  });
}

function getReporterFeeTokens(db: Knex, reporter: Address, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: {}) => void) {
  const participationTokenQuery = db.select(["fee_windows.feeWindow", "participationToken.balance AS participationTokens"]).from("fee_windows");
  participationTokenQuery.leftJoin("balances AS participationToken", function () {
    this
      .on("participationToken.token", db.raw("fee_windows.feeWindow"))
      .andOn("participationToken.owner", db.raw(`'${reporter}'`));
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
    const totalTokensByFeeWindow = _.reduce(allFeeWindows, (acc: {[feeWindow: string]: BigNumber}, feeWindow) => {
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

  getTotalFeeWindowTokens(db, augur, universe, feeWindow, (err, totalFeeWindowTokens?: { [feeWindow: string]: FeeWindowTotalTokens }) => {
    if (err) return callback(err);
    getReporterFeeTokens(db, reporter, universe, feeWindow, (err, totalReporterTokensByFeeWindow: { [feeWindow: string]: BigNumber }) => {
      if (err) return callback(err);
      const unclaimedEth = _.reduce(_.keys(totalReporterTokensByFeeWindow), (acc, feeWindow) => {
        const thisFeeWindowTokens = (totalFeeWindowTokens && totalFeeWindowTokens[feeWindow]) || { totalTokens: ZERO, cashBalance: ZERO };
        const feesForThisWindow = totalReporterTokensByFeeWindow[feeWindow].dividedBy(thisFeeWindowTokens.totalTokens).times(thisFeeWindowTokens.cashBalance);
        acc = acc.plus(feesForThisWindow);
        return acc;
      }, ZERO);
      const response = {
        unclaimedEth: unclaimedEth.toFixed(),
        unclaimedRepStaked: "2",
        unclaimedRepEarned: "3",
        claimedEth: "4",
        claimedRepStaked: "5",
        claimedRepEarned: "6",
      };
      callback(null, response);
    });
  });
}
