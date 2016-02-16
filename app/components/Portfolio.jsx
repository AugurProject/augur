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
    }
  },

  render: function () {

    var holdings = _
      .filter(this.state.holdings, market => {
        return market.outcomes.some((outcome) => outcome.sharesHeld && outcome.sharesHeld.toNumber() > 0);
      })
      .map(function (market) {
        return <MarketRow key={market.id} market={market} contentType="holdings" />;
      });

    var holdingsSection = <span />
    if (this.state.account && holdings.length) {
      holdingsSection = (
        <div>
          <h3>Portfolio</h3>
          <ListGroup className='holdings'>
            { holdings }
          </ListGroup>
        </div>
      );
    }

    return (
      <div id="overview">
        <div className='row'>
          <div className="col-xs-12">
            {holdingsSection}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Overview;
