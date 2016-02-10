var React = require("react");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
var ReactDOM = require('react-dom');
var DatePicker = require('react-date-picker');
var moment = require("moment");
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var constants = require("../libs/constants");
var utilities = require("../libs/utilities");

var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'network', 'asset')],

  getInitialState: function () {
    return {
      pageNumber: 1,
      marketText: '',
      detailsText: '',
      plainMarketText: '',
      marketTextMaxLength: 256,
      marketTextCount: '',
      marketTextError: null,
      marketInvestment: '501',
      marketInvestmentError: null,
      maturationDate: '',
      tradingFee: '2',
      tradingFeeError: null,
      valid: false,
      minDate: moment().format('YYYY-MM-DD'),
      numOutcomes: 2,
      tab: 0,
      minValue: 1,
      maxValue: 2,
      choices: ["", ""],
      numResources: 0,
      resources: [],
      numTags: 0,
      tags: [],
      expirySource: "generic",
      expirySourceURL: ""
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    return {
      cash: flux.store('asset').getState().cash,
      currentBlock: flux.store('network').getState().blockNumber,
      currentBranch: flux.store('branch').getCurrentBranch()
    }
  },

  handleSelect: function (index, last) {
    this.setState({tab: index});
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
    this.setState({plainMarketText: marketText});
  },

  onChangeDetailsText: function (event) {
    this.setState({detailsText: event.target.value});
  },

  onUploadImageFile: function (event) {
    var self = this;
    if (event.target && event.target.files && event.target.files.length) {
      var imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (function (f) {
        return function (e) {
          self.setState({imageDataURL: e.target.result});
        };
      })(imageFile);
      reader.readAsDataURL(imageFile);
    }
  },

  onChangeTagText: function (event) {
    var tags = this.state.tags;
    var id = event.target.id;
    tags[id.split('-')[1]] = event.target.value;
    this.setState({tags: tags});
  },

  onChangeResourceText: function (event) {
    var resources = this.state.resources;
    var id = event.target.id;
    resources[id.split('-')[1]] = event.target.value;
    this.setState({resources: resources});
  },

  onChangeTradingFee: function (event) {
    var amount = event.target.value;
    if (!amount.match(/^[0-9]*\.?[0-9]*$/) ) {
      this.setState({tradingFeeError: 'invalid fee'});
    } else if (parseFloat(amount) > 12.5) {
      this.setState({tradingFeeError: 'must be less than 12.5%'});
    } else if (parseFloat(amount) < 0.7) {
      this.setState({tradingFeeError: 'must be greater than 0.7%'});
    } else {
      this.setState({tradingFeeError: null});
    }
    this.setState({tradingFee: amount});
  },

  onChangeMarketInvestment: function (event) {

    var marketInvestment = event.target.value;
    var cashLeft = this.state.cash - marketInvestment;

    if (cashLeft < 0) {
      this.setState({marketInvestmentError: 'cost exceeds cash balance'});
    } else {
      this.setState({marketInvestmentError: null});
    }
    this.setState({
      marketInvestment: marketInvestment
    });
  },

  onChangeMaturationDate: function (event) {
    this.setState({maturationDate: event.target.value});
  },

  onChangeExpirySource: function (event) {
    this.setState({expirySource: event.target.value});
  },

  onChangeExpirySourceURL: function (event) {
    this.setState({expirySourceURL: event.target.value});
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
      if (this.state.tradingFee === '') {
        this.setState({ tradingFeeError: 'invalid fee' });
        return false;
      } else if (this.state.marketInvestment === '') {
        this.setState({ marketInvestmentError: 'invalid amount' });
        return false;
      }
      if (this.state.marketInvestmentError || this.state.tradingFeeError) return false;
    } else if (pageNumber === 3) {
      if (this.state.maturationDate === '') return false;
    }
    return true;
  },

  onHide: function() {
    this.setState(this.getInitialState());
    this.props.onHide();
  },

  onBack: function(event) {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
  },

  onSubmit: function(event) {
    if (!this.validatePage(this.state.pageNumber)) return;
    var self = this;
    var flux = this.getFlux();
    var newMarketParams = {
      description: this.state.marketText,
      initialLiquidity: this.state.marketInvestment,
      tradingFee: new BigNumber(this.state.tradingFee / 100)
    };
    var source = (this.state.expirySource === "specific") ? this.state.expirySourceURL : null;
    var pendingId = flux.actions.market.addPendingMarket(newMarketParams);
    var branchId = flux.store("branch").getCurrentBranch().id;
    var block = flux.store("network").getState().blockNumber;
    flux.augur.createEvent({
      branchId: branchId,
      description: this.state.marketText,
      expirationBlock: utilities.dateToBlock(moment(this.state.maturationDate), block),
      minValue: this.state.minValue,
      maxValue: this.state.maxValue,
      numOutcomes: this.state.numOutcomes,
      onSent: function (res) {
        if (res && res.txHash) {
          console.log("new event submitted:", res.txHash);
        }
      },
      onSuccess: function (res) {
        if (res && res.callReturn && res.txHash) {
          console.log("new event ID:", res.callReturn);
          var events = res.callReturn;
          if (events.constructor !== Array) events = [events];
          flux.augur.createMarket({
            branchId: branchId,
            description: newMarketParams.description,
            alpha: "0.0079",
            initialLiquidity: newMarketParams.initialLiquidity,
            tradingFee: newMarketParams.tradingFee.toFixed(),
            events: events,
            onSent: function (r) {
              console.log("new market submitted:", r.txHash);
              flux.augur.ramble.addMetadata({
                marketId: r.callReturn,
                image: self.state.imageDataURL,
                details: self.state.detailsText,
                tags: self.state.tags,
                links: self.state.resources,
                source: source
              }, function (res) {
                console.log("ramble.addMetadata sent:", res);
              }, function (res) {
                console.log("ramble.addMetadata success:", res);
              }, function (err) {
                console.error("ramble.addMetadata:", err);
              });
            },
            onSuccess: function (r) {
              console.log("new market ID:", r.callReturn);
              var marketId = abi.bignum(r.callReturn);
              flux.actions.market.deleteMarket(pendingId);
              flux.actions.market.loadMarket(marketId);
            },
            onFailed: function (r) {
              console.error("market creation failed:", r);
              flux.actions.market.deleteMarket(pendingId);
            }
          });
        }
      },
      onFailed: function (r) {
        console.error("event creation failed:", r);
        flux.actions.market.deleteMarket(pendingId);
      }
    });
    this.onHide();
  },

  handleDatePicked: function(dateText, moment, event) {
    this.setState({maturationDate: dateText});
  },

  onAddTag: function (event) {
    var numTags = this.state.numTags + 1;
    if (numTags < 3) {
      var tags = this.state.tags;
      tags.push('');
      this.setState({numTags: numTags});
      this.setState({tags: tags});
    }
  },

  onAddResource: function (event) {
    var numResources = this.state.numResources + 1;
    var resources = this.state.resources;
    resources.push('');
    this.setState({numResources: numResources});
    this.setState({resources: resources});
  },

  onAddAnswer: function (event) {
    var numOutcomes = this.state.numOutcomes + 1;
    var choices = this.state.choices;
    choices.push('');
    this.setState({numOutcomes: numOutcomes});
    this.setState({choices: choices})
  },

  onChangeAnswerText: function (event) {
    var choices = this.state.choices;
    var id = event.target.id;
    choices[id.split('-')[1]] = event.target.value;
    this.setState({choices: choices});
    if (choices.length > 2) {
      var marketText = this.state.plainMarketText + " Choices: " + choices.join(", ") + ".";
      this.setState({marketText: marketText});
    }
  },

  onChangeMinimum: function (event) {
    var minValue = abi.number(event.target.value);
    this.setState({minValue: minValue});
  },

  onChangeMaximum: function (event) {
    var maxValue = abi.number(event.target.value);
    this.setState({maxValue: maxValue});
  },

  render: function () {

    var page, subheading, footer;

    if (this.state.pageNumber === 2) {

      var cashLeft = this.state.cash - this.state.marketInvestment;
      var tradingFeeHelp = this.state.tradingFeeError ? this.state.tradingFeeError : null;
      var tradingFeeHelpStyle = this.state.tradingFeeError ? 'error' : null;
      var marketInvestmentHelp = this.state.marketInvestmentError ? this.state.marketInvestmentError : 'CASH: '+ cashLeft.toFixed(5);
      var marketInvestmentHelpStyle = this.state.marketInvestmentError ? 'error' : null;

      subheading = 'Fees';
      page = (
        <div className="fees">

          <div className="form-horizontal">
            <Input 
              type='text'
              label='Trading fee'
              labelClassName='col-xs-3'
              help={ tradingFeeHelp }
              bsStyle={ tradingFeeHelpStyle }
              wrapperClassName='col-xs-3'
              addonAfter='%'
              value={ this.state.tradingFee }
              onChange={ this.onChangeTradingFee }
            />
          </div>

          <p className="desc">The trading fee is the percentage taken from each purchase or sale of an outcome.  These fees are split by you and all owners of winning outcomes</p>

          <div className="form-horizontal">
            <Input 
              type="text"
              label="Initial liquidity"
              help={ marketInvestmentHelp }
              bsStyle={ marketInvestmentHelpStyle }
              labelClassName='col-xs-3'
              wrapperClassName='col-xs-3'
              value={ this.state.marketInvestment }
              onChange={ this.onChangeMarketInvestment }
            />
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
            <Input
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
              minDate={ this.state.minDate }
              hideFooter={ true }
              onChange={ this.handleDatePicked }
            />
          </div>
        </div>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='default' onClick={ this.onBack }>Back</Button>
          <Button bsStyle='primary' onClick={ this.onNext }>Next</Button>
        </div>
      );

    } else if (this.state.pageNumber === 4) {

      subheading = "Additional market information";

      var numTags = this.state.numTags;
      var tags = new Array(numTags);
      var placeholderTag, tagId;
      for (var i = 0; i < numTags; ++i) {
        placeholderTag = "Tag " + i;
        tagId = "tag-" + i
        tags[i] = <Input
            key={i}
            id={tagId}
            type="text"
            value={this.state.tags[i]}
            placeholder={placeholderTag}
            onChange={this.onChangeTagText} />;
      }

      var numResources = this.state.numResources;
      var resources = new Array(numResources);
      var placeholderText, resourceId;
      for (i = 0; i < numResources; ++i) {
        placeholderText = "External resource " + i;
        resourceId = "resource-" + i
        resources[i] = <Input
            key={i}
            id={resourceId}
            type="text"
            value={this.state.resources[i]}
            placeholder={placeholderText}
            onChange={this.onChangeResourceText} />;
      }

      page = (
        <div>
          <h5>{subheading}</h5>
          <div className="form-group row">
            <div className="col-sm-12">
              <p>What information source will be used to determine the outcome of this event? (required)</p>
            </div>
            <Input
              value="generic"
              type="radio"
              checked={this.state.expirySource === "generic"}
              label="Outcome will be covered by local, national or international news media."
              labelClassName="col-sm-10"
              wrapperClassName="col-sm-12"
              onChange={this.onChangeExpirySource} />
            <Input
              value="specific"
              type="radio"
              checked={this.state.expirySource === "specific"}
              label="Outcome will be detailed on a specific website."
              labelClassName="col-sm-10"
              wrapperClassName="col-sm-12"
              onChange={this.onChangeExpirySource} />
            <div className="col-sm-12 indent">
              <p>Please enter the full URL of the website - which must be publicly available:</p>
              <Input
                disabled={this.state.expirySource === "generic"}
                type="text"
                value={this.state.expirySourceURL}
                placeholder="http://www.boxofficemojo.com"
                onChange={this.onChangeExpirySourceURL} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <p>Does your question need further explanation? (optional)</p>
              <Input
                type="textarea"
                bsStyle={inputStyle}
                value={this.state.detailsText}
                placeholder="Optional: enter a more detailed description of your market."
                onChange={this.onChangeDetailsText} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <p>Upload an image to be displayed with your market.</p>
              <Input
                type="file"
                id="imageFile"
                onChange={this.onUploadImageFile} />
              <p>Enter up to three tags (categories) for your market.  Examples: politics, science, sports, weather, etc.</p>
              {tags}
              <Button bsStyle="default" onClick={this.onAddTag}>
                Add tag
              </Button>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <p>Are there any helpful links you want to add? (optional)  For example, if your question is about an election you could link to polling information or the webpages of candidates.</p>
              {resources}
              <Button bsStyle="default" onClick={this.onAddResource}>
                Add resource
              </Button>
            </div>
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

      var numOutcomes = this.state.numOutcomes;
      var choices = new Array(numOutcomes);
      var placeholderText, choiceId;
      for (var i = 0; i < numOutcomes; ++i) {
        placeholderText = 'Enter answer ' + i;
        choiceId = 'choice-' + i
        choices[i] = <Input
            key={ i }
            id={ choiceId }
            type='text'
            value={ this.state.choices[i] }
            placeholder={ placeholderText }
            onChange={ this.onChangeAnswerText } />;
      }
      subheading = '';
      var inputStyle = this.state.marketTextError ? 'error' : null;
      page = (
        <Tabs onSelect={ this.handleSelect } selectedIndex={ this.state.tab } >
          <TabList>
            <Tab>Yes or No</Tab>
            <Tab>Multiple Choice</Tab>
            <Tab>Numerical</Tab>
          </TabList>
          <TabPanel>
            <div>
              <p>Enter a <b>yes or no question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <p>For example: "Will it rain in New York City on November 12, 2016?"</p>
              <Input
                type="textarea"
                help={this.state.marketTextError}
                bsStyle={inputStyle}
                value={this.state.marketText}
                placeholder="Will it rain in New York City on November 12, 2016?"
                onChange={this.onChangeMarketText} />
              <span className="text-count pull-right">{this.state.marketTextCount}</span>
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <p>Enter a <b>multiple choice question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <Input
                type='textarea'
                help={ this.state.marketTextError }
                bsStyle={ inputStyle }
                value={ this.state.marketText }
                placeholder="Which political party's candidate will win the 2016 U.S. Presidential Election?  Choices: Democratic, Republican, Libertarian, other"
                onChange={ this.onChangeMarketText } />
              <span className="text-count pull-right">{ this.state.marketTextCount }</span>
              <p>Choices:</p>
              { choices }
              <Button bsStyle='default' onClick={ this.onAddAnswer }>
                Add another answer
              </Button>
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <p>Enter a <b>numerical question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <p>Answers to numerical questions can be anywhere within a range of numbers.  For example, "What will the high temperature be in San Francisco, California, on July 1, 2016?" is a numerical question.</p>
              <Input
                type='textarea'
                help={ this.state.marketTextError }
                bsStyle={ inputStyle }
                value={ this.state.marketText }
                placeholder="What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
                onChange={ this.onChangeMarketText } />
              <span className="text-count pull-right">{ this.state.marketTextCount }</span>
              <p>What are the minimum and maximum allowed answers to your question?</p>
              Minimum:
              <Input
                type='text'
                value={ this.state.minValue }
                onChange={ this.onChangeMinimum } />
              Maximum:
              <Input
                type='text'
                value={ this.state.maxValue }
                onChange={ this.onChangeMaximum } />
            </div>
          </TabPanel>
        </Tabs>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='primary' onClick={ this.onNext }>Next</Button>
        </div>
      );
    };

    return (
      <Modal {...this.props} onHide={ this.onHide } id='add-market-modal'>
        <div className="modal-header clearfix">
          <h4>Create a new market<span className='subheading pull-right'>{ subheading }</span></h4>
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

module.exports = AddMarketModal;
