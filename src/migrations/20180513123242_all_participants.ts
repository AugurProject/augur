import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW IF EXISTS all_participants").then((): PromiseLike<any> => {
    return knex.raw(`CREATE VIEW all_participants AS
      SELECT markets.universe, markets.marketId, markets.feeWindow, 'initial_report' as type, initialReporter as participantAddress, initial_reports.reporter, initial_reports.blockNumber, amountStaked as size, amountStaked as participantSupply, CASE  WHEN redeemed = 0 THEN amountStaked ELSE 0 END as reporterBalance, contractBalances.token as reputationToken, contractBalances.balance as reputationTokenBalance, initial_reports.payoutId, 1 as completed, reportingState, markets.forking, disavowed, markets.needsDisavowal from initial_reports
        JOIN balances as contractBalances ON (contractBalances.owner = initial_reports.initialReporter AND contractBalances.token = universes.reputationToken)
        JOIN universes ON markets.universe = universes.universe
        JOIN markets ON markets.marketId = initial_reports.marketId
        JOIN market_state ON markets.marketStateId = market_state.marketStateId
      union
      SELECT markets.universe, crowdsourcers.marketId, markets.feeWindow, 'crowdsourcer' as type, crowdsourcers.crowdsourcerId as participantAddress, accountBalances.owner as reporter, crowdsourcers.blockNumber, crowdsourcers.size, participantSupply.supply as participantSupply, accountBalances.balance as reporterBalance, contractBalances.token as reputationToken, contractBalances.balance as reputationTokenBalance, crowdsourcers.payoutId, crowdsourcers.completed, reportingState, markets.forking, crowdsourcers.disavowed, markets.needsDisavowal from crowdsourcers
        JOIN balances as accountBalances ON (accountBalances.token = crowdsourcers.crowdsourcerId)
        JOIN balances as contractBalances ON (contractBalances.owner = crowdsourcers.crowdsourcerId AND contractBalances.token = universes.reputationToken)
        JOIN token_supply as participantSupply ON participantSupply.token = crowdsourcers.crowdsourcerId
        JOIN universes ON markets.universe = universes.universe
        JOIN markets ON markets.marketId = crowdsourcers.marketId
        JOIN market_state ON markets.marketStateId = market_state.marketStateId`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW all_participants");
};
