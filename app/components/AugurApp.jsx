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

var UAParser = require('ua-parser-js');
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

  mixins: [FluxMixin, StoreWatchMixin('branch', 'asset', 'network', 'config', 'report')],

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
      this.setState({status: 'running'});
    }

    return {
      network: flux.store('network').getState(),
      branch: flux.store('branch').getState(),
      asset: flux.store('asset').getState(),
      market: flux.store('market').getState(),
      config: flux.store('config').getState(),
      report: flux.store('report').getState()
    }
  },

  componentDidMount: function() {

    // Initialize the EthereumClient and load the current Augur data.
    this.getFlux().actions.config.initializeState();
  },

  getLoadingProgress: function() {

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

  render: function() {

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
              <Assets asset={ this.state.asset } />
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

        <ErrorModal network={ this.state.network } config={ this.state.config } asset={ this.state.asset } />

      </div>
    );
  }
});

// modal prompt for loading exceptions
var ErrorModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {

    var ua = new UAParser(navigator.userAgent);
    var os = ua.getOS().name;
    var host = window.location.origin;

    var steps = []
    if (os === 'Mac OS') {
      steps.push(<li><a target="_new" href="http://brew.sh/">Install Homebrew</a> for Mac OS</li>);
      steps.push(<li><pre>brew tap ethereum/ethereum</pre><pre>brew install ethereum --devel</pre></li>);
    } else if (os = 'Windows') {
      steps.push(<li>
        Download the <a href="https://build.ethdev.com/builds/Windows%20Go%20develop%20branch/Geth-Win64-latest.zip">lastest geth build</a> for Windows
      </li>);
    } else if (os = 'Ubuntu') {
      steps.push(<li><pre>sudo add-apt-repository ppa:ethereum/ethereum</pre><pre>sudo apt-get update</pre><pre>sudo apt-get install ethereum</pre></li>);
    } else {
      steps.push(<li>
        Follow the Ethereum <a href="https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum">install guide</a> on github
      </li>);
    }
    steps.push(<li>Add a new account using <pre>geth account new</pre></li>);
    steps.push(<li>Start geth with <pre>geth --rpc --rpccorsdomain { host } --unlock 0</pre>and enter your password.</li>);
    steps.push(<li><a href="{ host }">{ host }</a></li>);

    return {
      isModalOpen: false,
      isLoading: false,
      installHelpIsOpen: false,
      installHelpSteps: _.map(steps),
      startSecondsBehind: null,
      progressBar: (<ProgressBar striped active now={ 100 } className='loading-blocks-progress' />),
      message: (<p>The Ethereum block chain is not current.  Looking for peers.</p>)
    }
  },

  componentWillReceiveProps: function(nextProps) {

    if (nextProps.network.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED ||
    nextProps.config.ethereumClientFailed === true) {

      // only open if we're not on the demo host
      if (nextProps.config.host !== constants.DEMO_HOST) this.setState({ isModalOpen: true });

    } else if (nextProps.network.blockChainAge > constants.MAX_BLOCKCHAIN_AGE) {
      
      if (!this.state.isLoading) {
        utilities.warn('blockchain ' + nextProps.network.blockChainAge + ' seconds behind');
        this.setState({ isModalOpen: true, isLoading: true, startSecondsBehind: nextProps.network.blockChainAge});
      }

      var percentCaughtUp = ((this.state.startSecondsBehind - this.props.network.blockChainAge) / this.state.startSecondsBehind) * 100;
      if (percentCaughtUp > 0) {
        this.setState({progressBar: (<ProgressBar now={ parseFloat(percentCaughtUp) } className='loading-blocks-progress' />) });
      }

      if (this.props.network.peerCount) {
        var plural = this.props.network.peerCount === 1 ? '' : 's';
        this.setState({ message: (<p>The Ethereum block chain is not current and is fetching blocks from <b>{ this.props.network.peerCount }</b> peer{ plural }</p>) });
      }

    } else {

      this.setState({ isModalOpen: false, isLoading: false });
    }
  },

  handleToggle: function() {

    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  handleDismiss: function() {

    cookie.save('noEtherDismissed', true);
    this.handleToggle();
  },

  showInstallHelp: function(event) {

    this.setState({ installHelpIsOpen: true });
  },

  startHostedMode: function(event) {

    this.handleToggle();
    this.getFlux().actions.config.updateEthereumClient(constants.DEMO_HOST);
  },

  useExpMarketCache: function(event) {

    if (event.target.checked) {
      this.getFlux().actions.config.useMarketCache(true);
    } else {
      this.getFlux().actions.config.useMarketCache(false);
    }
  },

  render: function() {

    if (!this.state.isModalOpen) return <span />;

    if (this.props.config.ethereumClientFailed) {

      // augur client failed to load
      return (
        <Modal {...this.props} bsSize='small' show={ this.state.isModalOpen } onHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
              <h4>Augur failed to load</h4>
              <p>There was a problem loading Augur</p>
              <p>Visit our help page for assitance contact us directly</p>
              <p style={{display: 'none'}}><a className="pull-right start-demo-mode" onClick={ this.startDemoMode } href="javascript:void(0)">Proceed in demo mode</a></p>
          </div>
        </Modal>
      );

    } else if (this.props.network.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED) {

      var installHelp = <span />;
      if (this.state.installHelpIsOpen) {
        installHelp = (
          <div className="installation-help">
            <h4>Installing and configuring Ethereum</h4>
            <ol>
              { this.state.installHelpSteps }      
            </ol>
          </div>
        );
      }

      // no ethereum client detected
      return (
        <Modal {...this.props} id="no-eth-modal" show={ this.state.isModalOpen } onHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
            <h3>Ethereum not found</h3>
            <p>Augur is a decentralized application that runs on the Ethereum network.  It requires an Ethereum node to be running and current.  Augur could not find a local node which probably means it's not installed, running or is misconfigured.</p>
            <p>Get help <a onClick={ this.showInstallHelp } href="javascript:void(0)">installing and configuring an Ethereum client node</a></p>
            <a onClick={ this.startHostedMode } className="btn btn-primary pull-right" href="javascript:void(0)">Use Hosted Nodes</a>
            <Input onClick={ this.useExpMarketCache } className="use-market-cache" type="checkbox" label="Use experimental market cache" />
            { installHelp }
          </div>
        </Modal>
      );

    } else if (this.state.isLoading) {

      // augur client is loading
      return <span />;
    }
  }
});

module.exports = AugurApp;
