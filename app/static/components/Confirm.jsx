var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

var ConfirmModal = React.createClass({

  getInitialState: function () {
    return {
      confirmText: 'Okay',
      cancelText: 'Cancel',
      confirmCallback: function() { console.log('okay')},
      cancelCallback: function() { console.log('okay')}
    };
  },

  onConfirm: function (event) {

    this.state.confirmCallback();
  },

  onCancel: function (event) {
    
    this.state.cancelCallback();
  },

  render: function () {
    return (
      <Modal {...this.props} id='send-cash-modal' bsSize='small'>
        <div className="modal-body clearfix">
          <div className="message"></div>
          <div className="pull-right">
            <Button bsStyle='default' onClick={ this.onCancel } data-dismiss="modal">{ this.state.confirmText }</Button>
            <Button bsStyle='success' onClick={ this.onConfirm } data-dismiss="modal">{ this.state.cancelText }</Button>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = {
  ConfirmModal: ConfirmModal
};
