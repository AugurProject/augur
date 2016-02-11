var React = require("react");
var abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
var utilities = require("../libs/utilities");

module.exports = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getStateFromFlux: function () {
    return {
      currentBlock: this.getFlux().store('network').getState().blockNumber
    };
  },

  onConfirm: function (event) {
    var marketId = abi.hex(this.props.params.market.id);
    var branchId = this.props.params.market.branchId;
    console.log("Closing market", marketId, "on branch", branchId);
    this.getFlux().augur.closeMarket({
      branchId: branchId,
      marketId: marketId,
      onSent: function (res) { console.log("Close market sent:", res); },
      onSuccess: function (res) { console.log("Close market succeeded:", res); },
      onFailed: function (err) { console.error("Close market failed:", err); }
    });
    this.props.onHide();
  },

  onCancel: function (event) {
    this.props.onHide();
  },

  render: function () {
    var market = this.props.params.market;
    return (
      <Modal {...this.props} id="close-market-modal">
        <div className="modal-header clearfix">
          <h4>Close Market</h4>
        </div>
        <div className="modal-body clearfix">
          <p>Closing {market.type} market: {market._id}</p>
          <div className="col-sm-12">
            <p><i>{market.description}</i></p>
          </div>
          <Button bsStyle="default" onClick={this.onCancel}>Cancel</Button>
          <Button bsStyle="danger" onClick={this.onConfirm}>Close Market</Button>
        </div>
      </Modal>
    );
  }
});
