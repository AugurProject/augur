let React = require("react");
let _ = require("lodash");
let abi = require("augur-abi");
let keys = require("keythereum");
let Navigation = require("react-router/lib/Navigation");
let Link = require("react-router/lib/components/Link");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Table = require('react-bootstrap/lib/Table');
let ListGroup = require('react-bootstrap/lib/ListGroup');
let ListGroupItem = require('react-bootstrap/lib/ListGroupItem');
let utilities = require("../libs/utilities");
let constants = require("../libs/constants");
let AddMarketModal = require("./AddMarketModal");
let CloseMarketModal = require("./CloseMarket").CloseMarketModal;
let MarketRow = require("./markets-page/MarketRow");

let Overview = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('market', 'config', 'branch'),
    Navigation
  ],

  getInitialState: function () {
    return {addMarketModalOpen: false};
  },

  getStateFromFlux: function () {
    let flux = this.getFlux();
    let account = flux.store('config').getAccount();
    let currentBranch = flux.store('branch').getCurrentBranch();
    return {
      account: account,
      privateKey: flux.store('config').getPrivateKey(),
      asset: flux.store('asset').getState(),
      config: flux.store('config').getState(),
      authoredMarkets: flux.store('market').getAuthoredMarkets(),
      reportPeriod: flux.store('branch').getState().currentVotePeriod,
      currentBranch: currentBranch,
      holdings: flux.store('market').getMarketsHeld()
    }
  },

  toggleAddMarketModal: function (event) {
    this.setState({addMarketModalOpen: !this.state.addMarketModalOpen});
  },

  render: function () {

    var cashBalance = this.state.asset.cash ? +this.state.asset.cash.toFixed(2) : '-';
    var repBalance = this.state.asset.reputation ? +this.state.asset.reputation.toFixed(2) : 0;

    var holdings = _
      .filter(this.state.holdings, market => {
        return market.outcomes.some((outcome) => outcome.sharesHeld && outcome.sharesHeld.toNumber() > 0);
      })
      .map(function (market) {
        return <MarketRow key={market.id} market={market} contentType="holdings"/>;
      });

    var exportAccountButton = (
      <div className="col-sm-3">
        <Button
          disabled
          className="send-button btn btn-default">
          Export Account
        </Button>
      </div>
    );
    if (this.state.privateKey) {
      var keystore = this.getFlux().augur.web.exportKey();
      if (keystore) {
        var accountFilename = "UTC--" + new Date().toISOString() + "--" + keystore.address;
        var accountUrl = URL.createObjectURL(new Blob([
          JSON.stringify(keystore)
        ], {type: "application/json"}));
        exportAccountButton = (
          <div className="col-sm-3">
            <a
              download={accountFilename}
              href={accountUrl}
              className="send-button btn-default btn">
              Export Account
            </a>
          </div>
        );
      }
    }

    var accountSection = <span />
    if (this.state.account) {
      accountSection = (
        <div className="account-info">
          <h3>Account</h3>
          <div className="row">
            <div className="col-sm-9">
              <span className="account">{this.state.account}</span>
            </div>
            {exportAccountButton}
          </div>
        </div>
      );
    }

    var holdingsSection = <span />
    if (this.state.account && holdings.length) {
      holdingsSection = (
        <div>
          <h3>Current Holdings</h3>
          <ListGroup className='holdings'>
            { holdings }
          </ListGroup>
        </div>
      );
    }

    var cashFaucetDisabled = this.state.cashFaucetDisabled ? true : false;
    var repFaucetDisabled = this.state.repFaucetDisabled ? true : false;

    var submitMarketAction;
    if (this.state.account) {
        submitMarketAction = (
            <Button
              className="pull-right btn-primary"
              onClick={this.toggleAddMarketModal}>
              New Market
            </Button>
        );
    } else {
        submitMarketAction = <span />;
    }

    var authoredMarketsSection = <span />;
    if (!_.isEmpty(this.state.authoredMarkets)) {
      authoredMarketsSection = (
        <div>
          <h3>
            <i>My Markets</i>
            {submitMarketAction}
          </h3>
          <div className='row'>
            <div className="col-xs-12">
                {_.map(this.state.authoredMarkets, market => {
                  return <MarketRow key={market.id} market={market} />;
                })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="overview">
        <div className='row'>
          <div className="col-xs-12">
            {accountSection}
            {authoredMarketsSection}
            {holdingsSection}
          </div>
        </div>
        <AddMarketModal
          show={this.state.addMarketModalOpen}
          onHide={this.toggleAddMarketModal} />
      </div>
    );
  }
});

module.exports = Overview;
