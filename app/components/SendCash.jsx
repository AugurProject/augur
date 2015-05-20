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
      cash: flux.store('asset').getState().cash,
      ethereumClient: flux.store('config').getEthereumClient()
    }
  },

  onChangeDestination: function (event) {
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {
    this.setState({amount: event.target.value});
  },

  onSend: function (event) {

    // TODO: validation and error handling
    var status = this.state.ethereumClient.sendCash(this.state.destination, this.state.amount);

    this.props.onRequestHide();
  },

  render: function () {

    var cashBalance = this.state.cash ? +this.state.cash.toFixed(2) : '-';

    return (
      <Modal {...this.props} id='send-cash-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Send cash</h4>
          <form className='form-horizontal' role='form'>
            <div className='form-group'>
              <div className="col-sm-12">
                <input
                  type='text'
                  className='form-control dest-address'
                  placeholder='destination address'
                  onChange={this.onChangeDestination} />
              </div>
              <div className="col-sm-12">
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='amount'
                    onChange={this.onChangeAmount} />
                  <span className="input-group-btn">
                    <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
                  </span>
                </div>
              </div>
            </div>
          </form>
          <p>CASH: <b className='cash-balance'>{ cashBalance }</b></p>
        </div>
      </Modal>
    );
  }
});

var SendCashTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<SendCashModal {...this.props} />}>
        <Button bsSize='xsmall' bsStyle='primary'>{ this.props.text }</Button>
      </ModalTrigger>
    );
  }
});

module.exports = {
  SendCashModal: SendCashModal,
  SendCashTrigger: SendCashTrigger
};
