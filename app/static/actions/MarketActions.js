var _ = require('lodash');

var constants = require('../constants');

var MarketActions = {
  loadMarkets: function () {
    var accountState = this.flux.store('account').getState();
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var networkState = this.flux.store('network').getState();

    var branchId = branchState.currentBranch;
    var contract = configState.contract;

    var marketList = _.map(contract.call().getMarkets(branchId), function (id) {
      
      var marketInfo = contract.call().getMarketInfo(id);
      var marketText = contract.call().getMarketDesc(id);
      var marketComments = contract.call().getMarketComments(id);
      var marketHistory = contract.call().getMarketHistory(id);
      var marketShares = contract.call().getMarketShares(id, accountState.account);

      return {
        id: id.toNumber(),
        text: marketText,
        volume: 0,
        fee: marketInfo[7].toNumber(),
        status: 'open',
        priceHistory: marketHistory,
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
