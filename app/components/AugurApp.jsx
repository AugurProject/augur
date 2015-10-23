var React = require("react");
var Fluxxor = require("fluxxor");

var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Route = Router.Route;
var cookie = require("react-cookie");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ReactBootstrap = require('react-bootstrap');
var ProgressBar = ReactBootstrap.ProgressBar;
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

var utilities = require('../libs/utilities');
var constants = require('../libs/constants');

var Period = require('./Period');
var Network = require('./Network');
var Assets = require('./Assets');
var Welcome = require('./Welcome');
var Confirm = require('./Confirm');

var SignInModal = require('./SignIn');
var RegisterModal = require('./Register');
var EtherWarningModal = require('./EtherWarningModal');

var AugurApp = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('branch', 'asset', 'network', 'config', 'report', 'market', 'search')],

  getInitialState: function () {
    return {
      signInModalOpen: false,
      registerModalOpen: false,
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
    } else if (this.state.network.blockChainAge && this.state.network.blockChainAge < constants.MAX_BLOCKCHAIN_AGE) {
      loadingProgress = (<span className="loading-text">loading...</span>);
    }
    return loadingProgress;
  },

  handleSignOut: function (event) {
    this.getFlux().actions.config.signOut();
  },

  toggleSignInModal: function (event) {
    this.setState({ signInModalOpen: !this.state.signInModalOpen });
  },

  toggleRegisterModal: function (event) {
    this.setState({ registerModalOpen: !this.state.registerModalOpen });
  },
  
  render: function () {
    var accountStatus;
    if (this.state.config.currentAccount) {
      accountStatus = (
        <p className='navbar-text'>
          <span className="account">{ this.state.config.currentAccount }</span> | 
          <a className="signout" onClick={ this.handleSignOut }>sign out</a>
        </p>
      );
    } else {
       accountStatus = (
        <div>
          <p className='navbar-text'>
            <a className="signin" onClick={ this.toggleSignInModal }>sign in</a> | 
          </p>
          <p className='navbar-text'>
            <a className="register" onClick={ this.toggleRegisterModal }>register</a>
          </p>
        </div>
      );     
    }
    return (
      <div id="app" className={ this.state.status }>

        <nav className="header" role="navigation">
          <div className="container">
            <div className="pull-left">
              <h1>augur<i>𝛂</i></h1>

              <ul className="menu">
                <li><p><Link to="overview">Overview</Link></p></li>
                <li><p><Link to="markets">Markets</Link></p></li>
                <li><p><Link to="ballots">Ballot</Link></p></li>
              </ul>
            </div>

            <div className="pull-right">
              { accountStatus }
            </div>

          </div>
        </nav>

        <section id="main" className="container">
          <div className="dash page row">
            <div className="col-md-3 hidden-xs hidden-sm sidebar">
              <div className="nav">
                  <p><Link to="overview">Overview</Link></p>
                  <p><Link to="markets">Markets</Link><i>{ _.keys(this.state.market.markets).length }</i></p>
                  <p><Link to="ballots">Ballot</Link><i>{ _.keys(this.state.report.eventsToReport).length }</i></p>
              </div>
              <Assets asset={ this.state.asset } config={ this.state.config } />
              <Network />
            </div>

            <div className="col-sm-12 col-md-9">

              <div id="period"></div>

              <RouteHandler {...this.props} branch={ this.state.branch } market={ this.state.market } />

            </div>
          </div>

        </section>

        <RegisterModal show={ this.state.registerModalOpen } onHide={ this.toggleRegisterModal } />
        <SignInModal show={ this.state.signInModalOpen } onHide={ this.toggleSignInModal } />

        <footer>
          <div className="row container clearfix"></div>
        </footer>

        <section id="loading" className="container">
          <div className="logo">
            { this.getLoadingProgress() }
          </div>
        </section>

      </div>
    );
  }
});

module.exports = AugurApp;
