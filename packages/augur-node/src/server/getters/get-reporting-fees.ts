import * as t from "io-ts";
import Knex from "knex";
import * as _ from "lodash";
import { Address, Augur, BigNumber, DisputeWindowState, ReportingState } from "../../types";
import { BigNumber as BigNumberJS } from "bignumber.js";

import { ZERO } from "../../constants";

export const ReportingFeesParams = t.type({
  universe: t.string,
  reporter: t.string,
});

export interface CrowdsourcerState {
  crowdsourcerId: Address;
  needsFork: boolean;
}

export interface InitialReporterState {
  initialReporterId: Address;
  needsFork: boolean;
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
    unclaimedRepStaked: string;
    unclaimedRepEarned: string;
    unclaimedForkRepStaked: string;
    lostRep: string;
  };
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: Array<NonforkedMarket>;
}

interface FormattedMarketInfo {
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: Array<NonforkedMarket>;
}

interface DisputeWindowCompletionStakeRow {
  disputeWindow: Address;
  amountStaked: BigNumber;
  winning: number;
  disavowed: boolean;
  needsDisavowal: boolean;
  completed: boolean;
  forking: boolean;
  marketId: Address;
}

interface InitialReporterStakeRow {
  amountStaked: BigNumber;
  winning: number;
  forking: boolean;
  marketId: Address;
}

