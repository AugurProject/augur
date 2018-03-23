import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address } from "../../types";
import Augur from "augur.js";

export interface FeeDetails {
  unclaimedEth: string;
  unclaimedRepStaked: string;
  unclaimedRepEarned: string;
  claimedEth: string;
  claimedRepStaked: string;
  claimedRepEarned: string;
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

function getTotalFeeWindowTokens(db: Knex, feeWindow: Address, callback: (err: Error|null, result?: any) => void) {
  getTokenSupply(db, feeWindow, (err: Error|null, participationTokensRow?: any) => {
    if (err) return callback(err);
    if (participationTokensRow == null) return callback(new Error(`No participationTokens found for ${feeWindow}`));
    getFeeTokenSupply(db, feeWindow, (err: Error|null, feeTokensRow?: any) => {
      if (err) return callback(err);
      if (feeTokensRow == null) return callback(new Error(`No feeTokens found for ${feeWindow}`));
      callback(null, feeTokensRow.supply.plus(participationTokensRow.supply));
    });
  });
}


export function getReportingFees(db: Knex, augur: Augur, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: FeeDetails) => void): void {
  if (reporter == null) return callback(new Error("Must provide reporter"));
  if (/*universe == null || */ feeWindow == null) return callback(new Error("Must provide universe or feeWindow"));
  // const query = db.select(["balances.balance AS repBalance"]).from("initial_reports");

  // if (universe != null) query.where("markets.universe", universe);
  // if (feeWindow != null) query.where("markets.universe", universe);

  const networkId: string = augur.rpc.getNetworkID();
  const cashTokenAddress: Address = augur.contracts.addresses[networkId].Cash;
  // query.where("balances.token", cashTokenAddress);
  getTotalFeeWindowTokens(db, feeWindow, (err, totalFeeTokens) => {
    if (err) return callback(err);

  });
  const response = {
    unclaimedEth: "1",
    unclaimedRepStaked: "2",
    unclaimedRepEarned: "3",
    claimedEth: "4",
    claimedRepStaked: "5",
    claimedRepEarned: "6",
  };
  callback(null, response);
}
