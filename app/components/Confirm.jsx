var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

var ConfirmModal = React.createClass({

  getInitialState: function () {
    return {
      isModalOpen: false,
      confirmText: 'Okay',
      cancelText: 'Cancel',
      confirmCallback: function() { console.log('okay')},
      cancelCallback: function() { console.log('okay')}
    };
  },

  handleToggle: function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  handleConfirm: function (event) {

    this.state.confirmCallback();
  },

  handleCancel: function (event) {
    
    this.state.cancelCallback();
  },

  render: function() {
    return <span />;
  },
  
  renderOverlay: function () {
    return (
      <Modal {...this.props} id='confirm-modal' bsSize='small' onRequestHide={ this.handleToggle }>
        <div className="modal-body clearfix">
          <div className="message"></div>
          <div className="pull-right">
            <Button bsStyle='default' onClick={ this.handleCancel } data-dismiss="modal">{ this.state.confirmText }</Button>
            <Button bsStyle='success' onClick={ this.handleConfirm } data-dismiss="modal">{ this.state.cancelText }</Button>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = {
  ConfirmModal: ConfirmModal
};
