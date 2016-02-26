let _ = require("lodash");
let abi = require("augur-abi");
let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
let ReactTabs = require('react-tabs');
let Tab = ReactTabs.Tab;
let Tabs = ReactTabs.Tabs;
let TabList = ReactTabs.TabList;
let TabPanel = ReactTabs.TabPanel;
let utilities = require("../libs/utilities");

let SendCashModal = React.createClass({

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
    let balance = this.getFlux().store('asset').getState().cash;
    return { balance: balance ? +balance.toFixed(2) : '-' };
  },

  onSend: function (event) {
    let self = this;
    if (this.isValid(event)) {
      this.getFlux().augur.sendCash({
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
    }
  },

  onChangeDestination: function (event) {
    this.setState({destinationError: null});
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {
    let amount = event.target.value;
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
    let amountStyle = this.state.amountError ? 'error' : null;
    let destinationStyle = this.state.destinationError ? 'error' : null;
    let submit = (
      <Button bsStyle='primary' onClick={ this.onSend }>Send</Button>
    );
    return (
      <Modal {...this.props} className='send-modal' bsSize='large'>
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

let SendRepModal = React.createClass({

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
    let flux = this.getFlux();
    let balance = flux.store('asset').getState().reputation;
    return {
      branchId: flux.store("branch").getCurrentBranch().id,
      balance: balance ? +balance.toFixed(2) : '-'
    };
  },

  onSend: function (event) {
    let self = this;
    if (this.isValid(event)) {
      this.getFlux().augur.sendReputation({
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

    let amount = event.target.value;
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
      <Modal {...this.props} className='send-modal' bsSize='large'>
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

let SendEtherModal = React.createClass({

  assetType: 'ether',

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
      amount: '',
      destination: '',
      destinationError: null,
      amountError: null,
      tab: 0,
      progressText: ''
    };
  },

  getStateFromFlux: function () {
    let balance = this.getFlux().store('asset').getState().ether;
    return {
      balance: balance ? utilities.formatEther(balance).value : '-'
    };
  },

  // convert ether to cash (1:1)
  onDeposit: function (event) {
    var self = this;
    var flux = this.getFlux();
    var amount = this.state.amount;
    if (amount === '') {
      return this.setState({amountError: "enter a valid amount"});
    }
    flux.augur.depositEther({
      value: amount,
      onSent: function (res) {
        console.log("depositEther sent:", res);
        self.setState({progressText: "Depositing " + amount + " Ether for " + amount + " CASH..."});
      },
      onSuccess: function (res) {
        console.log("depositEther confirmed:", res);
        self.setState({progressText: "Deposited " + amount + " Ether for " + amount + " CASH."});
        flux.actions.asset.updateAssets();
      },
      onFailed: function (err) {
        console.error("depositEther failed:", err);
        self.setState({progressText: "Error: could not deposit " + amount + " Ether."});
      }
    });
  },

  // convert cash to ether (1:1)
  onWithdraw: function (event) {
    var self = this;
    var flux = this.getFlux();
    var destination = this.state.destination;
    var amount = this.state.amount;
    if (this.isValid(event)) {
      flux.augur.withdrawEther({
        to: destination,
        value: amount,
        onSent: function (res) {
          console.log("withdrawEther sent:", res);
          self.setState({progressText: "Withdrawing " + amount + " Ether to " + destination + "..."});
        },
        onSuccess: function (res) {
          console.log("withdrawEther confirmed:", res);
          self.setState({progressText: "Withdrew " + amount + " Ether to " + destination + "."});
          flux.actions.asset.updateAssets();
        },
        onFailed: function (err) {
          console.error("withdrawEther failed:", err);
          self.setState({progressText: "Error: could not withdraw " + amount + " Ether."});
        }
      });
    }
  },

  onSend: function (event) {
    if (this.isValid(event)) {
      let flux = this.getFlux();
      flux.augur.rpc.sendEther({
        to: this.state.destination,
        value: this.state.amount,
        from: flux.augur.from,
        onSent: function (res) {
          self.setState({progressText: "Sending " + amount + " Ether to " + destination + "..."});
        },
        onSuccess: function (res) {
          console.log("sendEther success:", res);
          self.setState({progressText: amount + " Ether sent to " + destination + "."});
        },
        onFailed: function (err) {
          console.error("sendEther failed:", err);
          self.setState({progressText: "Error: could not send " + amount + " Ether."});
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
    let amount = event.target.value;
    if (!amount.match(/[0-9]*\.?[0-9]*/) ) {
      this.setState({amountError: "enter a valid amount"});
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
      this.setState({destinationError: "enter a valid destination address"});
      return false;
    } else if (this.state.amount === '') {
      this.setState({amountError: "enter a valid amount"});
      return false;
    } else if (this.state.amountError || this.state.destinationError) {
      return false;
    }
    return true;
  },

  handleSelect: function (index, last) {
    this.setState({tab: index, progressText: ''});
  },

  render: function () {
    let amountStyle = this.state.amountError ? 'error' : null;
    let destinationStyle = this.state.destinationError ? 'error' : null;
    let deposit = (
      <Button bsStyle='primary' onClick={this.onDeposit}>Deposit</Button>
    );
    let withdraw = (
      <Button bsStyle='primary' onClick={this.onWithdraw}>Withdraw</Button>
    );
    let submit = (
      <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
    );
    return (
      <Modal {...this.props} className="send-modal" bsSize="large">
        <div className="modal-body clearfix">
          <Tabs onSelect={this.handleSelect} selectedIndex={this.state.tab}>
            <TabList>
              <Tab>Deposit</Tab>
              <Tab>Withdraw</Tab>
              <Tab>Send</Tab>
            </TabList>
            <TabPanel>
              <h4>Deposit Ether</h4>
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    type="text"
                    bsStyle={amountStyle}
                    help={this.getAmountHelpText()}
                    ref="input"
                    placeholder="Amount to deposit (in Ether)"
                    onChange={this.onChangeAmount} 
                    buttonAfter={deposit} />
                  {this.state.progressText}
                </div>
              </div>
              <p className="balance">
                {this.assetType}: <b>{this.state.balance}</b>
              </p>
            </TabPanel>
            <TabPanel>
              <h4>Withdraw Ether</h4>
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    type="text"
                    bsStyle={destinationStyle}
                    placeholder="Withdrawal address"
                    help={this.getDestinationHelpText()}
                    onChange={this.onChangeDestination} />
                </div>
                <div className="col-sm-12">
                  <Input
                    type="text"
                    bsStyle={amountStyle}
                    help={this.getAmountHelpText()}
                    ref="input"
                    placeholder="Amount to withdraw (in Ether)"
                    onChange={this.onChangeAmount} 
                    buttonAfter={withdraw} />
                  {this.state.progressText}
                </div>
              </div>
              <p className="balance">
                {this.assetType}: <b>{this.state.balance}</b>
              </p>
            </TabPanel>
            <TabPanel>
              <h4>Send Ether</h4>
              <div className='row'>
                <div className="col-sm-12">
                  <Input
                    type='text'
                    bsStyle={destinationStyle}
                    placeholder='destination address'
                    help={this.getDestinationHelpText()}
                    onChange={this.onChangeDestination} />
                </div>
                <div className="col-sm-12">
                  <Input
                    type="text"
                    bsStyle={amountStyle}
                    help={this.getAmountHelpText()}
                    ref="input"
                    placeholder='amount'
                    onChange={this.onChangeAmount} 
                    buttonAfter={submit} />
                  {this.state.progressText}
                </div>
              </div>
              <p className='balance'>
                Ether: <b>{this.state.balance}</b>
              </p>
            </TabPanel>
          </Tabs>
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
