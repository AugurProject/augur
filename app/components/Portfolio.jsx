let React = require("react");
let _ = require("lodash");
let Navigation = require("react-router/lib/Navigation");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let ListGroup = require('react-bootstrap/lib/ListGroup');
let ListGroupItem = require('react-bootstrap/lib/ListGroupItem');
let utilities = require("../libs/utilities");
let constants = require("../libs/constants");
let MarketRow = require("./markets-page/MarketRow");

let Overview = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('market', 'config', 'branch'),
    Navigation
  ],

  getStateFromFlux: function () {
    let flux = this.getFlux();
    let account = flux.store('config').getAccount();
    let currentBranch = flux.store('branch').getCurrentBranch();
    return {
      account: account,
      privateKey: flux.store('config').getPrivateKey(),
      asset: flux.store('asset').getState(),
      config: flux.store('config').getState(),
      currentBranch: currentBranch,
      holdings: flux.store('market').getMarketsHeld()
    };
  },

  render: function () {

    var account = this.state.account;
    var holdings;

    if (!this.props.isLoaded) {
        holdings = [<div key="loader" className="loader"></div>];
    }
    else {
      holdings = _
        .filter(this.state.holdings, market => {
          return market.outcomes.some((outcome) => outcome.sharesHeld && outcome.sharesHeld.toNumber() > 0);
        })
        .map(function (market) {
          return (
            <MarketRow
              key={market.id}
              market={market}
              contentType="holdings"
              account={account} />
          );
        });
    }


    return (
      <div id="overview">
        <div className='row'>
          <div className="col-xs-12">
            <div>
              <h1>Portfolio</h1>
              <ListGroup className='holdings'>
                { holdings }
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Overview;
