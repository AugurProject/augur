var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var utilities = require('../libs/utilities');

var SendEtherModal = React.createClass({
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
      ether: flux.store('asset').getState().ether,
      account: flux.store('network').getAccount()
    }
  },

  onChangeDestination: function (event) {
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {

    // convert to wei
    var amount = event.target.value * 1000000000000000000;
    this.setState({amount: amount});
  },

  onSend: function (event) {

    // TODO: validation
    var transaction = {
      from: this.state.account,
      to: this.state.destination,
      value: this.state.amount
    };

    var self = this;

    web3.eth.sendTransaction(transaction, function(err, txhash) {
      if (!err) {
        utilities.log(self.state.account+' sent '+self.state.amount+' wei to '+ self.state.destination)
      } else {
        utilities.error(err);
      }
    });

    this.props.onRequestHide();
  },

  render: function () {
    return (
      <Modal {...this.props} id='send-rep-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Send ether</h4>
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
                    placeholder='amount in ether'
                    onChange={this.onChangeAmount} />
                  <span className="input-group-btn">
                    <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
                  </span>
                </div>
              </div>
            </div>
          </form>
          <p>ETHER: <b className='ether-balance'>{ utilities.formatEther(this.state.ether) }</b></p>
        </div>
      </Modal>
    );
  }
});

var SendEtherTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<SendEtherModal {...this.props} />}>
        <Button bsSize='xsmall' bsStyle='primary'>{ this.props.text }</Button>
      </ModalTrigger>
    );
  }
});

module.exports = {
  SendEtherModal: SendEtherModal,
  SendEtherTrigger: SendEtherTrigger
};
