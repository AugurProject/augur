var React = require("react");
var _ = require("lodash");
var abi = require("augur-abi");
var keys = require("keythereum");
let Navigation = require("react-router/lib/Navigation");
let Link = require("react-router/lib/components/Link");

let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Table = require('react-bootstrap/lib/Table');
let ListGroup = require('react-bootstrap/lib/ListGroup');
let ListGroupItem = require('react-bootstrap/lib/ListGroupItem');

var utilities = require("../libs/utilities");
var constants = require("../libs/constants");

var ImportAccountModal = require("./ImportAccount");
var CloseMarketModal = require("./CloseMarket").CloseMarketModal;
let MarketRow = require("./markets-page/MarketRow");
var Branch = require("./Branch");

var Overview = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('market', 'config', 'branch'),
    Navigation
  ],

  getInitialState: function () {
    return {
      importAccountModalOpen: false,
      importKeystore: null
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('config').getAccount();
    var currentBranch = flux.store('branch').getCurrentBranch();
    return {
      account: account,
      privateKey: flux.store('config').getPrivateKey(),
      asset: flux.store('asset').getState(),
      config: flux.store('config').getState(),
      trendingMarkets: flux.store('market').getTrendingMarkets(9, currentBranch),
      authoredMarkets: flux.store('market').getAuthoredMarkets(),
      reportPeriod: flux.store('branch').getState().currentVotePeriod,
      currentBranch: currentBranch,
      holdings: flux.store('market').getMarketsHeld()
    }
  },

  toggleImportAccountModal: function (event) {
    this.setState({importAccountModalOpen: !this.state.importAccountModalOpen});
  },

  importAccount: function (event) {
    var self = this;
    if (event.target && event.target.files && event.target.files.length) {
      var keystoreFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (function (f) {
        return function (e) {
          try {
            var keystore = JSON.parse(e.target.result);
            self.setState({importKeystore: keystore});
            self.toggleImportAccountModal();
          } catch (exc) {
            console.error("Overview.importAccount: couldn't parse account file:", exc);
          }
        };
      })(keystoreFile);
      reader.readAsText(keystoreFile);
    }
  },

  render: function () {
    var importAccountButton = (
      <div className="col-sm-3">
        <label
          htmlFor="importAccountId"
          className="send-button btn-info btn btn-default">
          Import Account
        </label>
        <input
          id="importAccountId"
          type="file"
          onChange={this.importAccount} />
      </div>
    );
    var trendingMarketsSection = <span />;
    if (this.state.trendingMarkets) {
      trendingMarketsSection = (
        <div>
          <h3>Trending Markets</h3>
          <div className='row'>
            <div className="col-xs-12">
                {_.map(this.state.trendingMarkets, market => {
                  return <MarketRow key={market.id} market={market} />;
                })}
            </div>
          </div>
        </div>
      );
    }
    if (!this.state.account) {
      return (
        <div id="overview">
          <div className="account-info">
            <h3>Account</h3>
            <div className="row">
              {importAccountButton}
            </div>
          </div>
          <div className='row'>
            <div className="col-xs-12">
              {trendingMarketsSection}
            </div>
          </div>
          <ImportAccountModal
            params={{keystore: this.state.importKeystore}}
            show={this.state.importAccountModalOpen}
            onHide={this.toggleImportAccountModal} />
        </div>
      );
    }

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
          className="send-button btn-success">
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
              className="send-button btn-success btn btn-default">
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
            <div className="col-sm-6">
              <span className="account">{this.state.account}</span>
            </div>
            {exportAccountButton}
            {importAccountButton}
          </div>
        </div>
      );
    }

    var holdingsSection = <span />
    if (holdings.length) {
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

    var authoredMarketsSection = <span />;
    if (!_.isEmpty(this.state.authoredMarkets)) {
      authoredMarketsSection = (
        <div>
          <h3>My Markets</h3>
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
            {trendingMarketsSection}
          </div>
        </div>
        <ImportAccountModal
          params={{keystore: this.state.importKeystore}}
          show={this.state.importAccountModalOpen}
          onHide={this.toggleImportAccountModal} />
      </div>
    );
  }
});

module.exports = Overview;
