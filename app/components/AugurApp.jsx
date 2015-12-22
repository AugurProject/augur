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
      // accountStatus = (
      //   <p className='navbar-text'>
      //     <span className="account">{ this.state.config.currentAccount }</span> | 
      //     <a className="signout" onClick={ this.handleSignOut }>sign out</a>
      //   </p>
      // );
        // <div className="panel panel-info assets">
        //   <div className="account">{ this.state.config.currentAccount }</div>
        // </div>
        // <li><p>{ this.state.config.currentAccount }</p></li>
        // <Assets asset={ this.state.asset } config={ this.state.config } />

        // <div className="col-sm-4">
        //     <a className="signout pull-right" onClick={ this.handleSignOut }><p>sign out</p></a>
        //     </ul>
        //   </div>

      var cashBalance = this.state.asset.cash ? this.state.asset.cash.toFixed(2) : '-';
      var repBalance = this.state.asset.reputation ? this.state.asset.reputation.toFixed(2) : '-';
      var etherBalance = this.state.asset.ether ? utilities.formatEther(this.state.asset.ether).value : '-';

      accountStatus = (
        <div className="col-sm-12 pull-right">
          <div className="panel-body">
            <div className="col-sm-6">
              <div className="col-sm-3">
                <span className="fa-stack fa-xs">
                  <i className="fa fa-circle fa-stack-2x icon-background2"></i>
                  <i className="fa fa-circle-thin fa-stack-2x icon-background3"></i>
                  <i className="fa fa-btc fa-stack-1x"></i>
                </span>
              </div>
              <div className="col-sm-3">
                <span className='balance'>{ cashBalance }</span>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="col-sm-3">
                <span className="fa-stack fa-xs">
                  <i className="fa fa-circle fa-stack-2x icon-background1"></i>
                  <i className="fa fa-circle-thin fa-stack-2x icon-background6"></i>
                  <i className="fa fa-heart fa-stack-1x"></i>
                </span>
              </div>
              <div className="col-sm-3">
                <span className='balance'>{ repBalance }</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
       accountStatus = (
        <ul className="menu">
          <li><p><a className="signin" onClick={ this.toggleSignInModal }>sign in</a></p></li>
          <li><p><a className="register" onClick={ this.toggleRegisterModal }>register</a></p></li>
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
                <Link to="overview"><li><p>Overview</p></li></Link>
                <Link to="markets"><li><p>Markets<span className="population">{ _.keys(this.state.market.markets).length }</span></p></li></Link>
                <Link to="ballots"><li><p>Ballot<span className="population">{ _.keys(this.state.report.eventsToReport).length }</span></p></li></Link>
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
                <ul>
                  <Link to="overview"><li className="nav-item">Overview</li></Link>
                  <Link to="markets"><li className="nav-item">Markets<span className="population">{ _.keys(this.state.market.markets).length }</span></li></Link>
                  <Link to="ballots"><li className="nav-item">Ballot<span className="population">{ _.keys(this.state.report.eventsToReport).length }</span></li></Link>
                </ul>
              </div>
              <Network />
            </div>

            <div className="col-sm-12">

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
