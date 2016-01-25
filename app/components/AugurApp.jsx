var React = require("react");
var _ = require("lodash");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Route = Router.Route;
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
var Assets = require("./Assets");
var SignInModal = require("./SignIn");
var RegisterModal = require("./Register");
var SendCashModal = require("./SendModal").SendCashModal;
var SendRepModal = require("./SendModal").SendRepModal;
var SendEtherModal = require("./SendModal").SendEtherModal;
let Header = require("./layout/Header.jsx");


var AugurApp = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('branch', 'asset', 'network', 'config', 'report', 'market', 'search')
  ],

  getInitialState: function () {
    return {
      signInModalOpen: false,
      registerModalOpen: false,
      repFaucetDisabled: false,
      sendCashModalOpen: false,
      sendRepModalOpen: false,
      sendEtherModalOpen: false,
      status: 'stopped'
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var percentLoaded = flux.store('config').getState().percentLoaded;

    // set app status (stopped, loading, running) from network & config state
    if (parseInt(percentLoaded) === 100) {
      this.setState({ status: 'running' });
    }

    return {
      network: flux.store('network').getState(),
      branch: flux.store('branch').getState(),
      asset: flux.store('asset').getState(),
      market: flux.store('market').getState(),
      search: flux.store('search').getState(),
      config: flux.store('config').getState(),
      report: flux.store('report').getState()
    }
  },

  componentDidMount: function () {
    this.getFlux().actions.config.connect();
  },

  getLoadingProgress: function () {
    var loadingProgress = <span/>;
    if (this.state.config.percentLoaded) {
      loadingProgress = (
        <ProgressBar now={ parseFloat(this.state.config.percentLoaded) } className='loading-progress' />
      );
    } else if (this.state.network.blockchainAge && this.state.network.blockchainAge < constants.MAX_BLOCKCHAIN_AGE) {
      loadingProgress = (<span className="loading-text">loading...</span>);
    }
    return loadingProgress;
  },

  toggleSignInModal: function () {
    this.setState({signInModalOpen: !this.state.signInModalOpen});
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

  toggleSendEtherModal: function() {
     this.setState({sendEtherModalOpen: !this.state.sendEtherModalOpen});
  },

  render: function () {
    return (
      <div id="app" className={ this.state.status }>
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
            marketsCount={_.keys(this.state.market.markets).length}
            ballotsCount={_.keys(this.state.report.eventsToReport).length}
            toggleRegisterModal={this.toggleRegisterModal}
            toggleSignInModal={this.toggleSignInModal}
            toggleSendCashModal={this.toggleSendCashModal}
            toggleSendRepModal={this.toggleSendRepModal}
            toggleSendEtherModal={this.toggleSendEtherModal}
            asset={this.state.asset}
            />

        <section id="main" className="container">
          <div className="dash page row">
            <div className="col-sm-12">
              <div id="period"></div>
              <RouteHandler
                toggleSignInModal={this.toggleSignInModal}
                {...this.props}
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
        
        <footer><div className="row container clearfix"></div></footer>
        
        <section id="loading" className="container">
          <div className="logo">
            {this.getLoadingProgress()}
          </div>
        </section>
      </div>
    );
  }
});

module.exports = AugurApp;
