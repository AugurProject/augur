import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";

export const FeeWindowParams = t.type({
  universe: t.string,
  reporter: t.union([t.string, t.null, t.undefined]),
  feeWindowState: t.union([t.string, t.null, t.undefined]),
  feeWindow: t.union([t.string, t.null, t.undefined]),
});

export enum FeeWindowState {
  PAST = "PAST",
  CURRENT = "CURRENT",
  FUTURE = "FUTURE",
}

export type Address = string;

export interface FeeWindowRow {
  feeWindow: Address;
  feeToken: Address;
  feeWindowId: number;
  universe: Address;
  startTime: number;
  state: FeeWindowState;
  endTime: number;
  fees: number|string;
}

export interface UIFeeWindowCurrent<BigNumberType> {
  endTime: number;
  feeWindow: Address|null;
  feeWindowId: number;
  startTime: number;
  universe: Address;
  totalStake?: BigNumberType;
  feeWindowEthFees?: BigNumberType;
  feeWindowRepStaked?: BigNumberType;
  feeWindowFeeTokens?: BigNumberType;
  feeWindowParticipationTokens?: BigNumberType;
  participantContributions?: BigNumberType;
  participantContributionsCrowdsourcer?: BigNumberType;
  participantContributionsInitialReport?: BigNumberType;
  participantParticipationTokens?: BigNumberType;
  participationTokens?: BigNumberType;
}

const RELATIVE_FEE_WINDOW_STATE: { [state: string]: number } = {
  PREVIOUS: -1,
  CURRENT: 0,
  NEXT: 1,
};

export async function getFeeWindow(db: Knex, augur: {}, params: t.TypeOf<typeof FeeWindowParams>): Promise<UIFeeWindowCurrent<string>|null> {
  return {
    endTime: 1509670273,
    feeWindow: "0x2000000000000000000000000000000000000000",
    feeWindowEthFees: "2000",
    feeWindowFeeTokens: "100",
    feeWindowId: 457,
    feeWindowParticipationTokens: "1000",
    feeWindowRepStaked: "1100",
    participantContributions: "102",
    participantContributionsCrowdsourcer: "0",
    participantContributionsInitialReport: "102",
    participantParticipationTokens: "30",
    participationTokens: "30",
    startTime: 1509065473,
    totalStake: "132",
    universe: "0x000000000000000000000000000000000000000b",
  }
}
