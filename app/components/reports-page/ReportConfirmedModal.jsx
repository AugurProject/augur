let React = require('react');

let Modal = require('react-bootstrap/lib/Modal');
let Button = require('react-bootstrap/lib/Button');

let ReportConfirmedModal = React.createClass({
    onCloseClick(event) {
        this.props.onHide();
    },
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} bsSize='small'>
                <div className='modal-body clearfix'>
                    <h4>You have confirmed your reported outcome!</h4>
                    <div className='row'>
                        <div className="col-sm-12">
                            <p>
                                At the end of the confirmation period you'll see full details of how this market was
                                expired on the Previous Reports tab - including:
                            </p>
                            <ul>
                                <li>The reporting consensus</li>
                                <li>Your share of the fees</li>
                                <li>Any adjustments made to your Reputation</li>
                            </ul>
                        </div>
                        <div className="col-sm-12">
                            <Button className="pull-right" bsStyle="primary" onClick={this.onCloseClick}>Continue</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
});

module.exports = ReportConfirmedModal;