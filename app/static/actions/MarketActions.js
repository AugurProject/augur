var _ = require('lodash');

var constants = require('../constants');

var MarketActions = {
  loadMarkets: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var account = this.flux.store('network').getAccount();

    var branchId = branchState.currentBranch;
    var contract = configState.contract;

    var marketList = _.map(contract.call().getMarkets(branchId), function (id) {

      var marketInfo = contract.call().getMarketInfo(id);
      var marketText = contract.call().getMarketDesc(id);
      var marketComments = contract.call().getMarketComments(id);
      var marketHistory = contract.call().getMarketHistory(id);
      var marketVolume = contract.call().getMarketVolume(id);
      var marketShares = contract.call().getMarketShares(id, account);

      var lastPrice = marketHistory[marketHistory.length-1][1];

      return {
        id: id.toNumber(),
        text: marketText,
        volume: marketVolume,
        fee: marketInfo[7].toNumber(),
        author: marketInfo[0].toNumber(),
        status: 'open',
        priceHistory: marketHistory,
        lastPrice: lastPrice,
        comments: marketComments,
        branchId: branchId,
        sharesHeld: marketShares
      };
    });

    var markets = _.indexBy(marketList, 'id');
    this.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {markets: markets});
  }
};

module.exports = MarketActions;
