var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;


var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      marketText: '',
      marketTextHelper: '',
      marketInvestment: '',
      tradingFee: '',
      valid: false
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      ethereumClient: flux.store('config').getEthereumClient(),
      balance: flux.store('asset').getState().balance
    }
  },

  onChangeMarketText: function (event) {

    var marketText = event.target.value;
    var maxLength = 256;

    if (marketText.length) {
      this.state.marketTextHelper = marketText.length.toString()+'/'+maxLength.toString();
    } else {
      this.state.marketTextHelper = '';
    }

    this.setState({marketText: marketText});
  },

  onChangeTradingFee: function (event) {
    this.setState({tradingFee: event.target.value});
  },

  onChangeMarketInvestment: function (event) {
    this.setState({marketInvestment: event.target.value});
  },

  onSubmit: function (event) {

    console.log(this.state);
    this.props.onRequestHide();
  },

  render: function () {

    return (
      <Modal {...this.props} id='add-market-modal'>
        <div className="modal-body clearfix">
          <h4>New Market</h4>
          <form role="form clearfix">
              <div className="form-group">
                  <label for="market-text">Market description</label>
                  <span className="helper pull-right">{ this.state.marketTextHelper }</span> 
                  <input 
                    type="text" 
                    className="form-control" 
                    name="market-text" 
                    placeholder="Enter a a description for this market"  
                    onChange={ this.onChangeMarketText } 
                  />
              </div>
              <div className="form-group">
                  <label for="trading-fee">Trading fee</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="trading-fee" 
                    placeholder="Fee charged for each trade"
                    onChange={ this.onChangeTradingFee } 
                  />
              </div>
              <div className="form-group">
                  <label for="market-investment">Market Investment</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="market-investment" 
                    placeholder="The markets initial liquidity"
                    onChange={ this.onChangeMarketInvestment } 
                  />
              </div>
              <p>BALANCE: <b className='cash-balance'>{this.state.balance}</b></p>
              <Button bsStyle='primary' onClick={ this.onSubmit } className='pull-right'>Submit Market</Button>
          </form>
        </div>
      </Modal>
    );
  }
});

var AddMarketTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<AddMarketModal {...this.props} />}>
        <a href='#'>Submit a Market</a>
      </ModalTrigger>
    );
  }
});

module.exports = {
  AddMarketModal: AddMarketModal,
  AddMarketTrigger: AddMarketTrigger
};
