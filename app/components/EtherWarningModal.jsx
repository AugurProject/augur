var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ReactBootstrap = require('react-bootstrap');
var OverlayMixin = require('react-bootstrap/lib/OverlayMixin');
var Modal = ReactBootstrap.Modal;

var utilities = require('../libs/utilities');
var constants = require('../libs/constants');

var EtherWarnModal = React.createClass({

  mixins: [FluxMixin, OverlayMixin],

  getInitialState: function () {

    return {
      isModalOpen: false,
      requiredEther: null
    }
  },

  componentWillReceiveProps: function(nextProps) {

    if (!nextProps.asset.ether) {
      utilities.warn('no ether');
      this.setState({ isModalOpen: true });
    } else if (nextProps.asset.ether < nextProps.requiredEther) {
      this.setState({ isModalOpen: true, requiredEther: nextProps.requiredEther });
    } else {
      this.setState({ isModalOpen: false, requiredEther: null });
    }
  },

  handleToggle: function() {

    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  render: function() {
    return <span />;
  },

  renderOverlay: function () {

    if (!this.state.isModalOpen) return <span />;

    if (this.state.requiredEther) {

      return (
        <Modal {...this.props} bsSize='small' onRequestHide={ this.handleToggle }>
          <div className="modal-body clearfix">
            <h4>Insufficient ether</h4>
            <p>This requires { this.state.requiredEther }.</p>
            <p>Your current balance is { this.props.asset.ether }</p>
          </div>
        </Modal>
      );

    } else {

      return (
        <Modal {...this.props} bsSize='small' onRequestHide={ this.handleToggle }>
          <div className="modal-body clearfix">
            <h4>No ether</h4>
            <p>This account has no ether which is required for transactions on the Ethereum network.</p>
            <p>Start the Ethereum client's miner or transfer some from another account</p>
          </div>
        </Modal>
      );
    }
  }

});

module.exports = EtherWarnModal;