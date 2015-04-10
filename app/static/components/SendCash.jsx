var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;


var SendCashModal = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
      amount: '',
      destination: ''
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      balance: flux.store('asset').getState().balance
    }
  },

  onChangeDestination: function (event) {
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {
    this.setState({amount: event.target.value});
  },

  onSend: function (event) {
    // TODO: Validate the state, then call a contract to send the
    // transaction requested in the state.
    console.log('Would have sent ' + this.state.amount + ' ether to ' + this.state.destination);
    this.props.onRequestHide();
  },

  render: function () {
    return (
      // TODO: Consider moving away from an id so this can be reusable.
      <Modal {...this.props} id='send-cash-modal' title='Send Cash'>
        <div className='modal-body clearfix'>
          <form className='form-inline pull-right' role='form'>
            <div className='form-group'>
              <label className='sr-only' htmlFor='dest-address'>Destination address</label>
              <input
                type='text'
                className='form-control'
                placeholder='destination address'
                onChange={this.onChangeDestination} />
            </div>
            <div className='form-group'>
              <label className='sr-only' htmlFor='amount'>Amount</label>
              <input
                type='text'
                className='form-control'
                placeholder='amount'
                onChange={this.onChangeAmount} />
            </div>
            <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
          </form>
          <p>BALANCE: <b className='cash-balance'>{this.state.balance}</b></p>
        </div>
      </Modal>
    );
  }
});

var SendCashNavTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<SendCashModal {...this.props} />}>
        <p><a href='#'>Send Cash</a></p>
      </ModalTrigger>
    );
  }
});

module.exports = {
  SendCashModal: SendCashModal,
  SendCashNavTrigger: SendCashNavTrigger
};
