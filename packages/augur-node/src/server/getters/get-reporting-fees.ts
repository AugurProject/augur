import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { BigNumber } from "bignumber.js";
import { Address, FeeWindowState, ReportingState } from "../../types";
import { ZERO } from "../../constants";
import { getCashAddress } from "./database";

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
    unclaimedEth: string;
    unclaimedRepStaked: string;
    unclaimedRepEarned: string;
    unclaimedForkEth: string;
    unclaimedForkRepStaked: string;
    lostRep: string;
  };
  feeWindows: Array<Address>;
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: Array<NonforkedMarket>;
}

interface FormattedMarketInfo {
  forkedMarket: ForkedMarket|null;
  nonforkedMarkets: Array<NonforkedMarket>;
}

interface EthFeeRow {
  feeWindow: Address;
  feeTokenSupply: string;
  participationTokenSupply: string;
  cashFeeWindow: string;
}

interface ParticipationTokensEthFeeRow extends EthFeeRow {
  participationTokens: string;
}

interface ParticipantEthFeeRow extends EthFeeRow {
  participantAddress: string;
  participationTokens: string;
  feeTokenBalance: string;
  cashParticipant: string;
  reporterBalance: string;
  participantSupply: string;
  forking: boolean;
}

interface FeeWindowCompletionStakeRow {
  feeWindow: Address;
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

interface ParticipantEthFee {
  feeWindow: string|null;
  participantAddress: string;
  fork: boolean;
  ethFees: BigNumber;
}

interface ParticipationTokenEthFee {
  feeWindow: string;
  ethFees: BigNumber;
  participationTokens: BigNumber;
}

interface AddressMap {
  [marketId: string]: boolean;
}

async function getUniverse(db: Knex, universe: Address): Promise<Address> {
  const query = db("fee_windows")
    .first("universes.universe", "universes.parentUniverse")
    .join("universes", "fee_windows.universe", "universes.universe")
    .groupBy("fee_windows.universe")
    .where("fee_windows.universe", universe);
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
    .join("fee_windows", "markets.feeWindow", "fee_windows.feeWindow")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId")
    .whereRaw("(markets.forking OR market_state.reportingState IN (?, ?, ?) OR (initial_reports.disavowed != 0 OR markets.needsDisavowal) AND (fee_windows.state = ? OR reportingState = ? ) )",
      [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, ReportingState.FORKING, FeeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION])
    .where("markets.universe", universe)
    .where("initial_reports.reporter", reporter)
    .where("initial_reports.redeemed", 0);
  const crowdsourcersQuery = db("crowdsourcers")
    .distinct("crowdsourcers.crowdsourcerId")
    .select(["crowdsourcers.disavowed", "crowdsourcers.marketId", "markets.universe", "market_state.reportingState", "markets.forking", "markets.needsMigration", "balances.balance as amountStaked"])
    .join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .join("markets", "crowdsourcers.marketId", "markets.marketId")
    .join("fee_windows", "crowdsourcers.feeWindow", "fee_windows.feeWindow")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId")
    .whereRaw("(markets.forking or (market_state.reportingState IN (?, ?, ?)) OR (crowdsourcers.disavowed != 0 OR markets.needsDisavowal) AND (fee_windows.state = ? OR reportingState = ? ) )",
      [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, ReportingState.FORKING, FeeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION])
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
    "fee_windows.feeWindow",
    "fee_windows.state",
    "stakedRep.balance as amountStaked",
    "payouts.winning",
    "crowdsourcers.disavowed",
    "crowdsourcers.completed",
    "markets.forking",
    "markets.needsDisavowal",
    "markets.marketId",
  ]).from("crowdsourcers");
  crowdsourcerQuery.join("fee_windows", "crowdsourcers.feeWindow", "fee_windows.feeWindow");
  crowdsourcerQuery.join("payouts", "crowdsourcers.payoutId", "payouts.payoutId");
  crowdsourcerQuery.join("markets", "markets.marketId", "crowdsourcers.marketId");
  crowdsourcerQuery.join("market_state", "markets.marketStateId", "market_state.marketStateId");
  crowdsourcerQuery.where(db.raw("(markets.forking or market_state.reportingState IN (?, ?) OR ( (crowdsourcers.disavowed or markets.needsDisavowal) AND (fee_windows.state = ? OR reportingState = ? )))",
    [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, FeeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION]));
  crowdsourcerQuery.leftJoin("balances AS stakedRep", function () {
    this
      .on("crowdsourcers.crowdsourcerId", db.raw("stakedRep.token"))
      .andOn("stakedRep.owner", db.raw("?", reporter));
  });
  crowdsourcerQuery.where("fee_windows.universe", universe);

  const initialReportersQuery = db.select(["initial_reports.amountStaked", "payouts.winning", "markets.forking", "markets.marketId"]).from("initial_reports")
    .join("payouts", "initial_reports.payoutId", "payouts.payoutId")
    .join("markets", "markets.marketId", "initial_reports.marketId")
    .join("market_state", "markets.marketStateId", "market_state.marketStateId")
    .join("fee_windows", "markets.feeWindow", "fee_windows.feeWindow")
    .where("markets.universe", universe)
    .where(db.raw("(markets.forking or market_state.reportingState IN (?, ?) OR ( (initial_reports.disavowed or markets.needsDisavowal) AND (fee_windows.state = ? OR reportingState = ? )))",
      [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, FeeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION]))
    .where("initial_reports.reporter", reporter)
    .whereNot("initial_reports.redeemed", 1);
  const crowdsourcers: Array<FeeWindowCompletionStakeRow> = await crowdsourcerQuery;
  const initialReporters: Array<InitialReporterStakeRow> = await initialReportersQuery;
  const marketDisputed: AddressMap = {};
  let fees = _.reduce(crowdsourcers, (acc: RepStakeResults, feeWindowCompletionStake: FeeWindowCompletionStakeRow) => {
    const disavowed = feeWindowCompletionStake.disavowed || feeWindowCompletionStake.needsDisavowal;
    if (feeWindowCompletionStake.completed && !disavowed) {
      marketDisputed[feeWindowCompletionStake.marketId] = true;
    }
    const getsRep = feeWindowCompletionStake.winning || disavowed || !feeWindowCompletionStake.completed;
    const earnsRep = feeWindowCompletionStake.completed && (feeWindowCompletionStake.winning > 0);
    const lostRep = feeWindowCompletionStake.completed && (feeWindowCompletionStake.winning === 0);
    return {
      unclaimedRepStaked: acc.unclaimedRepStaked.plus(feeWindowCompletionStake.forking ? ZERO : (!getsRep ? ZERO : (feeWindowCompletionStake.amountStaked || ZERO))),
      unclaimedRepEarned: acc.unclaimedRepEarned.plus(feeWindowCompletionStake.forking ? ZERO : (!earnsRep ? ZERO : (feeWindowCompletionStake.amountStaked || ZERO)).div(2)),
      lostRep: acc.lostRep.plus(lostRep ? (feeWindowCompletionStake.amountStaked || ZERO) : ZERO),
      unclaimedForkRepStaked: acc.unclaimedForkRepStaked.plus(feeWindowCompletionStake.forking ? (feeWindowCompletionStake.amountStaked || ZERO) : ZERO),
    };
  }, { unclaimedRepStaked: ZERO, unclaimedRepEarned: ZERO, lostRep: ZERO, unclaimedForkRepStaked: ZERO });
  fees = _.reduce(initialReporters, (acc: RepStakeResults, initialReporterStake: InitialReporterStakeRow) => {
    let unclaimedRepEarned = acc.unclaimedRepEarned;
    if (marketDisputed[initialReporterStake.marketId] && !initialReporterStake.forking && initialReporterStake.winning) {
      unclaimedRepEarned = unclaimedRepEarned.plus((initialReporterStake.amountStaked || ZERO).div(2));
    }
    return {
      unclaimedRepStaked: acc.unclaimedRepStaked.plus(initialReporterStake.forking ? ZERO : (initialReporterStake.winning === 0 ? ZERO : (initialReporterStake.amountStaked || ZERO))),
      unclaimedRepEarned,
      lostRep: acc.lostRep.plus(initialReporterStake.winning === 0 ? (initialReporterStake.amountStaked || ZERO) : ZERO),
      unclaimedForkRepStaked: acc.unclaimedForkRepStaked.plus(initialReporterStake.forking ? (initialReporterStake.amountStaked || ZERO) : ZERO),
    };
  }, fees);
  return { fees };
}

