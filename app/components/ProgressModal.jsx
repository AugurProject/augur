let React = require("react");
let Button = require("react-bootstrap/lib/Button");
let Modal = require("react-bootstrap/lib/Modal");
let utilities = require("../libs/utilities");
let Collapse = require("react-bootstrap/lib/Collapse");
let Glyphicon = require("react-bootstrap/lib/Glyphicon");
let ProgressBar = require("react-bootstrap/lib/ProgressBar");

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
          bsStyle="success"
          bsSize="large"
          onClick={this.props.onHide}
          block>
          Close
        </Button>
      );
    }
    return (
      <Modal {...this.props} className="progress-modal">
        <div className="modal-header clearfix">
          <h4>
            {this.props.header}
            <br />
            <small className="progress-modal-subheading">
              Do not leave this page until the green 'Close' button appears
            </small>
          </h4>
          <ProgressBar
            now={100 * (this.props.step / this.props.numSteps)}
            className="loading-progress" />
        </div>
        <div className="modal-body clearfix">
          <div className="row">
            <div className="col-sm-12 progress-status-box">
              <span
                className="progress-status"
                dangerouslySetInnerHTML={{__html: this.props.status}}>
              </span>
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
