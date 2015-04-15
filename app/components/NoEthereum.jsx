var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var OverlayMixin = require('react-bootstrap/lib/OverlayMixin');
var Modal = ReactBootstrap.Modal;

var NoEthereumModal = React.createClass({
  mixins: [FluxMixin, OverlayMixin],

  getInitialState: function () {
    return {
      isModalOpen: true
    };
  },

  handleToggle: function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  getStateFromFlux: function () {

    var flux = this.getFlux();

    return { }
  },

  startDemoMode: function (event) {

    var flux = this.getFlux();

    this.handleToggle();

    flux.actions.config.updateIsDemo(true);
  },

  render: function() {
    return <span />;
  },

  renderOverlay: function () {

    if (!this.state.isModalOpen) return <span />;

    return (
      <Modal {...this.props} bsSize='small' onRequestHide={ this.handleToggle }>
        <div className="modal-body clearfix">
            <h4>Ethereum not found</h4>
            <p>Augur requires a local node of the Ethereum client running</p>
            <p>Visit <a href="https://github.com/ethereum/cpp-ethereum/wiki">the ethereum github wiki</a> for help installing the lastest client</p>
            <p><a className="pull-right start-demo-mode" onClick={ this.startDemoMode } href="javascript:void(0)">Proceed in demo mode</a></p>
        </div>
      </Modal>
    );
  }
});

module.exports = NoEthereumModal;
