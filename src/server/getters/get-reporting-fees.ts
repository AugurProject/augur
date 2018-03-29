import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address } from "../../types";
import Augur from "augur.js";
import { ZERO } from "../../constants";

export interface FeeDetails {
  unclaimedEth: string;
  unclaimedRepStaked: string;
  unclaimedRepEarned: string;
  claimedEth: string;
  claimedRepStaked: string;
  claimedRepEarned: string;
}

interface FeeWindowTokens {
  feeWindow: Address;
  participationTokens: number|null;
  feeTokens: number|null;
  balance: number|null;

}

interface Balance {
  balance: string;
}

function getTokenBalance(db: Knex, token: Address, owner: Address, callback: (err: Error|null, result?: Balance) => void) {
  db.select("balance").from("balances").first().where({ token, owner }).asCallback(callback);
}

function getFeeTokenSupply(db: Knex, feeWindow: Address, callback: (err: Error|null, result?: Balance) => void) {
  db.select("feeToken").from("feeWindows").first().where({ feeWindow }).asCallback((err: Error|null, feeTokenAddress?: any) => {
    if (err) return callback(err);
    if (feeTokenAddress.feeToken == null) return callback(new Error(`Could not find feeToken for ${feeWindow}`));
    getTokenSupply(db, feeTokenAddress.feeToken, callback);
  });
}

function getTokenSupply(db: Knex, token: Address, callback: (err: Error|null, result?: Balance) => void) {
  db.select("supply").from("token_supply").first().where({ token }).asCallback(callback);
}

// function getTotalFeeWindowTokens(db: Knex, feeWindow: Address, callback: (err: Error|null, result?: any) => void) {
//   getTokenSupply(db, feeWindow, (err: Error|null, participationTokensRow?: any) => {
//     if (err) return callback(err);
//     if (participationTokensRow == null) return callback(new Error(`No participationTokens found for ${feeWindow}`));
//     getFeeTokenSupply(db, feeWindow, (err: Error|null, feeTokensRow?: any) => {
//       if (err) return callback(err);
//       if (feeTokensRow == null) return callback(new Error(`No feeTokens found for ${feeWindow}`));
//       callback(null, feeTokensRow.supply.plus(participationTokensRow.supply));
//     });
//   });
// }

function getTotalFeeWindowTokens(db: Knex, augur: Augur, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: Array<any>) => void) {
  const query = db.select(["fee_windows.feeWindow", "participationToken.supply AS participationTokenStake", "feeToken.supply", "cash.balance"]).from("fee_windows");
  // query.join("markets", "markets.feeWindow", "fee_windows.feeWindow");
  query.leftJoin("token_supply AS participationToken", "fee_windows.feeWindow", "participationToken.token");
  query.leftJoin("token_supply AS feeToken", "fee_windows.feeToken", "feeToken.token");
  query.leftJoin("balances AS cash", function () {
    this
      .on("cash.owner", db.raw("fee_windows.feeWindow"))
      .andOn("cash.token", db.raw(`'${augur.contracts.addresses[augur.rpc.getNetworkID()].Cash}'`));
  });
  if (universe != null) query.where("fee_windows.universe", universe);
  if (feeWindow != null) query.where("fee_windows.feeWindow", feeWindow);
  query.asCallback((err, feeWindowTokenRows) => {
    if (err) return callback(err);
    callback(null, _.map(feeWindowTokenRows, (feeWindowTokens: any) => {
      return {
        feeWindow: feeWindowTokens.feeWindow,
        totalTokens: (feeWindowTokens.participationTokenStake || ZERO).plus(feeWindowTokens.supply || ZERO),
        cashBalance: feeWindowTokens.balance || ZERO,
      };
    }));
  });
}

function getReporterFeeTokens(db: Knex, reporter: Address, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: Array<FeeWindowTokens>) => void) {
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

  if (universe != null) participationTokenQuery.where("fee_windows.universe", universe);
  if (feeWindow != null) participationTokenQuery.where("fee_windows.feeWindow", feeWindow);
  parallel({
    participationTokens: (next) => participationTokenQuery.asCallback(next),
    crowdsourcers: (next) => crowdsourcerQuery.asCallback(next),
  }, (err?: Error|null, result?) => {
    if (err) return callback(err);
    groupByAndSum()
    console.log(result);
  });
  participationTokenQuery.asCallback(callback);
}

// function calculateEthFees(feeWindowsTokens: Array<FeeWindowTokens>, reporterTokens: any) {
//   const reporterTokensByFeeWindow = _.keyBy(reporterTokens, "feeWindow");
//   let fees = ZERO;
//   _.forEach(reporterTokens, (reporterBalance) => {
//     const totalFeeWindowTokens = new BigNumber(reporterBalance.participationTokens || 0).plus(new BigNumber(reporterBalance.feeTokens || 0));
//
//     const feeWindowReporterTokens = reporterTokensByFeeWindow[feeWindowsTokens.feeWindow];
//     const totalReporterTokens = new BigNumber(0)
//   });
// }

export function getReportingFees(db: Knex, augur: Augur, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: FeeDetails) => void): void {
  if (reporter == null) return callback(new Error("Must provide reporter"));
  if (universe == null && feeWindow == null) return callback(new Error("Must provide universe or feeWindow"));

  getTotalFeeWindowTokens(db, augur, universe, feeWindow, (err, totalFeeWindowTokens) => {
    if (err) return callback(err);
    console.log("EEA");

    console.log(totalFeeWindowTokens);
    getReporterFeeTokens(db, reporter, universe, feeWindow, (err, result) => {
      if (err) return callback(err);
      console.log("EE");
      console.log(result);
      console.log(totalFeeWindowTokens);
      const response = {
        unclaimedEth: "1",
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
