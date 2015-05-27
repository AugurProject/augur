// setting these to the window object for debugging and console access
window.BigNumber = require('bignumber.js');
window.$ = require('jquery');
window._ = require('lodash');

// add jQuery to Browserify's global object so plugins attach correctly.
global.jQuery = $;
require('jquery.cookie');
require('bootstrap');

var React = require('react');
var Fluxxor = require('fluxxor');

var Router = require("react-router");
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

var constants = require('./libs/constants');
var utilities = require('./libs/utilities');

var AssetActions = require('./actions/AssetActions');
var BranchActions = require('./actions/BranchActions');
var ConfigActions = require('./actions/ConfigActions');
var EventActions = require('./actions/EventActions');
var MarketActions = require('./actions/MarketActions');
var NetworkActions = require('./actions/NetworkActions');
var ReportActions = require('./actions/ReportActions');

var actions = {
  asset: AssetActions,
  branch: BranchActions,
  config: ConfigActions,
  event: EventActions,
  market: MarketActions,
  network: NetworkActions,
  report: ReportActions
}

var AssetStore = require('./stores/AssetStore');
var BranchStore = require('./stores/BranchStore');
var ConfigStore = require('./stores/ConfigStore');
var EventStore = require('./stores/EventStore');
var LogStore = require('./stores/LogStore');
var MarketStore = require('./stores/MarketStore');
var NetworkStore = require('./stores/NetworkStore');
var ReportStore = require('./stores/ReportStore');

var stores = {
  asset: new AssetStore(),
  branch: new BranchStore(),
  config: new ConfigStore(),
  event: new EventStore(),
  market: new MarketStore(),
  network: new NetworkStore(),
  report: new ReportStore()
}

var AugurApp = require("./components/AugurApp");
var Branch = require('./components/Branch');
var Market = require('./components/Market');
var AccountDetails = require('./components/AccountDetails');
var Ballots = require('./components/Ballots');
var Outcomes = require('./components/Outcomes');

window.flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
  var debug = flux.store('config').getState().debug;
  if (debug) console.log("Dispatched", type, payload);
});

var routes = (
  <Route name="app" handler={ AugurApp } flux={ flux }>
    <DefaultRoute handler={ Branch } flux={ flux } title="Branch" />
    <Route name="home" path="/" handler={ Branch } flux={ flux } title="Branch" />
    <Route name="branch" path="/branches/:branchId" handler={ Branch } flux={ flux } title="Branch" />
    <Route name="market" path="/market/:marketId" handler={ Market } flux={ flux } />
    <Route name="account" path="/account" handler={ AccountDetails } flux={ flux } title="Account Overview" />
    <Route name="ballots" path="/ballots" handler={ Ballots } flux={ flux } title="Ballots" />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler flux={ flux } params={ state.params } />, document.body);
});
