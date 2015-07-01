var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;

var utilities = require('../libs/utilities');

var SendCashModal = React.createClass({

  assetType: 'cash',

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getStateFromFlux: function() {

    var flux = this.getFlux();
    var balance = flux.store('asset').getState().cash;

    return {
      ethereumClient: flux.store('config').getEthereumClient(),
      balance: balance ? +balance.toFixed(2) : '-'
    }
  },

  onSend: function(event) {

    if (this.isValid(event)) {

      this.state.ethereumClient.sendCash(this.state.destination, this.state.amount, function(result) {
        console.log(result);
      });

      this.props.onRequestHide();
    }
  },


  // base methods
  // FIXME:  move these to a base class and merge for each modal

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null
    };
  },

  onChangeDestination: function (event) {

    this.setState({destinationError: null});
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {

    var amount = event.target.value;
    if (!amount.match(/[0-9]*\.?[0-9]*/) ) {
      this.setState({amountError: 'enter a valid amount'});
    } else if (amount > this.state.balance) {
      this.setState({amountError: 'amount exceeds '+ this.assetType +' balance'});
    } else {
      this.setState({amountError: null});
      this.setState({amount: amount});
    }
  },

  getDestinationHelpText: function () {
    if (this.state.destinationError) {
      return ( this.state.destinationError );
    } else {
      return '';
    }
  },

  getAmountHelpText: function () {
    if (this.state.amountError) {
      return ( this.state.amountError );
    } else {
      return '';
    }
  },

  isValid: function (event) {

    if (!utilities.isValidAccount(this.state.destination)) {
      this.setState({destinationError: 'enter a valid destination address'});
      return false;
    } else if (this.state.amount === '') {
      this.setState({amountError: 'enter a valid amount'});
      return false;
    } else if (this.state.amountError || this.state.destinationError) {
      return false;
    }
    return true;
  },

  render: function () {

    var amountStyle = this.state.amountError ? 'error' : null;
    var destinationStyle = this.state.destinationError ? 'error' : null;
    var submit = (
      <Button bsStyle='primary' onClick={ this.onSend }>Send</Button>
    );

    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Send { this.assetType }</h4>
          <div className='row'>
            <div className="col-sm-12">
              <Input
                type='text'
                bsStyle={ destinationStyle }
                placeholder='destination address'
                help={ this.getDestinationHelpText() }
                onChange={this.onChangeDestination} 
              />
            </div>
            <div className="col-sm-12">
              <Input
                type="text"
                bsStyle={ amountStyle }
                help={ this.getAmountHelpText() }
                ref="input"
                placeholder='amount'
                onChange={ this.onChangeAmount } 
                buttonAfter={ submit }
              />
            </div>
          </div>
          <p className='balance'>{ this.assetType }: <b>{ this.state.balance }</b></p>
        </div>
      </Modal>
    );
  }
});

var SendRepModal = React.createClass({

  assetType: 'rep',

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getStateFromFlux: function() {

    var flux = this.getFlux();
    var balance = flux.store('asset').getState().reputation;

    return {
      ethereumClient: flux.store('config').getEthereumClient(),
      balance: balance ? +balance.toFixed(2) : '-'
    }
  },

  onSend: function(event) {

    if (this.isValid(event)) {
      this.state.ethereumClient.sendRep(this.state.destination, this.state.amount);
      this.props.onRequestHide();
    }
  },


  // base methods
  // FIXME:  move these to a base class and merge for each modal

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null
    };
  },

  onChangeDestination: function (event) {

    this.setState({destinationError: null});
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {

    var amount = event.target.value;
    if (!amount.match(/[0-9]*\.?[0-9]*/) ) {
      this.setState({amountError: 'enter a valid amount'});
    } else if (amount > this.state.balance) {
      this.setState({amountError: 'amount exceeds '+ this.assetType +' balance'});
    } else {
      this.setState({amountError: null});
      this.setState({amount: amount});
    }
  },

  getDestinationHelpText: function () {
    if (this.state.destinationError) {
      return ( this.state.destinationError );
    } else {
      return '';
    }
  },

  getAmountHelpText: function () {
    if (this.state.amountError) {
      return ( this.state.amountError );
    } else {
      return '';
    }
  },

  isValid: function (event) {

    if (!utilities.isValidAccount(this.state.destination)) {
      this.setState({destinationError: 'enter a valid destination address'});
      return false;
    } else if (this.state.amount === '') {
      this.setState({amountError: 'enter a valid amount'});
      return false;
    } else if (this.state.amountError || this.state.destinationError) {
      return false;
    }
    return true;
  },

  render: function () {

    var amountStyle = this.state.amountError ? 'error' : null;
    var destinationStyle = this.state.destinationError ? 'error' : null;
    var submit = (
      <Button bsStyle='primary' onClick={ this.onSend }>Send</Button>
    );

    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Send { this.assetType }</h4>
          <div className='row'>
            <div className="col-sm-12">
              <Input
                type='text'
                bsStyle={ destinationStyle }
                placeholder='destination address'
                help={ this.getDestinationHelpText() }
                onChange={this.onChangeDestination} 
              />
            </div>
            <div className="col-sm-12">
              <Input
                type="text"
                bsStyle={ amountStyle }
                help={ this.getAmountHelpText() }
                ref="input"
                placeholder='amount'
                onChange={ this.onChangeAmount } 
                buttonAfter={ submit }
              />
            </div>
          </div>
          <p className='balance'>{ this.assetType }: <b>{ this.state.balance }</b></p>
        </div>
      </Modal>
    );
  }
});

