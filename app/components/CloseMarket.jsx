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
    var flux = this.getFlux();
    var market = this.props.params.market;
    var marketId = abi.hex(market.id);
    var branchId = market.branchId;
    console.info("Closing market", marketId, "on branch", branchId);
    flux.augur.closeMarket({
      branch: branchId,
      market: marketId,
      onSent: function () {},
      onSuccess: function (res) {
        console.log("Close market succeeded:", res);
        flux.actions.market.closedMarket(market);
      },
      onFailed: function (err) {
        console.error("Close market failed:", err);
      }
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
          <h4>
            <div className="close-market-header">Close Market</div>
          </h4>
          <div className="close-market-description">{market.description}</div>
          <code className="close-market-id">{market._id}</code>
        </div>
        <div className="modal-body clearfix">
          <div className="row clearfix">
            <div className="col-sm-12 close-market-explanation-box">
              <p className="close-market-explanation">
                After this market is closed, the market creator and Reporters will receive their fees, and all outstanding trades will be settled.  Shares of this market's outcomes will automatically be converted to Cash at the outcome's closing price.
              </p>
            </div>
          </div>
          <div className="row clearfix">
            <div className="col-sm-6">
              <Button
                className="btn-plain btn-block"
                onClick={this.onCancel}>
                Cancel
              </Button>
            </div>
            <div className="col-sm-6">
              <Button
                bsStyle="warning"
                className="active btn-block"
                onClick={this.onConfirm}>
                Close Market
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});
