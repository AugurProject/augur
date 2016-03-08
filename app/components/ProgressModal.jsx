var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var utilities = require("../libs/utilities");
var Collapse = require("react-bootstrap/lib/Collapse");
var Glyphicon = require("react-bootstrap/lib/Glyphicon");
var ProgressBar = require("react-bootstrap/lib/ProgressBar");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      showDetails: false,
      minimized: false
    };
  },
  toggleDetails: function () {
    this.setState({showDetails: !this.state.showDetails});
  },
  toggleMinimized: function () {
    this.setState({minimized: !this.state.minimized});
  },
  closeIfComplete: function () {
    if (this.props.complete) this.props.onHide();
  },
  render: function () {
    var hidden = "";
    if (!this.props.show) hidden = " hidden";
    var detailSection = <span />;
    var height = " full-height";
    var hideWhenMinimized = "";
    var loadingProgressModal = "loading-progress-modal";
    var loadingProgressModalWrapper = "col-sm-12";
    var loadingProgressModalRow = "";
    var expandIcon = <span />;
    var label = null;
    var active = false;
    if (this.state.minimized) {
      active = true;
      height = " minimized";
      hideWhenMinimized = " hidden";
      loadingProgressModalWrapper = "pull-left loading-progress-modal-wrapper";
      if (this.props.complete) {
        active = false;
        loadingProgressModalWrapper += " clickable";
      }
      loadingProgressModal = "loading-progress-modal-minimized";
      loadingProgressModalRow = "loading-progress-modal-row";
      expandIcon = (
        <div className="pull-right">
          <span className="minimize-icon">
            <Glyphicon
              glyph="chevron-up"
              onClick={this.toggleMinimized} />
          </span>
        </div>
      );
      label = this.props.header.toUpperCase();
      if (this.props.complete) label += " - COMPLETE"
    }
    var closeButton = <span />;
    var progressBar = (
      <ProgressBar
        now={100 * (this.props.step / this.props.numSteps)}
        className={loadingProgressModal}
        active={active}
        label={label} />
    );
    if (this.props.complete) {
      progressBar = (
        <ProgressBar
          bsStyle="success"
          now={100 * (this.props.step / this.props.numSteps)}
          className={loadingProgressModal}
          active={active}
          label={label} />
      );
      closeButton = (
        <Button
          bsStyle="success"
          bsSize="large"
          className={hideWhenMinimized}
          onClick={this.props.onHide}
          block>
          Close
        </Button>
      );
    }
    if (this.props.detail !== "null") {
      detailSection = (
        <div className={hideWhenMinimized}>
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
        </div>
      );
    }
    return (
      <div className={"progress-modal" + hidden + height}>
        <div className="row clearfix">
          <div className="col-sm-12 progress-modal-header">
            <h4 className={hideWhenMinimized}>
              {this.props.header}
              <span className="minimize-icon pull-right">
                <Glyphicon
                  glyph="chevron-down"
                  onClick={this.toggleMinimized} />
              </span>
            </h4>
            <div className={"row clearfix " + loadingProgressModalRow}>
              <div
                className={loadingProgressModalWrapper}
                onClick={this.closeIfComplete}>
                {progressBar}
              </div>
              {expandIcon}
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="row">
            <div className={"col-sm-12 progress-status-box" + hideWhenMinimized}>
              <span
                className="progress-status"
                dangerouslySetInnerHTML={{__html: this.props.status}}>
              </span>
            </div>
          </div>
          {detailSection}
          {closeButton}
        </div>
      </div>
    );
  }
});
