var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var utilities = require('../libs/utilities');

var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      marketText: '',
      marketTextHelper: '',
      marketInvestment: '',
      maturationDate: '',
      tradingFee: '',
      valid: false
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      ethereumClient: flux.store('config').getEthereumClient(),
      cash: flux.store('asset').getState().cash,
      currentBlock: flux.store('network').getState().blockNumber
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

  onChangeMaturationDate: function (event) {
    this.setState({maturationDate: event.target.value});
  },

  onSubmit: function (event) {

    var newEventParams = {
      description: this.state.marketText,
      expirationBlock: utilities.dateToBlock(new Date(this.state.maturationDate), this.state.currentBlock)
    }

    var newEventId = this.state.ethereumClient.addEvent(newEventParams);
    if (newEventId) {

      var newMarketParams = {
        description: this.state.marketText,
        initialLiquidity: this.state.marketInvestment,
        tradingFee: this.state.tradingFee,
        events: [newEventId],
      }  
      var newMarketId = this.state.ethereumClient.addMarket(newMarketParams);

      if (newMarketId) {

        utilities.log('new market ' + newMarketId +' created');

      } else {

        utilities.error('failed to add market');
      }

    } else {

      utilities.error('failed to add event');
    }

    this.props.onRequestHide();
  },

  render: function () {

    return (
      <Modal {...this.props} id='add-market-modal'>
        <div className="modal-body clearfix">
          <h4>New Market</h4>
          <form role="form clearfix">
              <div className="form-group">
                  <label>Market description</label>
                  <span className="helper pull-right">{ this.state.marketTextHelper }</span> 
                  <input 
                    type="text" 
                    className="form-control" 
                    name="market-text" 
                    placeholder="Enter a description for this market"  
                    onChange={ this.onChangeMarketText } 
                  />
              </div>
              <div className="form-group">
                  <label>Trading fee</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="trading-fee" 
                    placeholder="Fee charged for each trade"
                    onChange={ this.onChangeTradingFee } 
                  />
              </div>
              <div className="form-group">
                  <label>Market Investment</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="market-investment" 
                    placeholder="The market's initial liquidity"
                    onChange={ this.onChangeMarketInvestment } 
                  />
              </div>
              <div className="form-group">
                  <label>Maturation Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="maturation-date" 
                    placeholder="MM/DD/YYYY"
                    onChange={ this.onChangeMaturationDate } 
                  />
              </div>
              <p>CASH: <b className='cash-balance'>{this.state.cash}</b></p>
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
