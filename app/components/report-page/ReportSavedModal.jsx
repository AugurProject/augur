let React = require('react');

let Modal = require('react-bootstrap/lib/Modal');
let Button = require('react-bootstrap/lib/Button');

let ReportSavedModal = React.createClass({
    onCloseClick(event) {
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
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} bsSize='large'>
                <div className='modal-body clearfix'>
                    <h4>You have reported the outcome of this market!</h4>
                    <div className='row'>
                        <div className="col-sm-12">
                            <p>
                                The outcome you have reported is: <em>{ this.props.reportedOutcomeName }</em>
                            </p>
                            { markedAsUnethicalText }
                            <p>
                                You can change this report anytime before end of the reporting period by submitting a
                                new report with a different outcome.
                            </p>
                            <p>
                                You will need to confirm your report during the confirmation period. You can do this on
                                the Pending Confirmations tab of the Reporting page.
                            </p>
                        </div>
                        <div className="col-sm-12">
                            <Button className="pull-right" bsStyle="primary" onClick={this.onCloseClick}>OK</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
});

module.exports = ReportSavedModal;