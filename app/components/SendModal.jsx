var _ = require("lodash");
var augur = require("augur.js");
var abi = require("augur-abi");
var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require("react-bootstrap");
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;

var utilities = require("../libs/utilities");

var SendCashModal = React.createClass({

  assetType: 'cash',

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null
    };
  },

  getStateFromFlux: function () {
    var balance = this.getFlux().store('asset').getState().cash;
    return { balance: balance ? +balance.toFixed(2) : '-' };
  },

  onSend: function (event) {
    var self = this;
    if (this.isValid(event)) {
      augur.sendCash({
        to: this.state.destination,
        value: this.state.amount,
        onSent: function (result) {
          console.log(abi.string(self.state.amount), "cash ->", self.state.destination);
        },
        onSuccess: function (result) {
          console.log("cash sent successfully");
        },
        onFailed: function (err) {
          console.error("failed to send cash:", err);
        }
      });
      this.props.onHide();
      // this.props.onRequestai();
    }
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

  mixins: [FluxMixin, StoreWatchMixin('asset', 'branch')],

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var balance = flux.store('asset').getState().reputation;
    return {
      branchId: flux.store("branch").getCurrentBranch().id,
      balance: balance ? +balance.toFixed(2) : '-'
    };
  },

  onSend: function (event) {
    var self = this;
    if (this.isValid(event)) {
      augur.sendReputation({
        branchId: this.state.branchId,
        to: this.state.destination,
        value: this.state.amount,
        onSent: function (result) {
          console.log(abi.number(self.state.amount), "rep ->", self.state.destination);
        },
        onSuccess: function (result) {
          console.log('rep sent successfully');
        },
        onFailed: function (error) {
          console.error("failed to send rep:", error);
        }
      });
      this.props.onHide();
    }
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

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null
    };
  },

  getStateFromFlux: function () {
    var balance = this.getFlux().store('asset').getState().ether;
    return {
      balance: balance ? utilities.formatEther(balance).value : '-'
    };
  },

  onSend: function(event) {
    if (this.isValid(event)) {
      augur.rpc.sendEther({
        to: this.state.destination,
        value: this.state.amount,
        from: this.getAccount(),
        onSent: function (result) {
          if (result && result.error) return utilities.error(result);
        },
        onSuccess: function (result) {
          if (result) {
            if (result.error) return utilities.error(result);
            console.log(self.currentAccount, 'sent', amount, 'ether to', destination);
            console.log("txhash:", result.txHash);
          }
        },
        onFailed: function (result) {
          utilities.error("sendEther failed:", result);
        }
      });
      this.props.onHide();
    }
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
