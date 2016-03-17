var React = require("react");
var _ = require("lodash");
var RouteHandler = require("react-router/lib/components/RouteHandler");
var cookie = require("react-cookie");

let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");

let OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
let Popover = require('react-bootstrap/lib/Popover');
let ProgressBar = require('react-bootstrap/lib/ProgressBar');
let Modal = require('react-bootstrap/lib/Modal');
let Input = require('react-bootstrap/lib/Input');

var utilities = require("../libs/utilities");
var constants = require("../libs/constants");
var SignInModal = require("./SignIn");
var RegisterModal = require("./Register");
var SendCashModal = require("./SendModal").SendCashModal;
var SendRepModal = require("./SendModal").SendRepModal;
var SendEtherModal = require("./SendModal").SendEtherModal;
let Header = require("./layout/Header.jsx");


var AugurApp = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin("branch", "asset", "network", "config", "report", "market", "search")
  ],

  getInitialState: function () {
    return {
      signInModalOpen: false,
      registerModalOpen: false,
      repFaucetDisabled: false,
      sendCashModalOpen: false,
      sendRepModalOpen: false,
      reportSavedModalOpen: false,
      reportConfirmedModalOpen: false,
      confirmNewMarketModalOpen: false,
      status: "stopped"
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var percentLoaded = flux.store("config").getState().percentLoaded;

    // set app status (stopped, loading, running) from network & config state
    if (Number(percentLoaded) > 0) {
      this.setState({status: "running"});
    }

    return {
      network: flux.store("network").getState(),
      branch: flux.store("branch").getState(),
      asset: flux.store("asset").getState(),
      market: flux.store("market").getState(),
      search: flux.store("search").getState(),
      config: flux.store("config").getState(),
      report: flux.store("report").getState()
    };
  },

  componentDidMount: function () {
    this.getFlux().actions.config.connect();
  },

  toggleSignInModal: function () {
    this.setState({signInModalOpen: !this.state.signInModalOpen});
  },

  toggleConfirmNewMarketModal: function () {
    this.setState({confirmNewMarketModalOpen: !this.state.confirmNewMarketModalOpen});
  },

  toggleRegisterModal: function () {
    this.setState({registerModalOpen: !this.state.registerModalOpen});
  },

  toggleSendCashModal: function() {
    this.setState({sendCashModalOpen: !this.state.sendCashModalOpen});
  },

  toggleSendRepModal: function() {
     this.setState({sendRepModalOpen: !this.state.sendRepModalOpen});
  },
  toggleReportSavedModal: function() {
     this.setState({reportSavedModalOpen: !this.state.reportSavedModalOpen});
  },

  toggleSendEtherModal: function() {
    this.setState({sendEtherModalOpen: !this.state.sendEtherModalOpen});
  },

  render: function () {
    return (
      <div id="app">
        <SendEtherModal
          show={this.state.sendEtherModalOpen}
          onHide={this.toggleSendEtherModal} />
        <SendRepModal
            show={this.state.sendRepModalOpen}
            onHide={this.toggleSendRepModal} />
        <SendCashModal
            show={this.state.sendCashModalOpen}
            onHide={this.toggleSendCashModal} />
        <Header
            userAccount={this.state.config.currentAccount}
            isNewRegistration={this.state.config.isNewRegistration}
            marketsCount={_.keys(this.state.market.markets).length}
            ballotsCount={_.keys(this.state.report.eventsToReport).length}
            toggleRegisterModal={this.toggleRegisterModal}
            toggleSignInModal={this.toggleSignInModal}
            toggleSendCashModal={this.toggleSendCashModal}
            toggleSendRepModal={this.toggleSendRepModal}
            toggleSendEtherModal={this.toggleSendEtherModal}
            asset={this.state.asset} />
        <section id="main" className="container">
          <div className="dash page row">
            <div className="col-sm-12">
              <div id="period"></div>
              <RouteHandler
                toggleConfirmNewMarketModal={this.toggleConfirmNewMarketModal}
                confirmNewMarketModalOpen={this.state.confirmNewMarketModalOpen}
                toggleSignInModal={this.toggleSignInModal}
                toggleReportSavedModal={this.toggleReportSavedModal}
                reportSavedModalOpen={this.state.reportSavedModalOpen}
                reportConfirmedModalOpen={this.state.reportConfirmedModalOpen}
                {...this.props}
                isSiteLoaded={ this.state.status === 'running' }
                branch={this.state.branch}
                market={this.state.market} />
            </div>
          </div>
        </section>

        <RegisterModal
          show={this.state.registerModalOpen}
          onHide={this.toggleRegisterModal} />
        <SignInModal
          show={this.state.signInModalOpen}
          onHide={this.toggleSignInModal} />

        <footer>
          <div className="row clearfix footer-tos">
            <div className="col-sm-12">
              <div className="pull-right">
                <span><a href="https://www.hamsterpad.com/chat/dyffy">Slack</a> | </span>
                <span><a href="http://docs.augur.net">Documentation</a> | </span>
                <span><a href="http://blog.augur.net">Blog</a> | </span>
                <span><a href="http://augur.strikingly.com">About</a> | </span>
                <span><a href="https://github.com/AugurProject">Github</a> | </span>
                <span><a href="https://sale.augur.net">REP Login</a> | </span>
                <span><a href="http://augur.zendesk.com/">FAQ</a> | </span>
                <span><a href="http://augur.link/augur-beta-ToS-v2.pdf">Terms of Service</a></span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
});

module.exports = AugurApp;