async function getParticipationTokenEthFees(db: Knex, augur: Augur, reporter: Address, universe: Address): Promise<Array<ParticipationTokenEthFee>> {
  const participationTokenQuery = db.select([
    "fee_windows.feeWindow",
    "participationToken.balance AS participationTokens",
    db.raw("IFNULL(feeTokenSupply.supply,0) as feeTokenSupply"),
    db.raw("IFNULL(participationTokenSupply.supply,0) as participationTokenSupply"),
    db.raw("IFNULL(cashFeeWindow.balance,0) as cashFeeWindow"),
  ]).from("fee_windows");
  participationTokenQuery.join("balances AS participationToken", function () {
    this
      .on("participationToken.token", db.raw("fee_windows.feeWindow"))
      .andOn("participationToken.owner", db.raw("?", [reporter]));
  });
  participationTokenQuery.leftJoin("balances AS cashFeeWindow", function () {
    this
      .on("cashFeeWindow.owner", db.raw("fee_windows.feeWindow"))
      .on("cashFeeWindow.token", db.raw("?", getCashAddress(augur)));
  });
  participationTokenQuery.leftJoin("token_supply as feeTokenSupply", "feeTokenSupply.token", "fee_windows.feeToken")
    .leftJoin("token_supply as participationTokenSupply", "participationTokenSupply.token", "fee_windows.feeWindow")
    .whereNot("participationTokens", "0")
    .where("fee_windows.state", FeeWindowState.PAST)
    .where("fee_windows.universe", universe);
  const participationTokens: Array<ParticipationTokensEthFeeRow> = await participationTokenQuery;
  const participationTokenEthFees = _.map(participationTokens, (participationToken) => {
    const totalFeeTokensInFeeWindow = new BigNumber(participationToken.feeTokenSupply).plus(new BigNumber(participationToken.participationTokenSupply));
    const cashInFeeWindow = new BigNumber(participationToken.cashFeeWindow);
    const participationTokens = new BigNumber(participationToken.participationTokens);
    const reporterShareOfFeeWindow = totalFeeTokensInFeeWindow.isZero() ? ZERO : participationTokens.dividedBy(totalFeeTokensInFeeWindow);
    const ethFees = reporterShareOfFeeWindow.times(cashInFeeWindow);
    return {
      feeWindow: participationToken.feeWindow,
      ethFees,
      participationTokens,
    };
  });
  return participationTokenEthFees;
}

