let React = require("react");
let BigNumber = require("bignumber.js");
let abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let ReactDOM = require("react-dom");
let DatePicker = require("react-date-picker");
let TimePicker = require("react-time-picker");
let moment = require("moment");
let Button = require("react-bootstrap/lib/Button");
let Input = require("react-bootstrap/lib/Input");
let Modal = require("react-bootstrap/lib/Modal");
let ReactTabs = require("react-tabs");
let Tab = ReactTabs.Tab;
let Tabs = ReactTabs.Tabs;
let TabList = ReactTabs.TabList;
let TabPanel = ReactTabs.TabPanel;
let constants = require("../libs/constants");
let utilities = require("../libs/utilities");
let ProgressModal = require("./ProgressModal");

let AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("market", "network", "asset")],

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
      timePicked: "12:00:00",
      tradingFee: '2',
      tradingFeeError: null,
      valid: false,
      minDate: moment().format('YYYY-MM-DD'),
      numOutcomes: 3,
      tab: 0,
      minValue: null,
      maxValue: null,
      minValueError: null,
      maxValueError: null,
      choices: ["", ""],
      choiceTextError: [null, null],
      addAnswerDisabled: false,
      numResources: 0,
      resources: [],
      resourceTextError: [],
      numTags: 0,
      tags: [],
      tagTextError: [],
      addTagDisabled: false,
      expirySource: "generic",
      expirySourceURL: "",
      progressModal: {
        open: false,
        status: "",
        header: "",
        detail: null,
        complete: null,
        steps: 5,
        step: 0
      }
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

  updateProgressModal: utilities.updateProgressModal,

  toggleProgressModal: function (event) {
    var progressModal = this.state.progressModal;
    progressModal.open = !progressModal.open;
    this.setState({progressModal: progressModal});
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
      if (imageFile.type.match(/image.*/)) {
        var reader = new FileReader();
        reader.onload = function (e) {
          self.setState({imageDataURL: reader.result});
        };
        reader.readAsDataURL(imageFile); 
      }
    }
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

  onNext: function (event) {
    console.log("validated:", this.validatePage(this.state.pageNumber));
    if (this.validatePage(this.state.pageNumber)) {
      var newPageNumber = this.state.pageNumber + 1;
      this.setState({pageNumber: newPageNumber});
    }
  },

  validatePage: function (pageNumber) {
    var i;
    if (pageNumber === 1) {
      if (this.state.tab === 0) this.setState({minValue: 1, maxValue: 2});
      if (this.state.marketText.length > this.state.marketTextMaxLength) {
        this.setState({
          marketTextError: "Text exceeds the maximum length of " + this.state.marketTextMaxLength
        });
        return false;
      } else if (!this.state.marketText.length) {
        this.setState({marketTextError: "Please enter your question"});
        return false;
      } else if (this.state.tab === 1) {
        for (i = 0; i < this.state.numOutcomes; ++i) {
          if (!this.checkAnswerText(this.state.choices[i], i)) {
            return false;
          }
        }
      } else if (this.state.tab === 2) {
        if (!this.checkMinimum() || !this.checkMaximum()) return false;
      }
    } else if (pageNumber === 2) {
      if (this.state.tradingFee === '') {
        this.setState({ tradingFeeError: "invalid fee" });
        return false;
      } else if (this.state.marketInvestment === '') {
        this.setState({ marketInvestmentError: "invalid amount" });
        return false;
      }
      if (this.state.marketInvestmentError || this.state.tradingFeeError) return false;
    } else if (pageNumber === 3) {
      if (this.state.maturationDate === '') return false;
    } else if (pageNumber === 4) {
      for (i = 0; i < this.state.numTags; ++i) {
        if (!this.checkTagText(this.state.tags[i], i)) {
          return false;
        }
      }
      for (i = 0; i < this.state.numResources; ++i) {
        if (!this.checkResourceText(this.state.resources[i], i)) {
          return false;
        }
      }
    }
    return true;
  },

  onHide: function () {
    this.setState(this.getInitialState());
    this.props.onHide();
  },

  onBack: function (event) {
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
    var source = (this.state.expirySource === "specific") ?
      this.state.expirySourceURL : this.state.expirySource;
    var pendingId = flux.actions.market.addPendingMarket(newMarketParams);
    var branchId = flux.store("branch").getCurrentBranch().id;
    var block = flux.store("network").getState().blockNumber;
    var metadata = {
      image: this.state.imageDataURL,
      details: this.state.detailsText,
      tags: this.state.tags,
      links: this.state.resources
    };
    var checkbox = {createMarket: false, addMetadata: false};
    var minValue, maxValue, numOutcomes;

    // binary
    if (this.state.tab === 0) {
      minValue = 1;
      maxValue = 2;
      numOutcomes = 2;

    // numerical
    } else if (this.state.tab === 2) {
      minValue = this.state.minValue;
      maxValue = this.state.maxValue;
      numOutcomes = 2;

    // categorical
    } else {
      minValue = 1;
      maxValue = 2;
      numOutcomes = this.state.numOutcomes;
    }

    flux.augur.createSingleEventMarket({
      branchId: branchId,
      description: newMarketParams.description,
      expirationBlock: utilities.dateToBlock(moment(this.state.maturationDate), block),
      minValue: minValue,
      maxValue: maxValue,
      numOutcomes: numOutcomes,
      alpha: "0.0079",
      initialLiquidity: newMarketParams.initialLiquidity,
      tradingFee: newMarketParams.tradingFee.toFixed(),
      onSent: function (r) {
        console.log("new market submitted:", r.txHash);
        var marketId = r.callReturn;
        self.updateProgressModal();
        self.updateProgressModal({
          header: "Creating Market",
          status: "New market submitted.<br />Market ID: <small>" + r.callReturn + "</small><br />Waiting for confirmation...",
          detail: r
        });
        self.toggleProgressModal();
        flux.augur.ramble.addMetadata({
          marketId: marketId,
          image: metadata.image,
          details: metadata.details,
          tags: metadata.tags,
          links: metadata.links,
          source: source,
          broadcast: true
        }, function (res) {
          console.log("ramble.addMetadata sent:", res);
          self.updateProgressModal({
            header: "Creating Market",
            status: "Uploading market metadata...",
            detail: r
          });
        }, function (res) {
          console.log("ramble.addMetadata success:", res);
          self.updateProgressModal({
            header: "Creating Market",
            status: "Market metadata uploaded.",
            detail: r
          });
          checkbox.addMetadata = true;
          if (checkbox.createMarket) {
            self.updateProgressModal({
              status: "Your market has been successfully created!",
              complete: true
            });
          }
        }, function (err) {
          console.error("ramble.addMetadata:", err);
          self.updateProgressModal({
            header: "Creating Market",
            status: "Market metadata upload failed.",
            detail: r,
            complete: true
          });
        });
      },
      onSuccess: function (r) {
        console.log("new market ID:", r.callReturn);
        var marketId = abi.bignum(r.callReturn);
        self.updateProgressModal({
          header: "Creating Market",
          status: "New market confirmed.",
          detail: r
        });
        checkbox.createMarket = true;
        if (checkbox.addMetadata) {
          self.updateProgressModal({
            complete: true,
            status: "Your market has been successfully created!"
          });
        }
        flux.actions.market.deleteMarket(pendingId);
        flux.actions.market.loadMarket(marketId);
      },
      onFailed: function (r) {
        console.error("market creation failed:", r);
        self.updateProgressModal({
          header: "Market Creation Failed",
          status: "Your market could not be created.",
          detail: r,
          complete: true
        });
        flux.actions.market.deleteMarket(pendingId);
      }
    });
    this.onHide();
  },

  handleDatePicked: function (dateText, moment, event) {
    this.setState({maturationDate: dateText});
  },

  handleTimePicked: function (picked) {
    this.setState({timePicked: picked});
  },

  onAddTag: function (event) {
    var numTags = this.state.numTags + 1;
    if (numTags <= constants.MAX_ALLOWED_TAGS) {
      var tags = this.state.tags;
      var tagTextError = this.state.tagTextError;
      tags.push('');
      tagTextError.push(null);
      this.setState({
        numTags: numTags,
        tags: tags,
        tagTextError: tagTextError,
        addTagDisabled: numTags === constants.MAX_ALLOWED_TAGS
      });
    }
  },

  onAddResource: function (event) {
    var numResources = this.state.numResources + 1;
    var resources = this.state.resources;
    var resourceTextError = this.state.resourceTextError;
    resources.push('');
    resourceTextError.push(null);
    this.setState({
      numResources: numResources,
      resources: resources,
      resourceTextError: resourceTextError
    });
  },

  onAddAnswer: function (event) {
    var numOutcomes = this.state.numOutcomes + 1;
    if (numOutcomes <= constants.MAX_ALLOWED_OUTCOMES) {
      var choices = this.state.choices;
      var choiceTextError = this.state.choiceTextError;
      choices.push('');
      choiceTextError.push(null);
      this.setState({
        numOutcomes: numOutcomes,
        choices: choices,
        choiceTextError: choiceTextError,
        addAnswerDisabled: numOutcomes === constants.MAX_ALLOWED_OUTCOMES
      });
    }
  },

  checkAnswerText: function (answerText, id) {
    var isOk = !(/^\s*$/.test(answerText));
    var choiceTextError = this.state.choiceTextError;
    choiceTextError[id] = (isOk) ? null : "Answer cannot be blank";
    this.setState({choiceTextError: choiceTextError})
    return isOk;
  },

  checkTagText: function (tagText, id) {
    var isOk = !(/^\s*$/.test(tagText));
    var tagTextError = this.state.tagTextError;
    tagTextError[id] = (isOk) ? null : "Tag cannot be blank";
    this.setState({tagTextError: tagTextError})
    return isOk;
  },

  checkResourceText: function (resourceText, id) {
    var isOk = !(/^\s*$/.test(resourceText));
    var resourceTextError = this.state.resourceTextError;
    resourceTextError[id] = (isOk) ? null : "Resource cannot be blank";
    this.setState({resourceTextError: resourceTextError})
    return isOk;
  },

  onChangeAnswerText: function (event) {
    var choices = this.state.choices;
    var id = parseInt(event.target.id.split('-')[1]);
    var answerText = event.target.value;
    this.checkAnswerText(answerText, id);
    choices[id] = answerText;
    this.setState({choices: choices});
    var marketText = this.state.plainMarketText + " Choices: " + choices.join(", ") + ".";
    this.setState({marketText: marketText});
  },

  onChangeTagText: function (event) {
    var tags = this.state.tags;
    var id = parseInt(event.target.id.split('-')[1]);
    var tagText = event.target.value;
    this.checkTagText(tagText, id);
    tags[id] = tagText;
    this.setState({tags: tags});
  },

  onChangeResourceText: function (event) {
    var resources = this.state.resources;
    var id = parseInt(event.target.id.split('-')[1]);
    var resourceText = event.target.value;
    this.checkResourceText(resourceText, id);
    resources[id] = resourceText;
    this.setState({resources: resources});
  },

  checkMinimum: function (minValue) {
    if (minValue === null || minValue === undefined) {
      minValue = this.state.minValue;
    }
    if (utilities.isNumeric(minValue)) {
      this.setState({minValueError: null});
      return true;
    } else {
      this.setState({minValueError: "Minimum value must be a number"});
      return false;
    }
  },

  checkMaximum: function (maxValue) {
    if (maxValue === null || maxValue === undefined) {
      maxValue = this.state.maxValue;
    }
    if (utilities.isNumeric(maxValue)) {
      this.setState({maxValueError: null});
      return true;
    } else {
      this.setState({maxValueError: "Maximum value must be a number"});
      return false;
    }
  },

  onChangeMinimum: function (event) {
    var minValue = event.target.value;
    if (utilities.isNumeric(minValue)) minValue = abi.number(minValue);
    this.setState({minValue: minValue});
    this.checkMinimum(minValue);
  },

  onChangeMaximum: function (event) {
    var maxValue = event.target.value;
    if (utilities.isNumeric(maxValue)) maxValue = abi.number(maxValue);
    this.setState({maxValue: maxValue});
    this.checkMaximum(maxValue);
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
              onChange={ this.onChangeTradingFee } />
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
              onChange={ this.onChangeMarketInvestment } />
          </div>

          <p className="desc">The initial market liquidity is the amount of cash you wish to put in the market upfront.</p>

        </div>
      );
      footer = (
        <div className="pull-right">
          <Button bsStyle="default" onClick={this.onBack}>Back</Button>
          <Button bsStyle="primary" onClick={this.onNext}>Next</Button>
        </div>
      );

    } else if (this.state.pageNumber === 3) {

      subheading = "Maturation Date";

      page = (
        <div className="form-group date">
          <div className="col-sm-6">
            <p>Enter a date on or after which the outcome of this event will be known.</p>
            <Input
              className="form-control"
              bsSize="large"
              type="text"
              placeholder="YYYY-MM-DD"
              value={this.state.maturationDate}
              onChange={this.onChangeMaturationDate} />
          </div>
          <div className="col-sm-6">
            <DatePicker
              minDate={this.state.minDate}
              hideFooter={true}
              onChange={this.handleDatePicked} />
            {/*<TimePicker
              style={{width: "100%", padding: 5, height: 50}}
              value={this.state.timePicked}
              onChange={this.handleTimePicked} />*/}
          </div>
        </div>
      );
      footer = (
        <div className="pull-right">
          <Button bsStyle="default" onClick={this.onBack}>Back</Button>
          <Button bsStyle="primary" onClick={this.onNext}>Next</Button>
        </div>
      );

    } else if (this.state.pageNumber === 4) {

      subheading = "Additional market information";

      var numTags = this.state.numTags;
      var tags = new Array(numTags);
      var placeholderTag, tagId;

      for (var i = 0; i < numTags; ++i) {
        placeholderTag = "Enter tag " + (i + 1);
        tagId = "tag-" + i
        tags[i] = <Input
            key={i}
            id={tagId}
            type="text"
            help={this.state.tagTextError[i]}
            bsStyle={this.state.tagTextError[i] ? "error" : null}
            value={this.state.tags[i]}
            placeholder={placeholderTag}
            wrapperClassName="row clearfix col-lg-12"
            onChange={this.onChangeTagText} />;
      }

      var numResources = this.state.numResources;
      var resources = new Array(numResources);
      var placeholderText, resourceId;
      for (i = 0; i < numResources; ++i) {
        placeholderText = "Enter external resource " + (i + 1);
        resourceId = "resource-" + i
        resources[i] = <Input
            key={i}
            id={resourceId}
            type="text"
            help={this.state.resourceTextError[i]}
            bsStyle={this.state.resourceTextError[i] ? "error" : null}
            value={this.state.resources[i]}
            placeholder={placeholderText}
            wrapperClassName="row clearfix col-lg-12"
            onChange={this.onChangeResourceText} />;
      }

      var image = <span />;
      if (this.state.imageDataURL) {
        image = <img className="metadata-image" src={this.state.imageDataURL} />;
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
              <p>Your question: {this.state.marketText}</p>
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
              <p>Upload an image to be displayed with your market. (optional) This uploader accepts most common image types (specifically, anything recognized as an image by the HTML5 File API).  A display of your image will be shown below this paragraph.</p>
              {image}
              <Input
                type="file"
                id="imageFile"
                onChange={this.onUploadImageFile} />
              <p>Enter up to three tags (categories) for your market. (optional) Examples: politics, science, sports, weather, etc.</p>
              {tags}
              {this.state.numTags < constants.MAX_ALLOWED_TAGS &&
                <Button
                  bsStyle="default"
                  disabled={this.state.addTagDisabled}
                  onClick={this.onAddTag}>
                  Add tag
                </Button>}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <p>Are there any helpful links you want to add? (optional) For example, if your question is about an election you could link to polling information or the webpages of candidates.</p>
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
        placeholderText = 'Enter answer ' + (i + 1);
        choiceId = 'choice-' + i
        choices[i] = <Input
            key={i}
            id={choiceId}
            type="text"
            help={this.state.choiceTextError[i]}
            bsStyle={this.state.choiceTextError[i] ? "error" : null}
            value={this.state.choices[i]}
            placeholder={placeholderText}
            wrapperClassName="row clearfix col-lg-12"
            onChange={this.onChangeAnswerText} />;
      }
      subheading = '';
      var inputStyle = this.state.marketTextError ? 'error' : null;
      // var addAnswerButtonDisabled = "";
      // if (this.state.addAnswerDisabled) addAnswerButtonDisabled = "btn-disabled";
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
            <div className="col-sm-12">
              <p>Enter a <b>multiple choice question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <Input
                type='textarea'
                help={this.state.marketTextError}
                bsStyle={inputStyle}
                value={this.state.marketText}
                placeholder="Which political party's candidate will win the 2016 U.S. Presidential Election?  Choices: Democratic, Republican, Libertarian, other"
                onChange={this.onChangeMarketText} />
              <span className="text-count pull-right">{this.state.marketTextCount}</span>
            </div>
            <div className="col-sm-12">
              <p>Choices:</p>
              {choices}
              <Button
                bsStyle="default"
                disabled={this.state.addAnswerDisabled}
                onClick={this.onAddAnswer}>
                Add another answer
              </Button>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="col-sm-12">
              <p>Enter a <b>numerical question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <p>Answers to numerical questions can be anywhere within a range of numbers.  For example, "What will the high temperature be in San Francisco, California, on July 1, 2016?" is a numerical question.</p>
              <Input
                type="textarea"
                help={this.state.marketTextError}
                bsStyle={inputStyle}
                value={this.state.marketText}
                placeholder="What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
                onChange={this.onChangeMarketText} />
              <span className="text-count pull-right">{this.state.marketTextCount}</span>
            </div>
            <div className="col-sm-12">
              <p>What are the minimum and maximum allowed answers to your question?</p>
              <Input
                type="text"
                help={this.state.minValueError}
                bsStyle={this.state.minValueError ? "error" : null}
                value={this.state.minValue}
                placeholder="Minimum answer"
                wrapperClassName="row clearfix col-lg-12"
                onChange={this.onChangeMinimum} />
              <Input
                type="text"
                help={this.state.maxValueError}
                bsStyle={this.state.maxValueError ? "error" : null}
                value={this.state.maxValue}
                placeholder="Maximum answer"
                wrapperClassName="row clearfix col-lg-12"
                onChange={this.onChangeMaximum} />
            </div>
          </TabPanel>
        </Tabs>
      );
      footer = (
        <div className="pull-right">
          <Button bsStyle="primary" onClick={this.onNext}>Next</Button>
        </div>
      );
    };

    return (
      <div>
        <Modal {...this.props} bsSize="large" onHide={this.onHide} id='add-market-modal'>
          <div className="modal-header clearfix">
            <h4>
              New Market Builder
              <span className='subheading pull-right'>{subheading}</span>
            </h4>
          </div>
          <div className="modal-body clearfix">
            {page}
          </div>
          <div className="modal-footer clearfix">
            {footer}
          </div>
        </Modal>
        <ProgressModal
          backdrop="static"
          show={this.state.progressModal.open}
          numSteps={this.state.progressModal.steps}
          step={this.state.progressModal.step}
          header={this.state.progressModal.header}
          status={this.state.progressModal.status}
          detail={JSON.stringify(this.state.progressModal.detail, null, 2)}
          complete={this.state.progressModal.complete}
          onHide={this.toggleProgressModal} />
      </div>
    );
  }
});

module.exports = AddMarketModal;
