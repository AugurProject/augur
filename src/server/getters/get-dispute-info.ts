import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithTime, Payout, UIStakeInfo, PayoutRow, StakeDetails, ReportingState } from "../../types";
import { getMarketsWithReportingState, normalizePayouts, uiStakeInfoToFixed, groupByAndSum } from "./database";
import { BigNumber } from "bignumber.js";
import { QueryBuilder } from "knex";
import { ZERO } from "../../constants";
import Augur from "augur.js";

interface DisputeRound {
  marketId: Address;
  disputeRound: number;
}

interface DisputesResult {
  markets: Array<MarketsRowWithTime>;
  stakesCompleted: Array<StakeRow>;
  stakesCurrent: Array<ActiveCrowdsourcer>;
  accountStakesCompleted: Array<StakeRow>;
  accountStakesCurrent: Array<StakeRow>;
  payouts: Array<PayoutRow<BigNumber>>;
  disputeRound: Array<DisputeRound>;
}

interface StakeRow extends Payout<BigNumber> {
  marketId: Address;
  payoutId: number;
  amountStaked: BigNumber;
}

interface ActiveCrowdsourcer extends StakeRow {
  size: BigNumber;
}

interface StakeSizes<BigNumberType> {
  bondSizeCurrent?: BigNumberType;
  bondSizeTotal?: BigNumberType;
  stakeCurrent?: BigNumberType;
  stakeRemaining?: BigNumberType;
  accountStakeCompleted?: BigNumberType;
  accountStakeCurrent?: BigNumberType;
  accountStakeTotal?: BigNumberType;
}

const activeMarketStates = ["CROWDSOURCING_DISPUTE", "AWAITING_NEXT_WINDOW", "FORKING", "AWAITING_FORK_MIGRATION"];

function isActiveMarketState(reportingState: ReportingState|null|undefined) {
  if (reportingState == null) return null;
  return activeMarketStates.indexOf(reportingState) !== -1;
}

async function getCurrentStakes(db: Knex, marketIds: Array<Address>) {
  const results: Array<ActiveCrowdsourcer> = await db("crowdsourcers").select(["marketId", "payoutId", "amountStaked", "size"])
    .whereNull("completed")
    .whereIn("crowdsourcers.marketId", marketIds);

  return groupByAndSum(results, ["marketId", "payoutId"], ["amountStaked", "size"]);
}

async function getCompletedStakes(db: Knex, marketIds: Array<Address>) {
  const results: Array<StakeRow> = await db.select("marketId", "payoutId", "amountStaked")
    .from((builder: QueryBuilder) => {
      return builder
        .from("crowdsourcers")
        .select("marketId", "payoutId", "amountStaked")
        .where("completed", 1)
        .whereIn("marketId", marketIds)
        .union((builder: QueryBuilder) => {
          return builder
            .from("initial_reports")
            .select("marketId", "payoutId", "amountStaked")
            .whereIn("marketId", marketIds);
        });
    });
  return groupByAndSum(results, ["marketId", "payoutId"], ["amountStaked"]);
}

