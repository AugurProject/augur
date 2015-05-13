var _ = require('lodash');
var constants = require('../libs/constants');

var BranchActions = {

  loadBranches: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var account = this.flux.store('network').getAccount();

    var ethereumClient = configState.ethereumClient;
    var currentBranch = branchState.currentBranch;

    var branches = ethereumClient.getBranches();

    this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches});

    // If the current branch is no longer in the set of branches, update the
    // current branch to one that exists.
    var currentBranchExists = _.some(branches, function (branch) {
      return branch === currentBranch;
    });
    if (!currentBranchExists && branches.length) {
      this.flux.actions.branch.updateCurrentBranch(branches[0]);
    }
  },

  updateCurrentBranch: function (id) {

    // keep branch at current branch if none was passed
    if (!id && this.flux.store('branch').getState().currentBranch) {
      id = this.flux.store('branch').getState().currentBranch.id;
    } else {
      return;
    }

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var votePeriod = ethereumClient.getVotePeriod(id);
    //var currentQuorum = ethereumClient.checkQuorum(id);

    var currentBranch = {
      id: id,
      currentPeriod: currentBlock / votePeriod[1],
      periodLength: votePeriod[1],
      votePeriod: votePeriod[0]
    }

    this.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, {
      currentBranch: currentBranch,
    });
  },

  updateBallotEvents: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    //var currentVotePeriod = this.flux.store('branch').getState().currentVotePeriod;
    //var ballotEvents = ethereumClient.getBallotEvents(currentVotePeriod);

    // HACK: pulling events from markets
    var events = [];
    var markets = this.flux.store('market').getState().markets;
    _.each(markets, function(market) {
      _.each(market.events, function(eventId) {
        var event = ethereumClient.getEvent(eventId);
        event.id = eventId;
        event.marketId = market.id;
        events.push(event)
      })
    });
    ////

    var ballotEvents = _.indexBy(events, 'id');

    this.dispatch(constants.branch.UPDATE_BALLOT_EVENTS_SUCCESS, {
      ballotEvents: ballotEvents || {}
    });
  },
};

module.exports = BranchActions;
