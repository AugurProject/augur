let React = require("react");
let Navigation = require("react-router/lib/Navigation");
let Modal = require("react-bootstrap/lib/Modal");
let Button = require("react-bootstrap/lib/Button");

let ReportSavedModal = React.createClass({

    mixins: [Navigation],

    onCloseClick(event) {
        this.transitionTo("reports");
        this.props.onHide();
    },

    render() {
        let markedAsUnethicalText;
        if (this.props.isUnethical) {
            markedAsUnethicalText = (
                <p>
                    You marked the outcome as <em>unethical</em>
                </p>
            );
        }
        let timeInfo = <span />;
        if (this.props.report &&
            (this.props.report.commitPeriodEndMillis || this.props.report.revealPeriodEndMillis)) {
            timeInfo = (
                <span>
                    This begins in {this.props.report.commitPeriodEndMillis.humanize(true)} and ends in {this.props.report.revealPeriodEndMillis.humanize(true)}.
                </span>
            );
        }
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} bsSize="large">
                <div className="modal-body clearfix">
                    <h4>You have reported the outcome of this market!</h4>
                    <div className="row">
                        <div className="col-sm-12">
                            <p>
                                The outcome you have reported is: <em>{this.props.reportedOutcomeName}</em>
                            </p>
                            {markedAsUnethicalText}
                            <p>
                                You can change this report anytime before end of the reporting period by submitting a new report with a different outcome.
                            </p>
                            <p>
                                To confirm your report, you will need to log in sometime during the second half of the reporting period.  {timeInfo}  Your report has not been officially submitted until you do this!
                            </p>
                        </div>
                        <div className="col-sm-12">
                            <Button
                                className="pull-right"
                                bsStyle="primary"
                                onClick={this.onCloseClick}>
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
});

module.exports = ReportSavedModal;