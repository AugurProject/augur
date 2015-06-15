var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var utilities = require('../libs/utilities');

import { Branch } from '../stores/BranchStore'

var CloseMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'branch')],

  getInitialState: function () {
    return {
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      ethereumClient: flux.store('config').getEthereumClient(),
      currentBlock: flux.store('network').getState().blockNumber,
      branch: flux.store('branch').getCurrentBranch()
    }
  },

  componentDidMount: function(event) {

  },

  onConfirm: function (event) {

    this.state.ethereumClient.closeMarket(this.props.params.marketId, this.state.branch.id);
    this.props.onRequestHide();
  },

  onCancel: function(event) {

    this.props.onRequestHide();
  },

  render: function () {

    return (
      <Modal {...this.props} id='close-market-modal'>
        <div className="modal-header clearfix">
          <h4>Close Market</h4>
        </div>
        <div className="modal-body clearfix">
          <Button bsStyle='default' onClick={ this.onCancel }>Cancel</Button>
          <Button bsStyle='danger' onClick={ this.onConfirm }>Close Market</Button>
        </div>
      </Modal>
    );
  }
});

var CloseMarketTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<CloseMarketModal {...this.props} />}>
        <Button bsSize='xsmall' bsStyle='primary'>Close Market</Button>
      </ModalTrigger>
    );
  }
});

module.exports = {
  CloseMarketModal: CloseMarketModal,
  CloseMarketTrigger: CloseMarketTrigger
};
