var React = require("react");
var Fluxxor = require("fluxxor");

var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Route = Router.Route;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ReactBootstrap = require('react-bootstrap');
var ProgressBar = ReactBootstrap.ProgressBar;
var OverlayMixin = require('react-bootstrap/lib/OverlayMixin');
var Modal = ReactBootstrap.Modal;

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

        <ErrorModal network={ this.state.network } config={ this.state.config } />

        <section id="loading" className="container">
          <div className="logo">
            { this.getLoadingProgress() }
          </div>
        </section>

      </div>
    );
  }
});

// modal prompt for loading exceptions
var ErrorModal = React.createClass({
  mixins: [FluxMixin, OverlayMixin],

  getInitialState: function () {

    return {
      isModalOpen: false,
      isLoading: false,
      startSecondsBehind: null
    }
  },

  componentWillReceiveProps: function(nextProps) {

    if (nextProps.network.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED ||
    nextProps.config.ethereumClientFailed === true) {

      // only open if we're not on the demo host
      if (nextProps.config.host !== constants.DEMO_HOST) this.setState({ isModalOpen: true });

    } else if (nextProps.network.blockChainAge > constants.MAX_BLOCKCHAIN_AGE) {

      if (!this.state.isLoading) {
        this.setState({ isModalOpen: true, isLoading: true, startSecondsBehind: nextProps.network.blockChainAge});
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

  startDemoMode: function (event) {

    this.handleToggle();
    this.getFlux().actions.config.updateEthereumClient(constants.DEMO_HOST);
  },

  render: function() {
    return <span />;
  },

  renderOverlay: function () {

    if (!this.state.isModalOpen) return <span />;

    if (this.props.config.ethereumClientFailed) {

      // augur client failed to load
      return (
        <Modal {...this.props} bsSize='small' onRequestHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
              <h4>Augur failed to load</h4>
              <p>There was a problem loading Augur</p>
              <p>Visit our help page for assitance contact us directly</p>
              <p style={{display: 'none'}}><a className="pull-right start-demo-mode" onClick={ this.startDemoMode } href="javascript:void(0)">Proceed in demo mode</a></p>
          </div>
        </Modal>
      );

    } else if (this.props.network.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED) {

      var host = window.location.origin;

      var demoMode = (
        <p className="start-demo-mode">
          Or <a onClick={ this.startDemoMode } href="javascript:void(0)">proceed in demo mode</a> (initial load time will be about 10-30 seconds)
        </p>
      );
      // don't offer demo mode if already using demo rpc host
      if (process.env.RPC_HOST === constants.DEMO_HOST) demoMode = <span/>;

      // no ethereum client detected
      return (
        <Modal {...this.props} id="no-eth-modal" onRequestHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
              <h4>Failed to connect to Ethereum</h4>
              <p>Augur requires a local node of the Ethereum client running</p>
              <p>Visit <a href="https://github.com/ethereum/go-ethereum/wiki">the ethereum github wiki</a> for help installing the latest client</p>
              <p>If geth is installed:<br /><span className='cmd'>geth --rpc --rpccorsdomain { host } --shh --unlock primary</span></p>
              { demoMode }
          </div>
        </Modal>
      );

    } else if (this.state.isLoading) {

      var percentCaughtUp = ((this.state.startSecondsBehind - this.props.network.blockChainAge) / this.state.startSecondsBehind) * 100;
      //console.log(this.state.startSecondsBehind, this.props.network.blockChainAge, percentCaughtUp);
      var progressBar = (<ProgressBar striped active now={ 100 } className='loading-blocks-progress' />);
      if (percentCaughtUp > 0) {
        progressBar = (<ProgressBar now={ parseFloat(percentCaughtUp) } className='loading-blocks-progress' />);
      }

      var message = (<p>The Ethereum block chain is not current.  Looking for peers.</p>);
      if (this.props.network.peerCount) {
        var plural = this.props.network.peerCount === 1 ? '' : 's';
        message = (<p>The Ethereum block chain is not current and is fetching blocks from <b>{ this.props.network.peerCount }</b> peer{ plural }</p>)
      }

      // augur client is loading
      return (
        <Modal {...this.props} bsSize='small' onRequestHide={ this.handleToggle } backdrop='static'>
          <div className="modal-body clearfix">
              <h4>Ethereum loading</h4>
              { message }
              { progressBar }
          </div>
        </Modal>
      );
    }
  }
});

module.exports = AugurApp;
