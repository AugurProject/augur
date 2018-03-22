import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, AsyncCallback, Payout, UIStakeInfo, PayoutRow, StakeDetails, ReportingState } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { getMarketsWithReportingState, normalizePayouts } from "./database";
import { BigNumber } from "bignumber.js";
import { QueryBuilder } from "knex";
import { ZERO } from "../../constants";

interface DisputeRound {
  marketId: Address;
  disputeRound: number;
}

interface DisputesResult {
  markets: Array<MarketsRowWithCreationTime>;
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

interface Dictionary {
  [key: string]: any;
}

function groupByAndSum<T extends Dictionary>(rows: Array<T>, groupFields: Array<string>, sumFields: Array<string>): Array<T> {
  return _
    .chain(rows)
    .groupBy(row => _.values(_.pick(row, groupFields)))
    .values()
    .map((groupedRows: Array<T>): T => {
      return _.reduce(groupedRows, (result: T | undefined, row: T): T => {
        if (typeof result === "undefined") return row;

        const mapped = _.map(row, (value: BigNumber|number|null, key: string): any[] => {
          const previousValue = result[key];
          if (sumFields.indexOf(key) === -1 || typeof previousValue === "undefined" || value === null || typeof value === "undefined") {
            return [key, value];
          } else if (value instanceof BigNumber) {
            return [key, value.plus(result[key] as BigNumber)];
          } else {
            return [key, (value + previousValue)];
          }
        }) as Array<any>;

        return _.fromPairs(mapped) as T;
      }) as T;
    })
    .value();
}

const activeMarketStates = ["CROWDSOURCING_DISPUTE", "AWAITING_NEXT_WINDOW", "FORKING", "AWAITING_FORK_MIGRATION"];

function isActiveMarketState(reportingState: ReportingState|null|undefined) {
  if (reportingState == null) return null;
  return activeMarketStates.indexOf(reportingState) !== -1;
}

function getCurrentStakes(db: Knex, marketIds: Array<Address>, callback: AsyncCallback) {
  db("crowdsourcers").select(["marketId", "payoutId", "amountStaked", "size"])
  .whereNull("completed")
  .whereIn("crowdsourcers.marketId", marketIds)
  .asCallback((err: Error|null, results: Array<ActiveCrowdsourcer>) => {
    if (err) return callback(err);
    callback(null, groupByAndSum(results, ["marketId", "payoutId"], ["amountStaked", "size"]));
  });
}

function getCompletedStakes(db: Knex, marketIds: Array<Address>, callback: AsyncCallback) {
  db.select("marketId", "payoutId", "amountStaked")
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
            .whereIn("marketId", marketIds)
        });
    })
    .asCallback((err: Error|null, results: Array<StakeRow>) => {
      if (err) return callback(err);

      callback(null, groupByAndSum(results, ["marketId", "payoutId"], ["amountStaked"]));
    });
}

function getAccountStakes(db: Knex, marketIds: Array<Address>, account: Address|null, completed: boolean, callback: AsyncCallback) {
  // select crowdsourcers.marketId, crowdsourcers.payoutId, crowdsourcers.completed, sum(balances.balance) from crowdsourcers JOIN balances ON balances.token = crowdsourcers.crowdsourcerId;
 
  let query = db("crowdsourcers")
    .select(["crowdsourcers.marketId", "crowdsourcers.payoutId", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .whereIn("marketId", marketIds)
    .where("balances.owner", account || "");

  if (completed) {
    query = query.where("crowdsourcers.completed", 1);
  } else {
    query = query.whereNull("crowdsourcers.completed");
  }

  query.asCallback((err: Error|null, results: Array<StakeRow>) => {
    if (err) return callback(err);

    callback(null, groupByAndSum(results, ["marketId", "payoutId"], ["amountStaked"]));
  });
}

function calculateBondSize(totalCompletedStakeOnAllPayouts: BigNumber, completedStakeAmount: BigNumber): BigNumber {
  return totalCompletedStakeOnAllPayouts.times(2).minus(completedStakeAmount.times(3));
}

export function getDisputeInfo(db: Knex, marketIds: Array<Address>, account: Address|null, callback: (err: Error|null, result?: Array<UIStakeInfo<string>|null>) => void): void {
  console.log("----------------------------\nGet Dispute Info\n------------------------");
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));


  parallel({
    markets: (next: AsyncCallback) => getMarketsWithReportingState(db).whereIn("markets.marketId", marketIds).asCallback(next),
    payouts: (next: AsyncCallback) => db("payouts").whereIn("marketId", marketIds).asCallback(next),
    stakesCompleted: (next: AsyncCallback) => getCompletedStakes(db, marketIds, next),
    stakesCurrent: (next: AsyncCallback) => getCurrentStakes(db, marketIds, next),
    accountStakesCurrent: (next: AsyncCallback) => getAccountStakes(db, marketIds, account, false, next),
    accountStakesCompleted: (next: AsyncCallback) => getAccountStakes(db, marketIds, account, true, next),
    disputeRound: (next: AsyncCallback) => db("crowdsourcers").select("marketId").count("* as disputeRound").groupBy("crowdsourcers.marketId").where("crowdsourcers.completed", 1).whereIn("crowdsourcers.marketId", marketIds).asCallback(next),
  }, (err: Error|null, stakeResults: DisputesResult): void => {
    if (err) return callback(err);
    if (!stakeResults.markets) return callback(new Error("Could not retrieve markets"));

    console.log("ACCOUNT STAKES COMPLETED (unfiltered)");
    _.map(stakeResults.accountStakesCompleted, console.dir);
    console.log("ACCOUNT STAKES CURRENT   (unfiltered)");
    _.map(stakeResults.accountStakesCurrent, console.dir);

    const disputeDetailsByMarket: Array<DisputesResult> =
      _.map(marketIds, (marketId: Address): DisputesResult => {
        return {
          markets: _.filter(stakeResults.markets, { marketId }),
          payouts: _.filter(stakeResults.payouts, { marketId }),
          stakesCompleted: _.filter(stakeResults.stakesCompleted, { marketId }),
          stakesCurrent: _.filter(stakeResults.stakesCurrent, { marketId }),
          accountStakesCurrent: _.filter(stakeResults.accountStakesCurrent, { marketId }),
          accountStakesCompleted: _.filter(stakeResults.accountStakesCompleted, { marketId }),
          disputeRound: _.filter(stakeResults.disputeRound, { marketId }),
        }
      });

    callback(null, disputeDetailsByMarket.map(reshapeStakeRowToUIStakeInfo));
  });
}

