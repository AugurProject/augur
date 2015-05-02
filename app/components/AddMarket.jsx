var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Augur = require('augur.js');
var utilities = require('../libs/utilities');
var BigNumber = require('bignumber.js');

var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      pageNumber: 1,
      marketText: '',
      marketTextHelper: '',
      marketInvestment: '',
      maturationDate: '',
      tradingFee: '',
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

  // waits for record id ro return a valid creator then executes callback
  waitForRecord: function(id, callback) {

    var creatorId = this.state.ethereumClient.getCreator(id);
    if (creatorId.toNumber() !== 0) {
      callback();
    } else {
      var self = this;
      utilities.log('waiting for record '+id.toString(16));
      setTimeout(function() { self.waitForRecord(id, callback) }, 3000);
    }
  },

  onNext: function(event) {
    var newPageNumber = this.state.pageNumber + 1;
    this.setState({pageNumber: newPageNumber});
  },

  onBack: function(event) {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
  },

  onSubmit: function (event) {
    var self = this;
    console.log("submitting new market:", this.state.marketText);
    var branchId = 1010101;
    var description = this.state.marketText;
    var expirationBlock = utilities.dateToBlock(
      new Date(this.state.maturationDate),
      this.state.currentBlock
    );
    var minValue = 0;
    var maxValue = 1;
    var numOutcomes = 2;
    console.log("broadcasting event:");
    Augur.createEvent(
      branchId,
      description,
      expirationBlock,
      minValue,
      maxValue,
      numOutcomes,
      // sentCallback
      function (event) {
        console.log("sent event");
        console.log(" - eventID:", event.id);
      },
      // verifiedCallback
      function (event) {
        console.log("verified hash");
        console.log(" - txhash:", event.txhash);
        Augur.getTx(event.txhash, function (r) { console.log(r); });
        var alpha = 0.07;
        var liquidity = self.state.marketInvestment || 100;
        var tradingFee = self.state.tradingFee || 0.02;
        alpha = (new BigNumber(alpha)).mul(Augur.ONE).toFixed();
        liquidity = (new BigNumber(liquidity)).mul(Augur.ONE).toFixed();
        tradingFee = (new BigNumber(tradingFee)).mul(Augur.ONE).toFixed();
        // var alpha = "0x" + (new BigNumber(0.07)).mul(Augur.ONE).toString(16);
        // var liquidity = "0x" + (new BigNumber(100)).mul(Augur.ONE).toString(16);
        // var tradingFee = "0x" + (new BigNumber(0.02)).mul(Augur.ONE).toString(16);
        console.log("alpha", alpha);
        console.log("liquidity", liquidity);
        console.log("tradingfee",tradingFee);
        console.log("event", event);
        console.log("event.id array", [event.id]);
        console.log("broadcasting market");
        Augur.createMarket(
          1010101,
          description,
          alpha,
          liquidity,
          tradingFee,
          // [ "-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f" ],
          [ event.id ],
          // sentCallback
          function (market) {
            console.log("sent market");
            console.log(" - marketID:", market.id);
          },
          // verifiedCallback
          function (market) {
            console.log("verified market!");
            console.log(market);
          },
          // failedCallback
          function (market) {
            console.log("something went wrong :(\nno market for you");
            console.log(market);
          }
        );
      }
    );
    this.props.onRequestHide();
  },

  onSubmitPunk: function(event) {

    console.log(this.state.marketText);

    var newEventParams = {
      description: this.state.marketText,
      expirationBlock: utilities.dateToBlock(new Date(this.state.maturationDate), this.state.currentBlock)
    }

    var newEventId = this.state.ethereumClient.addEvent(newEventParams);

    if (newEventId) {

      var self = this;
      this.waitForRecord(newEventId, function() {

        var newMarketParams = {
          description: self.state.marketText,
          initialLiquidity: self.state.marketInvestment,
          tradingFee: self.state.tradingFee,
          events: [newEventId],
        }  

        var newMarketId = self.state.ethereumClient.addMarket(newMarketParams);

        if (newMarketId) {

          utilities.log('new market ' + newMarketId +' created');

        } else {
          utilities.error('failed to add market');
        }

      });

    } else {

      utilities.error('failed to add event');
    }

    this.props.onRequestHide();
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
                placeholder="2"
                onChange={ this.onChangeTradingFee } 
              />
              <span className="input-group-addon">%</span>
            </div>
            <div className="col-xs-12">
              <p className="desc">The trading fee is the percentage taken from each purchase or sale of an outcome.  These fees are split buy creator and all owners of winning outcomes</p>
            </div> 
          </div>
          <div className="form-group">
            <label className="col-sm-3">Initial Liquidity</label>
            <div className="col-sm-2">
              <input 
                type="text" 
                className="form-control" 
                name="market-investment" 
                placeholder="100"
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
          <p>Enter the date this event will mature, trading will end and the question decided.</p>
          <input 
            type="text"
            bsSize="xlarge"
            className="form-control" 
            name="maturation-date" 
            placeholder="MM/DD/YYYY"
            onChange={ this.onChangeMaturationDate } 
          />
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
          <p>For example: "Will Hurrican Fatima remain a category four and make land-fall by August 8th, 2017"</p>
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
