var React = require("react");
let Button = require('react-bootstrap/lib/Button');
let Modal = require('react-bootstrap/lib/Modal');

var FundsModal = React.createClass({

    onCloseClick(event) {
        this.props.onHide();
    },

    render: function () {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} className='send-modal' bsSize='small'>
                <div className='modal-body clearfix'>
                    <h4>Funds Incoming</h4>
                    <div className='row'>
                        <div className="col-sm-12">
                            <p>
                                Initial funds for you to start with are on the way - progress is in header. Don't leave
                                the web page until it's finished
                            </p>
                            <p>
                                Please be patient, this may take several minutes.
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

module.exports = FundsModal;
