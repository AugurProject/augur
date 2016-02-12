let React = require("react");
let abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
let utilities = require("../libs/utilities");

module.exports = React.createClass({
  render() {
    var closeButton = <span />;
    if (this.props.status === "Trade successful!" ||
        this.props.status === "Trade failed." ||
        this.props.status === "Could not commit trade.") {
      closeButton = (
        <Button
          bsStyle="default"
          onClick={this.props.onHide}>
          Close
        </Button>
      );
    }
    return (
      <Modal {...this.props} id="close-market-modal">
        <div className="modal-header clearfix">
          <h4>Trade in progress</h4>
        </div>
        <div className="modal-body clearfix">
          <div className="row">
            <div className="col-sm-12">
              {this.props.status}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <pre>{this.props.detail}</pre>
            </div>
          </div>
          {closeButton}
        </div>
      </Modal>
    );
  }
});
