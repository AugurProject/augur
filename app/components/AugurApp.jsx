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

var UAParser = require('ua-parser-js');
var utilities = require('../libs/utilities');
var constants = require('../libs/constants');

var Period = require('./Period');
var Network = require('./Network');
var Alert = require('./Alert');
var Confirm = require('./Confirm');
var EtherWarningModal = require('./EtherWarningModal');

var AugurApp = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('branch', 'asset', 'network', 'config', 'report')],

  getInitialState: function () {
    return {
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

    this.setState({status: 'stopped'});
    //console.log('initializing');

    // Initialize the EthereumClient and load the current Augur data.
    this.getFlux().actions.config.initializeState();

    //console.log('initialized');
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

    return loadingProgress
  },

  render: function() {

    //console.log('rendering', this.state.status);

    var cashBalance = this.state.asset.cash ? +this.state.asset.cash.toFixed(2) : '-';

    return (
      <div id="app" className={ this.state.status }>

        <nav className="header" role="navigation">
          <div className="container">
            <div className="pull-left">
              <h1>augur<i>𝛂</i></h1>

              <ul className="menu">
                <li><p><Link to="overview">Overview</Link></p></li>
                <li><p><Link to="home">Markets</Link></p></li>
                <li><p><Link to="account">Account</Link></p></li>
                <li><p><Link to="ballots">Ballot</Link></p></li>
              </ul>
            </div>

            <div className="pull-right">
              <p className='navbar-text'>CASH: <b className="cash-balance">{ cashBalance }</b></p>
            </div>

          </div>
        </nav>

        <section id="main" className="container">
          <div className="dash page row">
            <div className="col-md-3 hidden-xs hidden-sm sidebar">
              <div className="side-nav">
                  <p><Link to="overview">Overview</Link></p>
                  <p><Link to="home">Markets</Link><i>{ _.keys(this.state.market.markets).length }</i></p>
                  <p><Link to="account">Account</Link></p>
                  <p><Link to="ballots">Ballot</Link><i>{ _.keys(this.state.report.eventsToReport).length }</i></p>
              </div>

              <Network />
            </div>

            <div className="col-sm-12 col-md-9">

              <div id="period"></div>

              <RouteHandler {...this.props} branch={ this.state.branch } market={ this.state.market } />

            </div>
          </div>

        </section>

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
    nextProps.network.ethereumStatus === constants.network.ETHEREUM_STATUS_NO_ACCOUNT ||
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

  startDemoMode: function(event) {

    this.handleToggle();
    this.getFlux().actions.config.updateEthereumClient(constants.DEMO_HOST);
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

    } else if (this.props.network.ethereumStatus === constants.network.ETHEREUM_STATUS_NO_ACCOUNT) {
      // no etherbase is set
      return (
        <Modal show={ this.state.isModalOpen } onHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
            <h3>Ethereum Account not found</h3>
            <p>Augur requires you to set a primary account in your Ethereum client.  Please confirm that you have added this to your geth command line: <pre>--etherbase "0x0123-your-address-here-feebdaed"</pre></p>
            <p>or <a onClick={ this.startDemoMode } href="javascript:void(0)">proceed in demo mode</a></p>
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
            <p>Augur requires an Ethereum client to be running and current.  Augur could not detect a client running which probably means it's not installed, running or is misconfigured.</p>
            <p>Get help <a onClick={ this.showInstallHelp } href="javascript:void(0)">installing and configuring Ethereum</a></p>
            <p>or <a onClick={ this.startDemoMode } href="javascript:void(0)">proceed in demo mode</a></p>
            { installHelp }
          </div>
        </Modal>
      );

    } else if (this.state.isLoading) {

      // augur client is loading
      return (
        <Modal {...this.props} bsSize='small' show={ this.state.isModalOpen } onHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
              <h4>Ethereum loading</h4>
              { this.state.message }
              { this.state.progressBar }
          </div>
        </Modal>
      );
    }
  }
});

module.exports = AugurApp;
