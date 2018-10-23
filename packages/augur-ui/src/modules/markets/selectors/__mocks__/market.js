const market = jest.genMockFromModule("modules/markets/selectors/market");

market.selectMarket = jest.fn(value => value);

module.exports = market;
