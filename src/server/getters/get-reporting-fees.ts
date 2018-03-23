import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address } from "../../types";

interface FeeDetails {
  ethFees: string;
  repToReclaim: string;
  repEarned: string;
}

export function getReportingFees(db: Knex, reporter: Address|null, universe: Address|null, feeWindow: Address|null, callback: (err: Error|null, result?: FeeDetails) => void): void {
  if (universe == null || feeWindow) return callback(new Error("Must provide universe or feeWindow"));
  const response = {
    ethFees: "1",
    repToReclaim: "2",
    repEarned: "3",
  };
  callback(null, response);
}