async function getParticipantEthFees(db: Knex, augur: Augur, reporter: Address, universe: Address): Promise<Array<ParticipantEthFee>> {
  const participantQuery = db.select([
    "participantAddress",
    "feeToken.feeWindow",
    "feeToken.token as feeToken",
    "reporterBalance",
    "participantSupply",
    "forking",
    "reputationToken",
    "reputationTokenBalance",
    db.raw("IFNULL(feeToken.balance,0) as feeTokenBalance"),
    db.raw("IFNULL(feeToken.supply,0) as feeTokenSupply"),
    db.raw("IFNULL(cashFeeWindow.balance,0) as cashFeeWindow"),
    db.raw("IFNULL(cashParticipant.balance,0) as cashParticipant"),
    db.raw("IFNULL(participationTokenSupply.supply,0) as participationTokenSupply"),
    "disavowed"]).from("all_participants");
  participantQuery.join("fee_windows", "all_participants.feeWindow", "fee_windows.feeWindow");
  participantQuery.leftJoin("balances_detail as feeToken", function () {
    this
      .on("feeToken.owner", db.raw("all_participants.participantAddress"))
      .andOn("feeToken.symbol", db.raw("?", "FeeToken"));
  });
  participantQuery.leftJoin("balances AS cashFeeWindow", function () {
    this
      .on("cashFeeWindow.owner", db.raw("feeToken.feeWindow"))
      .on("cashFeeWindow.token", db.raw("?", getCashAddress(augur)));
  });
  participantQuery.leftJoin("balances AS cashParticipant", function () {
    this
      .on("cashParticipant.owner", db.raw("participantAddress"))
      .andOn("cashParticipant.token", db.raw("?", getCashAddress(augur)));
  });
  participantQuery.leftJoin("token_supply as participationTokenSupply", "participationTokenSupply.token", "feeToken.feeWindow");
  participantQuery.where("all_participants.universe", universe);
  participantQuery.where("all_participants.reporter", reporter);
  participantQuery.whereNot("all_participants.participantSupply", "0");
  participantQuery.whereNot("all_participants.reporterBalance", "0");
  participantQuery.whereRaw("(reportingState IN (?, ?) OR ((disavowed != 0 or all_participants.needsDisavowal) AND (fee_windows.state = ? OR reportingState = ?)))", [ReportingState.AWAITING_FINALIZATION, ReportingState.FINALIZED, FeeWindowState.PAST, ReportingState.AWAITING_FORK_MIGRATION]);
  const participantEthFeeRows: Array<ParticipantEthFeeRow> = await participantQuery;
  const participantEthFeesOnWindow = _.map(participantEthFeeRows, (ethFeeRows): ParticipantEthFee => {
    const totalFeeTokensInFeeWindow = new BigNumber(ethFeeRows.feeTokenSupply).plus(new BigNumber(ethFeeRows.participationTokenSupply));
    const participantShareOfFeeWindow = totalFeeTokensInFeeWindow.isZero() ? ZERO : new BigNumber(ethFeeRows.feeTokenBalance).dividedBy(totalFeeTokensInFeeWindow);
    const cashInFeeWindow = new BigNumber(ethFeeRows.cashFeeWindow);
    const participantEthFees = participantShareOfFeeWindow.times(cashInFeeWindow);
    const reporterShareOfParticipant = new BigNumber(ethFeeRows.reporterBalance).dividedBy(ethFeeRows.participantSupply);
    const ethFees = reporterShareOfParticipant.times(participantEthFees);
    return {
      participantAddress: ethFeeRows.participantAddress,
      feeWindow: ethFeeRows.feeWindow,
      ethFees,
      fork: ethFeeRows.forking,
    };
  });
  // keyBy/valuesIn reduces down to a single object per participantAddress
  const cashBalanceByParticipant: Array<ParticipantEthFeeRow> = _.valuesIn(_.keyBy(participantEthFeeRows, "participantAddress"));
  const participantEthFeesOnParticipant: Array<ParticipantEthFee> = _.map(cashBalanceByParticipant, (ethFeeRows) => {
    const reporterShareOfParticipant = new BigNumber(ethFeeRows.reporterBalance).dividedBy(ethFeeRows.participantSupply);
    const participantEthFees = new BigNumber(ethFeeRows.cashParticipant);
    const ethFees = reporterShareOfParticipant.times(participantEthFees);
    return {
      participantAddress: ethFeeRows.participantAddress,
      feeWindow: null,
      ethFees,
      fork: ethFeeRows.forking,
    };
  });
  return participantEthFeesOnWindow.concat(participantEthFeesOnParticipant);
}

