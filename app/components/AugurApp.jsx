var React = require("react");
var _ = require("lodash");
var Fluxxor = require("fluxxor");
var ReactBootstrap = require("react-bootstrap");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Route = Router.Route;
var cookie = require("react-cookie");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;
var ProgressBar = ReactBootstrap.ProgressBar;
var Modal = ReactBootstrap.Modal;
var Input = ReactBootstrap.Input;

var utilities = require("../libs/utilities");
var constants = require("../libs/constants");
var Assets = require("./Assets");
var SignInModal = require("./SignIn");
var RegisterModal = require("./Register");
var SendCashModal = require("./SendModal").SendCashModal;
var SendRepModal = require("./SendModal").SendRepModal;
var SendEtherModal = require("./SendModal").SendEtherModal;


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
    this.getFlux().actions.config.connect(process.env.AUGUR_HOST);
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

  handleSignOut: function (event) {
    this.getFlux().actions.config.signOut();
  },

  toggleSignInModal: function (event) {
    this.setState({signInModalOpen: !this.state.signInModalOpen});
  },

  toggleRegisterModal: function (event) {
    this.setState({registerModalOpen: !this.state.registerModalOpen});
  },
  
  toggleSendCashModal: function(event) {
    this.setState({sendCashModalOpen: !this.state.sendCashModalOpen});
  },

  toggleSendRepModal: function(event) {
     this.setState({sendRepModalOpen: !this.state.sendRepModalOpen});
  },

  toggleSendEtherModal: function(event) {
     this.setState({sendEtherModalOpen: !this.state.sendEtherModalOpen});
  },

  render: function () {
    var accountStatus, ballots, signoutButton;

    ballots = <span />;
    signoutButton = <span />;

    if (this.state.config.currentAccount) {

      var cashBalance = this.state.asset.cash ? this.state.asset.cash.toFixed(2) : '-';
      var repBalance = this.state.asset.reputation ? this.state.asset.reputation.toFixed(2) : '-';
      var etherBalance = this.state.asset.ether ? utilities.formatEther(this.state.asset.ether).value : '-';

      accountStatus = (
        <div className="asset-panel panel-body">
          <ul className="menu">
            <li className="pointer" onClick={this.toggleSendCashModal}>
              <span className="fa-stack fa-xs">
                <i className="fa fa-circle fa-stack-2x icon-background2"></i>
                <i className="fa fa-circle-thin fa-stack-2x icon-background3"></i>
                <i className="fa fa-stack-1x fa-usd icon-green"></i>
              </span>
              <span className='balance-wrapper balance'> {cashBalance}</span>
            </li>
          </ul>

          <ul className="menu">
            <li className="pointer" onClick={this.toggleSendRepModal}>
              <span className="fa-stack fa-xs">
                <i className="fa fa-circle fa-stack-2x icon-background1"></i>
                <i className="fa fa-circle-thin fa-stack-2x icon-background6"></i>
                <i className="fa fa-heart fa-stack-1x icon-red"></i>
              </span>
              <span className='balance-wrapper balance'> {repBalance}</span>
            </li>
          </ul>

          <ul className="menu">
            <li className="pointer" onClick={this.toggleSendEtherModal}>
              <span className="fa-stack fa-xs">
                <i className="fa fa-circle fa-stack-2x icon-background2"></i>
                <i className="fa fa-circle-thin fa-stack-2x icon-background4"></i>
                <i className="fa fa-stack-1x icon-blue">Ξ</i>
              </span>
              <span className='balance-wrapper balance'> {etherBalance}</span>
            </li>
          </ul>

          <SendEtherModal
            show={this.state.sendEtherModalOpen}
            onHide={this.toggleSendEtherModal} />
          <SendRepModal
            show={this.state.sendRepModalOpen}
            onHide={this.toggleSendRepModal} />
          <SendCashModal
            show={this.state.sendCashModalOpen}
            onHide={this.toggleSendCashModal} />
        </div>
      );
      ballots = (
        <Link to="ballots"><li>
          <p>Ballot<span className="population">{_.keys(this.state.report.eventsToReport).length}</span></p>
        </li></Link>
      );
      signoutButton = (
        <a className="signout" onClick={this.handleSignOut}><li>
          <p>sign out</p>
        </li></a>
      );
    } else {
       accountStatus = (
        <ul className="menu">
          <li><p><a className="signin" onClick={this.toggleSignInModal}>sign in</a></p></li>
          <li><p><a className="register" onClick={this.toggleRegisterModal}>register</a></p></li>
        </ul>
      );     
    }
    return (
      <div id="app" className={ this.state.status }>

        <nav className="header" role="navigation">
          <div className="container">
            <div className="pull-left">
              <h1 className="title">augur</h1>
              <ul className="menu">
                <Link to="overview"><li>
                  <p>Overview</p>
                </li></Link>
                <Link to="markets"><li>
                  <p>Markets<span className="population">{_.keys(this.state.market.markets).length}</span></p>
                </li></Link>
                {ballots}
                {signoutButton}
              </ul>
            </div>
            <div className="pull-right">
              {accountStatus}
            </div>
          </div>
        </nav>
        
        <section id="main" className="container">
          <div className="dash page row">
            <div className="col-sm-12">
              <div id="period"></div>
              <RouteHandler {...this.props}
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