function reshapeStakeRowToUIStakeInfo(stakeRows: DisputesResult): UIStakeInfo<string>|null {
  console.log("----------------------------\nReshaping Market Row\n------------------------");
  const marketRow = stakeRows.markets[0];
  if (marketRow == null) return null;
  const totalCompletedStakeOnAllPayouts = _.reduce(
    stakeRows.stakesCompleted,
    (result: BigNumber, completedStake: StakeRow): BigNumber => result.plus(completedStake.amountStaked),
    ZERO
  );

  console.log("TOTAL COMPLETED STAKE: ", totalCompletedStakeOnAllPayouts.toFixed());

  const stakeCompletedByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.stakesCompleted, "payoutId");
  const stakeCurrentByPayout: { [payoutId: number]: ActiveCrowdsourcer } = _.keyBy(stakeRows.stakesCurrent, "payoutId");
  const accountStakeCompletedByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.accountStakesCompleted, "payoutId");
  const accountStakeCurrentByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.accountStakesCurrent, "payoutId");

  console.log("ACCOUNT STAKES COMPLETED: ");
  _.map(stakeRows.accountStakesCompleted, console.dir);
  console.log("ACCOUNT STAKES COMPLETED BY PAYOUT: ");
  _.map(accountStakeCompletedByPayout, console.dir);

  const stakeResults = _.map(stakeRows.payouts, (payout: PayoutRow<BigNumber>): StakeDetails<BigNumber> => {
    console.log(`   ---------- PROCESSING PAYOUT ID ${payout.payoutId} ----------- `);
    const stakeCompletedRow = stakeCompletedByPayout[payout.payoutId];
    const stakeCurrentRow = stakeCurrentByPayout[payout.payoutId];
    const accountStakeCompletedRow = accountStakeCompletedByPayout[payout.payoutId];
    const accountStakeCurrentRow = accountStakeCurrentByPayout[payout.payoutId];

    const stakeCompleted: BigNumber = !stakeCompletedRow  ? ZERO : stakeCompletedRow.amountStaked;
    const stakeCurrentOnPayout: BigNumber = !stakeCurrentRow ? ZERO : stakeCurrentRow.amountStaked;

    let currentAmounts: StakeSizes<BigNumber> = {};
    console.log("ACCOUNT STAKE COMPLETED ROW: ", accountStakeCompletedRow);
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
        bondSizeCurrent: bondSizeCurrent,
        stakeCurrent: stakeCurrent,
        accountStakeCurrent: accountStakeCurrent,
        accountStakeTotal: accountStakeCurrent.plus(accountStakeCompleted),
        stakeRemaining: bondSizeCurrent.minus(stakeCurrent),
        bondSizeTotal: bondSizeCurrent.plus(stakeCompleted),
      };
    }
    currentAmounts.accountStakeCompleted = accountStakeCompleted;

    console.log("stake completed: ", stakeCompleted);

    return Object.assign({},
      normalizePayouts(payout),
      currentAmounts,
      {
        stakeCurrent: stakeCurrentOnPayout,
        stakeCompleted: stakeCompleted,
        tentativeWinning: !!payout.tentativeWinning,
      },
    );
  });

  let disputeRound = null;
  if (!totalCompletedStakeOnAllPayouts.isEqualTo(0)) {
    if (stakeRows.disputeRound[0]) {
      disputeRound = stakeRows.disputeRound[0].disputeRound;
    } else {
      disputeRound = 0;
    }
  }
  // It'd be nice if UIStakeInfo was a class and we could just recursively serialize its props
  return Object.assign(formatBigNumberAsFixed<Partial<UIStakeInfo<BigNumber>>, Partial<UIStakeInfo<string>>>({
    marketId: marketRow.marketId,
    stakeCompletedTotal: totalCompletedStakeOnAllPayouts,
    bondSizeOfNewStake: totalCompletedStakeOnAllPayouts.times(2),
    disputeRound
  }), {
    stakes: stakeResults.map(result => formatBigNumberAsFixed<StakeDetails<BigNumber>, StakeDetails<String>>(result))
  }) as UIStakeInfo<string>;
}