async function getAccountStakes(db: Knex, marketIds: Array<Address>, account: Address|null, completed: boolean): Promise<Array<any>> {
  if (account == null) {
    return [];
  }
  const query = db("crowdsourcers")
    .select(["crowdsourcers.marketId", "crowdsourcers.payoutId", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .whereIn("marketId", marketIds)
    .where("balances.owner", account || "")
    .union((builder: QueryBuilder) => {
      return builder
        .from("initial_reports")
        .select("marketId", "payoutId", "amountStaked")
        .where("reporter", account || null)
        .whereIn("marketId", marketIds);
    });
  if (completed) {
    query.where("crowdsourcers.completed", 1);
  } else {
    query.whereNull("crowdsourcers.completed");
  }
  const results: Array<StakeRow> = await query;
  return groupByAndSum(results, ["marketId", "payoutId"], ["amountStaked"]);
}

function calculateBondSize(totalCompletedStakeOnAllPayouts: BigNumber, completedStakeAmount: BigNumber): BigNumber {
  return totalCompletedStakeOnAllPayouts.times(2).minus(completedStakeAmount.times(3));
}

export interface GetDisputeInfoParams {
  marketIds: Array<Address>;
  account: Address|null;
}

export function extractGetDisputeInfoParams(params: any): GetDisputeInfoParams|undefined {
  const pickedParams = _.pick(params, ["marketIds", "account"]);
  if (isGetDisputeInfoParams(pickedParams)) return pickedParams;
  return undefined;
}

export function isGetDisputeInfoParams(params: any): params is GetDisputeInfoParams {
  if (!_.isObject(params)) return false;
  if (!_.isArray(params.marketIds)) return false;
  return !(params.marketIds.filter((value: any) => typeof value !== "string").length > 0);
}

export async function getDisputeInfo(db: Knex, augur: Augur, params: GetDisputeInfoParams): Promise<Array<UIStakeInfo<string>|null>> {
  const cleanMarketIds = _.compact(params.marketIds);
  const markets: Array<MarketsRowWithTime> = await getMarketsWithReportingState(db).whereIn("markets.marketId", cleanMarketIds);
  const payouts: Array<PayoutRow<BigNumber>> = await db("payouts").whereIn("marketId", cleanMarketIds);
  const stakesCompleted: Array<StakeRow> = await getCompletedStakes(db, cleanMarketIds);
  const stakesCurrent: Array<ActiveCrowdsourcer> = await getCurrentStakes(db, cleanMarketIds);
  const accountStakesCurrent: Array<StakeRow> = await getAccountStakes(db, cleanMarketIds, params.account, false);
  const accountStakesCompleted: Array<StakeRow> = await getAccountStakes(db, cleanMarketIds, params.account, true);
  const disputeRound: Array<DisputeRound> = await db("crowdsourcers").select("marketId").count("* as disputeRound").groupBy("crowdsourcers.marketId").where("crowdsourcers.completed", 1).whereIn("crowdsourcers.marketId", cleanMarketIds);
  if (!markets) throw new Error("Could not retrieve markets");
  const disputeDetailsByMarket =
    _.map(cleanMarketIds, (marketId: Address): DisputesResult => {
      return {
        markets: _.filter(markets, { marketId }),
        payouts: _.filter(payouts, { marketId }),
        stakesCompleted: _.filter(stakesCompleted, { marketId }),
        stakesCurrent: _.filter(stakesCurrent, { marketId }),
        accountStakesCurrent: _.filter(accountStakesCurrent, { marketId }),
        accountStakesCompleted: _.filter(accountStakesCompleted, { marketId }),
        disputeRound: _.filter(disputeRound, { marketId }),
      };
    });
  return disputeDetailsByMarket.map(reshapeStakeRowToUIStakeInfo);
}

function reshapeStakeRowToUIStakeInfo(stakeRows: DisputesResult): UIStakeInfo<string>|null {
  const marketRow = stakeRows.markets[0];
  if (marketRow == null) return null;
  const totalCompletedStakeOnAllPayouts = _.reduce(
    stakeRows.stakesCompleted,
    (result: BigNumber, completedStake: StakeRow): BigNumber => result.plus(completedStake.amountStaked),
    ZERO,
  );

  const stakeCompletedByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.stakesCompleted, "payoutId");
  const stakeCurrentByPayout: { [payoutId: number]: ActiveCrowdsourcer } = _.keyBy(stakeRows.stakesCurrent, "payoutId");
  const accountStakeCompletedByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.accountStakesCompleted, "payoutId");
  const accountStakeCurrentByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.accountStakesCurrent, "payoutId");
  const stakeResults = _.map(stakeRows.payouts, (payout: PayoutRow<BigNumber>): StakeDetails<BigNumber> => {
    const stakeCompletedRow = stakeCompletedByPayout[payout.payoutId];
    const stakeCurrentRow = stakeCurrentByPayout[payout.payoutId];
    const accountStakeCompletedRow = accountStakeCompletedByPayout[payout.payoutId];
    const accountStakeCurrentRow = accountStakeCurrentByPayout[payout.payoutId];

    const stakeCompleted: BigNumber = !stakeCompletedRow ? ZERO : stakeCompletedRow.amountStaked;
    const stakeCurrentOnPayout: BigNumber = !stakeCurrentRow ? ZERO : stakeCurrentRow.amountStaked;

    let currentAmounts: StakeSizes<BigNumber> = {};
    const accountStakeCompleted = accountStakeCompletedRow ? accountStakeCompletedRow.amountStaked : ZERO;
    if (payout.tentativeWinning !== 1 && isActiveMarketState(marketRow.reportingState)) {
      let bondSizeCurrent: BigNumber;
      let stakeCurrent: BigNumber;
      let accountStakeCurrent: BigNumber;
      if (!stakeCurrentRow) {
        bondSizeCurrent = calculateBondSize(totalCompletedStakeOnAllPayouts, stakeCompleted);
        stakeCurrent = ZERO;
        accountStakeCurrent = ZERO;
      } else {
        bondSizeCurrent = stakeCurrentRow.size;
        stakeCurrent = stakeCurrentRow.amountStaked;
        accountStakeCurrent = accountStakeCurrentRow ? accountStakeCurrentRow.amountStaked : ZERO;
      }
      currentAmounts = {
        bondSizeCurrent,
        stakeCurrent,
        accountStakeCurrent,
        accountStakeTotal: accountStakeCurrent.plus(accountStakeCompleted),
        stakeRemaining: bondSizeCurrent.minus(stakeCurrent),
        bondSizeTotal: bondSizeCurrent.plus(stakeCompleted),
      };
    }
    currentAmounts.accountStakeCompleted = accountStakeCompleted;

    return Object.assign({},
      normalizePayouts(payout),
      currentAmounts,
      {
        stakeCurrent: stakeCurrentOnPayout,
        stakeCompleted,
        tentativeWinning: !!payout.tentativeWinning,
      },
    );
  });

  let disputeRound = null;
  if (!totalCompletedStakeOnAllPayouts.isEqualTo(0)) {
    disputeRound = stakeRows.disputeRound[0] ? stakeRows.disputeRound[0].disputeRound + 1 : 1;
  }

  return uiStakeInfoToFixed({
    marketId: marketRow.marketId,
    stakeCompletedTotal: totalCompletedStakeOnAllPayouts,
    bondSizeOfNewStake: totalCompletedStakeOnAllPayouts.times(2),
    stakes: stakeResults,
    disputeRound,
  });
}
