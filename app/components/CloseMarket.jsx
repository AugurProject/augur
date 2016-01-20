var React = require("react");
var abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
var utilities = require("../libs/utilities");

var CloseMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getStateFromFlux: function () {
    return {
      currentBlock: this.getFlux().store('network').getState().blockNumber
    };
  },

  onConfirm: function (event) {
    var marketId = abi.hex(this.props.params.marketId);
    var branchId = abi.hex(this.props.params.branchId);
    console.log("Closing market", marketId, "on branch", branchId);
    this.getFlux().augur.closeMarket({
      branchId: branchId,
      marketId: marketId,
      onSent: function (txHash) { console.log("Close market sent:", txHash); },
      onSuccess: function (res) { console.log("Close market succeeded:", res); },
      onFailed: function (err) { console.log("Close market failed:", err); }
    });
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
    // ModalTrigger was deprecated in v0.23.6
    // (https://github.com/react-bootstrap/react-bootstrap/blob/1633450421ab6dbd5b8634825dd65b8948e9f0a9/CHANGELOG.md#v0236---wed-01-jul-2015-004802-gmt)
    // version was updated 959aa51c463e3683d36a1514c0359b97ec98fdb3 7/3/15 9:44 AM by Jack Peterson - this is probably never used and can be deleted
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
