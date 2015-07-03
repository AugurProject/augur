var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var constants = require('../libs/constants');

var Overview = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'branch', 'asset')],

  getInitialState: function() {

    return {

    };
  },

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var currentBranch = flux.store('branch').getCurrentBranch();

    return {
      markets: marketState.markets,
      currentBranch: currentBranch
    }
  },

  render: function () {

    return (<div />);
  }
});

module.exports = Overview;
