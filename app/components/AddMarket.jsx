var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var utilities = require('../libs/utilities');
var DatePicker = require('react-date-picker');
var moment = require('moment');

var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'network', 'asset')],

  getInitialState: function () {
    return {
      pageNumber: 1,
      marketText: '',
      marketTextMaxLength: 256,
      marketTextCount: '',
      marketTextError: null,
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
      currentBlock: flux.store('network').getState().blockNumber,
      currentBranch: flux.store('branch').getCurrentBranch()
    }
  },

  componentDidMount: function(event) {

    // not sure the proper place to put this
    this.state.cashLeft = this.state.cash;
  },

  onChangeMarketText: function (event) {

    var marketText = event.target.value;

    if (marketText.length) {
      this.state.marketTextCount = marketText.length.toString()+'/'+this.state.marketTextMaxLength.toString();
    } else {
      this.state.marketTextCount = '';
    }

    this.setState({marketTextError: null});
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

    if (this.validatePage(this.state.pageNumber)) {
      var newPageNumber = this.state.pageNumber + 1;
      this.setState({pageNumber: newPageNumber});
    }
  },

  validatePage: function(pageNumber) {

    if (pageNumber === 1) {
      if (this.state.marketText.length > this.state.marketTextMaxLength) {
        this.setState({marketTextError: 'Text exceeds the maximum length of ' + this.state.marketTextMaxLength});
        return false;
      } else if (!this.state.marketText.length) {
         this.setState({marketTextError: 'Please enter your question'});
        return false;       
      }
    } else if (pageNumber === 2) {

    } else if (pageNumber === 3) {

    }
    return true;
  },

  onBack: function(event) {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
  },

  onSubmit: function(event) {

    var self = this;

    var newEventParams = {
      description: this.state.marketText,
      expirationBlock: utilities.dateToBlock(moment(this.state.maturationDate))
    }

    var newMarketParams = {
      description: this.state.marketText,
      initialLiquidity: this.state.marketInvestment,
      tradingFee: new BigNumber(self.state.tradingFee / 100)
    };

    var flux = this.getFlux();
    var pendingId = flux.actions.market.addMarket(newMarketParams);

    var ethereumClient = this.state.ethereumClient;
    ethereumClient.addEvent(newEventParams, function(newEvent) {

      // create associated market on success of event
      newMarketParams.events = [ newEvent.id ];
      self.state.ethereumClient.addMarket(newMarketParams, function(newMarket) {

        // get new market and add to store on success
        var marketId = new BigNumber(newMarket.id);  // convert hex string returned to Big Number :/
        var market = ethereumClient.getMarket(marketId, self.state.currentBranch.id);
        flux.actions.market.addMarket(market, pendingId);
      });
    });

    this.props.onRequestHide();
  },

  handleDatePicked: function(dateText, moment, event) {

    this.setState({maturationDate: dateText});
  },

  render: function () {

    var page, subheading, footer;

    if (this.state.pageNumber === 2) {

      var cashLeft = 'CASH: '+ this.state.cashLeft;
      subheading = 'Fees';
      page = (
        <div className="fees">

          <div className="form-horizontal">
            <Input 
              type='text'
              label='Trading fee'
              labelClassName='col-xs-3'
              wrapperClassName='col-xs-3'
              addonAfter='%'
              placeholder={ this.state.tradingFee }
              onChange={ this.onChangeTradingFee }
            />
          </div>

          <p className="desc">The trading fee is the percentage taken from each purchase or sale of an outcome.  These fees are split by you and all owners of winning outcomes</p>

          <div className="form-horizontal">
            <Input 
              type="text"
              label="Initial liquidity"
              labelClassName='col-xs-3'
              wrapperClassName='col-xs-3'
              placeholder={ this.state.marketInvestment }
              onChange={ this.onChangeMarketInvestment } />

          </div>

          <p className="desc">The initial market liquidity is the amount of cash you wish to put in the market upfront.</p>

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
      var inputStyle = this.state.marketTextError ? 'error' : null;
      page = (
        <div>
          <p>Enter a question for the market to trade on.  This question should have a yes or no answer, be easily verifiable and have an expiring date in the future.</p>
          <p>For example: "Will Hurricane Fatima remain a category four and make land-fall by August 8th, 2017?"</p>
          <Input
            type='textarea'
            help={ this.state.marketTextError }
            bsStyle={ inputStyle }
            placeholder="Ask your yes or no question"  
            onChange={ this.onChangeMarketText } 
          />
          <span className="text-count pull-right">{ this.state.marketTextCount }</span> 
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
