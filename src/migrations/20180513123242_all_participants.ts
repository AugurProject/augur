import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW IF EXISTS all_participants").then((): PromiseLike<any> => {
    return knex.raw(`CREATE VIEW all_participants AS
      SELECT
        markets.universe,
        markets.marketId,
        markets.feeWindow,
        'initial_report' as type,
        ${knex.client.config.client === "sqlite3" ? "initialReporter" : "\"initialReporter\""} as participantAddress,
        initial_reports.reporter,
        initial_reports.${knex.client.config.client === "sqlite3" ? "blockNumber" : "\"blockNumber\""},
        ${knex.client.config.client === "sqlite3" ? "amountStaked" : "\"amountStaked\""} as size,
        ${knex.client.config.client === "sqlite3" ? "amountStaked" : "\"amountStaked\""} as participantSupply,
        CASE WHEN redeemed = false THEN initial_reports.${knex.client.config.client === "sqlite3" ? "amountStaked" : "\"amountStaked\""} ELSE '0' END as reporterBalance,
        contractBalances.token as reputationToken,
        contractBalances.balance as reputationTokenBalance,
        initial_reports.${knex.client.config.client === "sqlite3" ? "payoutId" : "\"payoutId\""},
        1 as completed,
        ${knex.client.config.client === "sqlite3" ? "reportingState" : "\"reportingState\""},
        markets.forking,
        cast(disavowed AS BOOLEAN) as disavowed,
        markets.needsDisavowal
      FROM initial_reports
        JOIN markets ON markets.marketId = initial_reports.${knex.client.config.client === "sqlite3" ? "marketId" : "\"marketId\""}
        JOIN universes ON markets.universe = universes.universe
        JOIN balances as contractBalances ON (contractBalances.owner = initial_reports.${knex.client.config.client === "sqlite3" ? "initialReporter" : "\"initialReporter\""} AND contractBalances.token = universes.${knex.client.config.client === "sqlite3" ? "reputationToken" : "\"reputationToken\""})
        JOIN market_state ON markets.marketStateId = market_state.${knex.client.config.client === "sqlite3" ? "marketStateId" : "\"marketStateId\""}
      union
      SELECT markets.universe, crowdsourcers.${knex.client.config.client === "sqlite3" ? "marketId" : "\"marketId\""}, markets.feeWindow, 'crowdsourcer' as type, crowdsourcers.${knex.client.config.client === "sqlite3" ? "crowdsourcerId" : "\"amountStaked\""} as participantAddress, accountBalances.owner as reporter, crowdsourcers.${knex.client.config.client === "sqlite3" ? "blockNumber" : "\"blockNumber\""}, crowdsourcers.size, participantSupply.supply as participantSupply, accountBalances.balance as reporterBalance, contractBalances.token as reputationToken, contractBalances.balance as reputationTokenBalance, crowdsourcers.${knex.client.config.client === "sqlite3" ? "payoutId" : "\"payoutId\""}, crowdsourcers.completed, ${knex.client.config.client === "sqlite3" ? "reportingState" : "\"reportingState\""}, markets.forking, crowdsourcers.disavowed, markets.needsDisavowal from crowdsourcers
        JOIN markets ON markets.marketId = crowdsourcers.${knex.client.config.client === "sqlite3" ? "marketId" : "\"marketId\""}
        JOIN universes ON markets.universe = universes.universe
        JOIN balances as accountBalances ON (accountBalances.token = crowdsourcers.${knex.client.config.client === "sqlite3" ? "crowdsourcerId" : "\"amountStaked\""})
        JOIN balances as contractBalances ON (contractBalances.owner = crowdsourcers.${knex.client.config.client === "sqlite3" ? "crowdsourcerId" : "\"amountStaked\""} AND contractBalances.token = universes.${knex.client.config.client === "sqlite3" ? "reputationToken" : "\"reputationToken\""})
        JOIN token_supply as participantSupply ON participantSupply.token = crowdsourcers.${knex.client.config.client === "sqlite3" ? "crowdsourcerId" : "\"crowdsourcerId\""}
        JOIN market_state ON markets.marketStateId = market_state.${knex.client.config.client === "sqlite3" ? "marketStateId" : "\"marketStateId\""}`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW all_participants");
};