export async function getReportingFees(db: Knex, augur: Augur, params: t.TypeOf<typeof ReportingFeesParams>): Promise<FeeDetails> {
  const currentUniverse = await getUniverse(db, params.universe);
  const participantEthFees: Array<ParticipantEthFee> = await getParticipantEthFees(db, augur, params.reporter, params.universe);
  const participationTokenEthFees: Array<ParticipationTokenEthFee> = await getParticipationTokenEthFees(db, augur, params.reporter, params.universe);
  const repStakeResults = await getStakedRepResults(db, params.reporter, params.universe);
  const result: FormattedMarketInfo = await getMarketsReportingParticipants(db, params.reporter, currentUniverse);
  const unclaimedParticipantEthFees = _.reduce(participantEthFees, (acc, cur) => acc.plus(cur.fork ? 0 : cur.ethFees), ZERO);
  const unclaimedForkEthFees = _.reduce(participantEthFees, (acc, cur) => acc.plus(cur.fork ? cur.ethFees : 0), ZERO);
  const unclaimedParticipationTokenEthFees = _.reduce(participationTokenEthFees, (acc, cur) => acc.plus(cur.ethFees), ZERO);
  const redeemableFeeWindows = _.map(participationTokenEthFees, "feeWindow");
  const participationTokenRepStaked = _.reduce(participationTokenEthFees, (acc, cur) => acc.plus(cur.participationTokens), ZERO);
  const unclaimedRepStaked = repStakeResults.fees.unclaimedRepStaked.plus(participationTokenRepStaked);
  const response = {
    total: {
      unclaimedEth: unclaimedParticipantEthFees.plus(unclaimedParticipationTokenEthFees).toFixed(0, BigNumber.ROUND_DOWN),
      unclaimedRepStaked: unclaimedRepStaked.toFixed(0, BigNumber.ROUND_DOWN),
      unclaimedRepEarned: repStakeResults.fees.unclaimedRepEarned.toFixed(0, BigNumber.ROUND_DOWN),
      lostRep: repStakeResults.fees.lostRep.toFixed(0, BigNumber.ROUND_DOWN),
      unclaimedForkEth: unclaimedForkEthFees.toFixed(0, BigNumber.ROUND_DOWN),
      unclaimedForkRepStaked: repStakeResults.fees.unclaimedForkRepStaked.toFixed(0, BigNumber.ROUND_DOWN),
    },
    feeWindows: redeemableFeeWindows.sort(),
    forkedMarket: result.forkedMarket,
    nonforkedMarkets: result.nonforkedMarkets,
  };
  return response;
}
