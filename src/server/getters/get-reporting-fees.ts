import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address } from "../../types";

export interface FeeDetails {
  unclaimedEth: string;
  unclaimedRepStaked: string;
  unclaimedRepEarned: string;
  claimedEth: string;
  claimedRepStaked: string;
  claimedRepEarned: string;
}

export function getReportingFees(db: Knex, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: FeeDetails) => void): void {
  if (universe == null || feeWindow) return callback(new Error("Must provide universe or feeWindow"));
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