var SendEtherModal = React.createClass({

  assetType: 'ether',

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getStateFromFlux: function() {

    var flux = this.getFlux();
    var balance = flux.store('asset').getState().ether;

    return {
      ethereumClient: flux.store('config').getEthereumClient(),
      balance: balance ? utilities.formatEther(balance).value : '-'
    }
  },

  onSend: function(event) {

    if (this.isValid(event) && process.env.RPC_HOST !== 'poc9.com:8545') {
      this.state.ethereumClient.sendEther(this.state.destination, this.state.amount);
      this.props.onRequestHide();
    }
  },

  // base methods
  // FIXME:  move these to a base class and merge for each modal

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null
    };
  },

  onChangeDestination: function (event) {

    this.setState({destinationError: null});
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {

    var amount = event.target.value;
    if (!amount.match(/[0-9]*\.?[0-9]*/) ) {
      this.setState({amountError: 'enter a valid amount'});
    } else if (amount > this.state.balance) {
      this.setState({amountError: 'amount exceeds '+ this.assetType +' balance'});
    } else {
      this.setState({amountError: null});
      this.setState({amount: amount});
    }
  },

  getDestinationHelpText: function () {
    if (this.state.destinationError) {
      return ( this.state.destinationError );
    } else {
      return '';
    }
  },

  getAmountHelpText: function () {
    if (this.state.amountError) {
      return ( this.state.amountError );
    } else {
      return '';
    }
  },

  isValid: function (event) {

    if (!utilities.isValidAccount(this.state.destination)) {
      this.setState({destinationError: 'enter a valid destination address'});
      return false;
    } else if (this.state.amount === '') {
      this.setState({amountError: 'enter a valid amount'});
      return false;
    } else if (this.state.amountError || this.state.destinationError) {
      return false;
    }
    return true;
  },

  render: function () {

    var amountStyle = this.state.amountError ? 'error' : null;
    var destinationStyle = this.state.destinationError ? 'error' : null;
    var submit = (
      <Button bsStyle='primary' onClick={ this.onSend }>Send</Button>
    );

    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Send { this.assetType }</h4>
          <div className='row'>
            <div className="col-sm-12">
              <Input
                type='text'
                bsStyle={ destinationStyle }
                placeholder='destination address'
                help={ this.getDestinationHelpText() }
                onChange={this.onChangeDestination} 
              />
            </div>
            <div className="col-sm-12">
              <Input
                type="text"
                bsStyle={ amountStyle }
                help={ this.getAmountHelpText() }
                ref="input"
                placeholder='amount'
                onChange={ this.onChangeAmount } 
                buttonAfter={ submit }
              />
            </div>
          </div>
          <p className='balance'>{ this.assetType }: <b>{ this.state.balance }</b></p>
        </div>
      </Modal>
    );
  }
});

module.exports = {
  SendCashModal: SendCashModal,
  SendRepModal: SendRepModal,
  SendEtherModal: SendEtherModal
};
