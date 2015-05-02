var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var utilities = require('../libs/utilities');
var DatePicker = require('react-date-picker');
var moment = require('moment');

var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      pageNumber: 1,
      marketText: '',
      marketTextHelper: '',
      marketInvestment: '100',
      maturationDate: '',
      tradingFee: '2',
      valid: false,
      cashLeft: 0,
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

  componentDidMount: function(event) {

    // not sure the proper place to put this
    this.state.cashLeft = this.state.cash;
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

    var marketInvestment = event.target.value;
    this.state.cashLeft = this.state.cash - marketInvestment;

    this.setState({marketInvestment: marketInvestment});
  },

  onChangeMaturationDate: function (event) {
    this.setState({maturationDate: event.target.value});
  },

  onNext: function(event) {
    var newPageNumber = this.state.pageNumber + 1;
    this.setState({pageNumber: newPageNumber});
  },

  onBack: function(event) {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
  },

  onSubmit: function(event) {

    var self = this;

    var newEventParams = {
      description: this.state.marketText,
      expirationBlock: utilities.dateToBlock(new Date(this.state.maturationDate), this.state.currentBlock)
    }

    this.state.ethereumClient.addEvent(newEventParams, function(newEvent) {

      var newMarketParams = {
        description: self.state.marketText,
        initialLiquidity: self.state.marketInvestment,
        tradingFee: self.state.tradingFee,
        events: [newEvent.id],
      }  

      self.state.ethereumClient.addMarket(newMarketParams);
    });

    this.props.onRequestHide();
  },

  handleDatePicked: function(dateText, moment, event) {

    this.setState({maturationDate: dateText});
  },

  render: function () {

    var page, subheading, footer;
    if (this.state.pageNumber === 2) {
      subheading = 'Fees';
      page = (
        <div className="form-horizontal fees">
          <div className="form-group">
            <label className="col-sm-3">Trading fee</label>
            <div className="col-sm-2 input-group">
              <input 
                type="text" 
                className="form-control" 
                name="trading-fee" 
                placeholder={ this.state.tradingFee }
                onChange={ this.onChangeTradingFee } 
              />
              <span className="input-group-addon">%</span>
            </div>
            <div className="col-xs-12">
              <p className="desc">The trading fee is the percentage taken from each purchase or sale of an outcome.  These fees are split by you and all owners of winning outcomes</p>
            </div> 
          </div>
          <div className="form-group">
            <label className="col-sm-3">Initial Liquidity</label>
            <div className="col-sm-2">
              <input 
                type="text" 
                className="form-control" 
                name="market-investment" 
                placeholder={ this.state.marketInvestment }
                onChange={ this.onChangeMarketInvestment } 
              />
            </div>
            <div className="col-sm-4">
              <span className="helper">CASH: { this.state.cashLeft }</span> 
            </div>
            <div className="col-xs-12">
              <p className="desc">The initial market liquidity is the amount of cash you wish to put in the market upfront.</p>
            </div> 
          </div>
        </div>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='default' onClick={ this.onBack }>Back</Button>
          <Button bsStyle='primary' onClick={ this.onNext }>Next</Button>
        </div>
      );
    } else if (this.state.pageNumber === 3) {
      subheading = 'Maturation Date';
      page = (
        <div className="form-group date">
          <div className='col-sm-6'>
            <p>Enter the date this event will mature, trading will end and the question decided.</p>
            <input
              className='form-control'
              bsSize='large'
              type='text'
              placeholder='YYYY-MM-DD'
              value={ this.state.maturationDate }
              onChange={ this.onChangeMaturationDate } 
            />
          </div>
          <div className='col-sm-6'>
            <DatePicker 
              hideFooter={ true }
              onChange={ this.handleDatePicked }
            />
          </div>
        </div>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='default' onClick={ this.onBack }>Back</Button>
          <Button bsStyle='primary' onClick={ this.onSubmit }>Submit Market</Button>
        </div>
      );
    } else {
      subheading = 'Market Query';
      page = (
        <div>
          <p>Enter a question for the market to trade on.  This question should have a yes or no answer, be easiely verifiable and have an expiring date in the future.</p>
          <p>For example: "Will Hurricane Fatima remain a category four and make land-fall by August 8th, 2017?"</p>
          <textarea 
            className="form-control" 
            name="market-text" 
            placeholder="What's your yes or no question?"  
            onChange={ this.onChangeMarketText } 
          />
          <span className="helper pull-right">{ this.state.marketTextHelper }</span> 
        </div>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='primary' onClick={ this.onNext }>Next</Button>
        </div>
      );
    }

    return (
      <Modal {...this.props} id='add-market-modal'>
        <div className="modal-header clearfix">
          <h4>New Market<span className='subheading pull-right'>{ subheading }</span></h4>
        </div>
        <div className="modal-body clearfix">
          { page }
        </div>
        <div className="modal-footer clearfix">
          { footer }
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
