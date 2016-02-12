let React = require("react");
let abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require("react-bootstrap/lib/Button");
let Input = require("react-bootstrap/lib/Input");
let Modal = require("react-bootstrap/lib/Modal");
let utilities = require("../libs/utilities");
let Collapse = require("react-bootstrap/lib/Collapse");
let Glyphicon = require("react-bootstrap/lib/Glyphicon");

module.exports = React.createClass({
  getInitialState() {
    return {showDetails: false};
  },
  toggleDetails() {
    this.setState({showDetails: !this.state.showDetails});
  },
  render() {
    let closeButton = <span />;
    if (this.props.complete) {
      closeButton = (
        <Button
          bsStyle="default"
          onClick={this.props.onHide}>
          Close
        </Button>
      );
    }
    return (
      <Modal {...this.props} className="progress-modal">
        <div className="modal-header clearfix">
          <h4>{this.props.header}</h4>
        </div>
        <div className="modal-body clearfix">
          <div className="row">
            <div className="col-sm-12">
              <span className="progress-status">{this.props.status}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div onClick={this.toggleDetails} className="pointer">
                <Glyphicon
                  glyph={this.state.showDetails ? "chevron-down" : "chevron-right"} />
                <b> Details</b>
              </div>
            </div>
          </div>
          <Collapse in={this.state.showDetails}>
            <div className="row progress-detail">
              <div className="col-sm-12">
                <pre>{this.props.detail}</pre>
              </div>
            </div>
          </Collapse>
          {closeButton}
        </div>
      </Modal>
    );
  }
});