interface RepStakeResults {
  unclaimedRepStaked: BigNumber;
  unclaimedRepEarned: BigNumber;
  lostRep: BigNumber;
  unclaimedForkRepStaked: BigNumber;
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

interface AddressMap {
  [marketId: string]: boolean;
}

async function getUniverse(db: Knex, universe: Address): Promise<Address> {
  const query = db("dispute_windows")
    .first("universes.universe", "universes.parentUniverse")
    .join("universes", "dispute_windows.universe", "universes.universe")
    .groupBy("dispute_windows.universe")
    .where("dispute_windows.universe", universe);
  const currentUniverseRow: { universe: Address } = await query;
  if (!currentUniverseRow) throw new Error("Universe not found");
  return currentUniverseRow.universe;
}

function formatMarketInfo(initialReporters: Array<UnclaimedInitialReporterRow>, crowdsourcers: Array<UnclaimedCrowdsourcerRow>, forkedMarket: ForkedMarket) {
  if (forkedMarket) {
    forkedMarket.crowdsourcers = [];
  }
  const keyedNonforkedMarkets: { [marketId: string]: NonforkedMarket } = {};
  let i: number;
  for (i = 0; i < initialReporters.length; i++) {
    if (initialReporters[i].forking) {
      forkedMarket.initialReporter = {
        initialReporterId: initialReporters[i].initialReporter,
        needsFork: !initialReporters[i].disavowed,
      };
    } else {
      keyedNonforkedMarkets[initialReporters[i].marketId] = {
        marketId: initialReporters[i].marketId,
        universe: initialReporters[i].universe,
        crowdsourcersAreDisavowed: false,
        isMigrated: !initialReporters[i].needsMigration,
        isFinalized: initialReporters[i].reportingState === ReportingState.FINALIZED,
        crowdsourcers: [],
        initialReporter: initialReporters[i].initialReporter,
      };
    }
  }
  for (i = 0; i < crowdsourcers.length; i++) {
    if (crowdsourcers[i].forking) {
      forkedMarket.crowdsourcers.push({ crowdsourcerId: crowdsourcers[i].crowdsourcerId, needsFork: !crowdsourcers[i].disavowed });
    } else {
      if (!keyedNonforkedMarkets[crowdsourcers[i].marketId]) {
        keyedNonforkedMarkets[crowdsourcers[i].marketId] = {
          marketId: crowdsourcers[i].marketId,
          universe: crowdsourcers[i].universe,
          crowdsourcersAreDisavowed: !!crowdsourcers[i].disavowed,
          isMigrated: !crowdsourcers[i].needsMigration,
          isFinalized: crowdsourcers[i].reportingState === ReportingState.FINALIZED,
          crowdsourcers: [crowdsourcers[i].crowdsourcerId],
          initialReporter: null,
        };
      } else {
        keyedNonforkedMarkets[crowdsourcers[i].marketId].crowdsourcersAreDisavowed = !!crowdsourcers[i].disavowed;
        keyedNonforkedMarkets[crowdsourcers[i].marketId].crowdsourcers.push(crowdsourcers[i].crowdsourcerId);
      }
    }
  }
  const nonforkedMarkets = Object.keys(keyedNonforkedMarkets).map((key) => keyedNonforkedMarkets[key]);
  return { forkedMarket, nonforkedMarkets };
}

async function getMarketsReportingParticipants(db: Knex, reporter: Address, universe: Address): Promise<FormattedMarketInfo> {
  const initialReportersQuery = db("initial_reports")
    .distinct("initial_reports.initialReporter")
    .select(["initial_reports.disavowed", "initial_reports.marketId", "markets.universe", "market_state.reportingState", "markets.forking", "markets.needsMigration"])
    .join("markets", "initial_reports.marketId", "markets.marketId")
    .join("dispute_windows", "markets.disputeWindow", "dispute_windows.disputeWindow")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId")
    .whereRaw("(markets.forking OR market_state.reportingState IN (?, ?, ?) OR (initial_reports.disavowed != 0 OR markets.needsDisavowal) AND (dispute_windows.state = ? OR reportingState = ? ) )",
      [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, ReportingState.FORKING, DisputeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION])
    .where("markets.universe", universe)
    .where("initial_reports.reporter", reporter)
    .where("initial_reports.redeemed", 0);
  const crowdsourcersQuery = db("crowdsourcers")
    .distinct("crowdsourcers.crowdsourcerId")
    .select(["crowdsourcers.disavowed", "crowdsourcers.marketId", "markets.universe", "market_state.reportingState", "markets.forking", "markets.needsMigration", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .join("markets", "crowdsourcers.marketId", "markets.marketId")
    .join("dispute_windows", "crowdsourcers.disputeWindow", "dispute_windows.disputeWindow")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId")
    .whereRaw("(markets.forking or (market_state.reportingState IN (?, ?, ?)) OR (crowdsourcers.disavowed != 0 OR markets.needsDisavowal) AND (dispute_windows.state = ? OR reportingState = ? ) )",
      [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, ReportingState.FORKING, DisputeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION])
    .andWhere("markets.universe", universe)
    .andWhere("balances.owner", reporter)
    .andWhereNot("balances.balance", "0");
  const forkedMarketQuery = db("markets")
    .first(["markets.marketId", "markets.universe", db.raw("market_state.reportingState = 'FINALIZED' as isFinalized")])
    .where("markets.forking", 1)
    .where("markets.universe", universe)
    .join("market_state", "markets.marketId", "market_state.marketId");

  const initialReporters: Array<UnclaimedInitialReporterRow> = await initialReportersQuery;
  const crowdsourcers: Array<UnclaimedCrowdsourcerRow> = await crowdsourcersQuery;
  const forkedMarket: ForkedMarket = await forkedMarketQuery;
  return formatMarketInfo(initialReporters, crowdsourcers, forkedMarket);
}

async function getStakedRepResults(db: Knex, reporter: Address, universe: Address): Promise<{ fees: RepStakeResults }> {
  const crowdsourcerQuery = db.select([
    "dispute_windows.disputeWindow",
    "dispute_windows.state",
    "stakedRep.balance as amountStaked",
    "payouts.winning",
    "crowdsourcers.disavowed",
    "crowdsourcers.completed",
    "markets.forking",
    "markets.needsDisavowal",
    "markets.marketId",
  ]).from("crowdsourcers");
  crowdsourcerQuery.join("dispute_windows", "crowdsourcers.disputeWindow", "dispute_windows.disputeWindow");
  crowdsourcerQuery.join("payouts", "crowdsourcers.payoutId", "payouts.payoutId");
  crowdsourcerQuery.join("markets", "markets.marketId", "crowdsourcers.marketId");
  crowdsourcerQuery.join("market_state", "markets.marketStateId", "market_state.marketStateId");
  crowdsourcerQuery.where(db.raw("(markets.forking or market_state.reportingState IN (?, ?) OR ( (crowdsourcers.disavowed or markets.needsDisavowal) AND (dispute_windows.state = ? OR reportingState = ? )))",
    [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, DisputeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION]));
  crowdsourcerQuery.leftJoin("balances AS stakedRep", function () {
    this
      .on("crowdsourcers.crowdsourcerId", db.raw("stakedRep.token"))
      .andOn("stakedRep.owner", db.raw("?", reporter));
  });
  crowdsourcerQuery.where("dispute_windows.universe", universe);

  const initialReportersQuery = db.select(["initial_reports.amountStaked", "payouts.winning", "markets.forking", "markets.marketId"]).from("initial_reports")
    .join("payouts", "initial_reports.payoutId", "payouts.payoutId")
    .join("markets", "markets.marketId", "initial_reports.marketId")
    .join("market_state", "markets.marketStateId", "market_state.marketStateId")
    .join("dispute_windows", "markets.disputeWindow", "dispute_windows.disputeWindow")
    .where("markets.universe", universe)
    .where(db.raw("(markets.forking or market_state.reportingState IN (?, ?) OR ( (initial_reports.disavowed or markets.needsDisavowal) AND (dispute_windows.state = ? OR reportingState = ? )))",
      [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, DisputeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION]))
    .where("initial_reports.reporter", reporter)
    .whereNot("initial_reports.redeemed", 1);
  const crowdsourcers: Array<DisputeWindowCompletionStakeRow> = await crowdsourcerQuery;
  const initialReporters: Array<InitialReporterStakeRow> = await initialReportersQuery;
  const marketDisputed: AddressMap = {};
  let fees = _.reduce(crowdsourcers, (acc: RepStakeResults, disputeWindowCompletionStake: DisputeWindowCompletionStakeRow) => {
    const disavowed = disputeWindowCompletionStake.disavowed || disputeWindowCompletionStake.needsDisavowal;
    if (disputeWindowCompletionStake.completed && !disavowed) {
      marketDisputed[disputeWindowCompletionStake.marketId] = true;
    }
    const getsRep = disputeWindowCompletionStake.winning || disavowed || !disputeWindowCompletionStake.completed;
    const earnsRep = disputeWindowCompletionStake.completed && (disputeWindowCompletionStake.winning > 0);
    const lostRep = disputeWindowCompletionStake.completed && (disputeWindowCompletionStake.winning === 0);
    return {
      unclaimedRepStaked: acc.unclaimedRepStaked.add(disputeWindowCompletionStake.forking ? ZERO : (!getsRep ? ZERO : (disputeWindowCompletionStake.amountStaked || ZERO))),
      unclaimedRepEarned: acc.unclaimedRepEarned.add(disputeWindowCompletionStake.forking ? ZERO : (!earnsRep ? ZERO : (disputeWindowCompletionStake.amountStaked || ZERO)).mul(2).div(5)),
      lostRep: acc.lostRep.add(lostRep ? (disputeWindowCompletionStake.amountStaked || ZERO) : ZERO),
      unclaimedForkRepStaked: acc.unclaimedForkRepStaked.add(disputeWindowCompletionStake.forking ? (disputeWindowCompletionStake.amountStaked || ZERO) : ZERO),
    };
  }, { unclaimedRepStaked: ZERO, unclaimedRepEarned: ZERO, lostRep: ZERO, unclaimedForkRepStaked: ZERO });
  fees = _.reduce(initialReporters, (acc: RepStakeResults, initialReporterStake: InitialReporterStakeRow) => {
    let unclaimedRepEarned = acc.unclaimedRepEarned;
    if (marketDisputed[initialReporterStake.marketId] && !initialReporterStake.forking && initialReporterStake.winning) {
      unclaimedRepEarned = unclaimedRepEarned.add((initialReporterStake.amountStaked || ZERO).mul(2).div(5));
    }
    return {
      unclaimedRepStaked: acc.unclaimedRepStaked.add(initialReporterStake.forking ? ZERO : (initialReporterStake.winning === 0 ? ZERO : (initialReporterStake.amountStaked || ZERO))),
      unclaimedRepEarned,
      lostRep: acc.lostRep.add(initialReporterStake.winning === 0 ? (initialReporterStake.amountStaked || ZERO) : ZERO),
      unclaimedForkRepStaked: acc.unclaimedForkRepStaked.add(initialReporterStake.forking ? (initialReporterStake.amountStaked || ZERO) : ZERO),
    };
  }, fees);
  return { fees };
}

export async function getReportingFees(db: Knex, augur: Augur, params: t.TypeOf<typeof ReportingFeesParams>): Promise<FeeDetails> {
  const currentUniverse = await getUniverse(db, params.universe);
  const {
    fees: {
      lostRep,
      unclaimedForkRepStaked,
      unclaimedRepEarned,
      unclaimedRepStaked
    }
  } = await getStakedRepResults(db, params.reporter, params.universe);
  const result: FormattedMarketInfo = await getMarketsReportingParticipants(db, params.reporter, currentUniverse);
  const response = {
    total: {
      unclaimedRepStaked: new BigNumberJS(unclaimedRepStaked.toString()).toFixed(0, BigNumberJS.ROUND_DOWN),
      unclaimedRepEarned: new BigNumberJS(unclaimedRepEarned.toString()).toFixed(0, BigNumberJS.ROUND_DOWN),
      lostRep: new BigNumberJS(lostRep.toString()).toFixed(0, BigNumberJS.ROUND_DOWN),
      unclaimedForkRepStaked: new BigNumberJS(unclaimedForkRepStaked.toString()).toFixed(0, BigNumberJS.ROUND_DOWN),
    },
    forkedMarket: result.forkedMarket,
    nonforkedMarkets: result.nonforkedMarkets,
  };
  return response;
}
