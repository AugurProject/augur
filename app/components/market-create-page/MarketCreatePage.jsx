let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let ReactDOM = require("react-dom");

let moment = require("moment");
let BigNumber = require("bignumber.js");
let abi = require("augur-abi");
let constants = require("../../libs/constants");
let utilities = require("../../libs/utilities");

let DatePicker = require("react-date-picker");
let TimePicker = require("react-time-picker");
let Button = require("react-bootstrap/lib/Button");
let Link = require("react-router/lib/components/Link");
let Input = require("react-bootstrap/lib/Input");
let ProgressModal = require("../ProgressModal");

let MarketCreateIndex = require("./MarketCreateIndex");
let MarketCreateStep1 = require("./MarketCreateStep1");
let MarketCreateStep2 = require("./MarketCreateStep2");
//let MarketCreateStep3 = require("./MarketCreateStep3");

let MarketCreatePage = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("market", "network", "asset")],

  getInitialState: function () {
    return {
      pageNumber: 1,
      marketText: '',
      detailsText: '',
      plainMarketText: '',
      marketTextMaxLength: 256,
      marketTextError: null,
      marketInvestment: '501',
      marketInvestmentError: null,
      maturationDate: '',
      maturationDateError: null,
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
      numResources: 0,
      resources: [],
      numTags: 0,
      tags: [],
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

  onChangeMarketText: function (event) {
    var marketText = event.target.value;
    this.setState({marketText, plainMarketText: marketText}, () => {
      this.validateStep1("marketText");
    });
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
    this.setState({maturationDate: event.target.value}, () => {
      this.validateStep1("maturationDate");
    });
  },

  onChangeExpirySource: function (event) {
    this.setState({expirySource: event.target.value});
  },

  onChangeExpirySourceURL: function (event) {
    this.setState({expirySourceURL: event.target.value});
  },

  goToNextStep: function () {
    let isPageValid = this.validatePage(this.state.pageNumber);
    console.log("validated:", isPageValid);
    if (isPageValid) {
      var newPageNumber = this.state.pageNumber + 1;
      this.setState({pageNumber: newPageNumber});
    }
  },

  goToPreviousStep: function () {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
  },

  goToPage(newPageNumber) {
    if (this.validatePage(this.state.pageNumber)) {
      this.setState({pageNumber: newPageNumber});
    }
  },
  /**
   * Need to update min and max values
   */
  componentWillReceiveProps(nextProps) {
    let newMarketType = nextProps.query.type;
    if (this.props.query.type != newMarketType) {
      let newState = {
        pageNumber: 1
      };
      switch (newMarketType) {
        case "binary": // fallthrough
        case "categorical":
          newState.minValue = 1;
          newState.maxValue = 2;
          break;
        case "scalar":
          newState.minValue = null;
          newState.maxValue = null;
          break;
      }
      this.setState(newState);
    }
  },
  validatePage: function (pageNumber) {
    if (pageNumber === 1) {
      return this.validateStep1();
    } else if (pageNumber === 2) {
      return this.validateStep2();
    } else if (pageNumber === 3) {
      return this.validateStep3();
    }
    return true;
  },
  /**
   * Validates all fields at once to give immediate feedback to user
   *
   * @param {String=} fieldToValidate
   * @return boolean
   */
      validateStep1(fieldToValidate) {
    let isValid = true;

    if (fieldToValidate == null || fieldToValidate == "marketText") {
      let isMarketTextLongEnough = this.state.marketText.length <= this.state.marketTextMaxLength;
      this.setState({
        marketTextError: isMarketTextLongEnough ? null : `Text exceeds the maximum length of ${this.state.marketTextMaxLength}`
      });
      if (!isMarketTextLongEnough) {
        isValid = false;
      }

      let isMarketTextSet = this.state.marketText.length > 0;
      this.setState({marketTextError: isMarketTextSet ? null : 'Please enter your question'});
      if (!isMarketTextSet) {
        isValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate == "maturationDate") {
      let isMaturationSet = this.state.maturationDate !== '';
      this.setState({maturationDateError: isMaturationSet ? null : 'Please enter maturation date'});
      if (!isMaturationSet) {
        isValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate == "choices") {
      if (this.props.query.type === "categorical") {
        for (var i = 0, len = this.state.choices.length; i < len; ++i) {
          if (!this.checkAnswerText(this.state.choices[i], i)) {
            isValid = false;
          }
        }
      }
    }

    if (fieldToValidate == null || fieldToValidate == "minMax") {
      if (this.props.query.type === "scalar") {
        let isMinValid = this.checkMinimum();
        let isMaxValid = this.checkMaximum();
        if (!isMinValid || !isMaxValid) {
          isValid = false;
        }
      }
    }

    return isValid;
  },
  validateStep2() {
    return true;
  },
  validateStep3() {
    return true;
  },

  onHide: function () {
    this.setState(this.getInitialState());
    this.props.onHide();
  },

  onSubmit: function(event) {
    if (!this.validatePage(this.state.pageNumber)) return;
    let marketType;

    if (this.props.query != null) {
      marketType = this.props.query.type;
    }
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

    if (marketType === "binary") {
      minValue = 1;
      maxValue = 2;
      numOutcomes = 2;

    } else if (marketType === "scalar") {
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
    this.setState({maturationDate: dateText}, () => {
      this.validateStep1("maturationDate");
    });
  },

  handleTimePicked: function (picked) {
    this.setState({timePicked: picked});
  },

  onAddTag: function (event) {
    var numTags = this.state.numTags + 1;
    if (numTags <= constants.MAX_ALLOWED_TAGS) {
      var tags = this.state.tags;
      tags.push('');
      this.setState({
        numTags: numTags,
        tags: tags
      });
    }
  },

  onAddResource: function (event) {
    var numResources = this.state.numResources + 1;
    var resources = this.state.resources;
    resources.push('');
    this.setState({
      numResources: numResources,
      resources: resources
    });
  },

  onAddAnswer: function (event) {
    var numOutcomes = this.state.numOutcomes + 1;
    var choices = this.state.choices.slice();
    var choiceTextError = this.state.choiceTextError;
    choices.push('');
    choiceTextError.push(null);
    this.setState({
      numOutcomes: numOutcomes,
      choices: choices,
      choiceTextError: choiceTextError
    });
  },

  checkAnswerText: function (answerText, id) {
    var isOk = !(/^\s*$/.test(answerText));
    var choiceTextError = this.state.choiceTextError;
    choiceTextError[id] = (isOk) ? null : "Answer cannot be blank";
    this.setState({choiceTextError: choiceTextError});
    return isOk;
  },

  onChangeAnswerText: function (event) {
    var answerText = event.target.value;
    var id = parseInt(event.target.getAttribute("data-index"));
    console.log("id: %o, text: %o", id, answerText);
    var choices = this.state.choices.slice();
    //this.checkAnswerText(answerText, id);
    choices[id] = answerText;
    var marketText = this.state.plainMarketText + " Choices: " + choices.join(", ") + ".";
    this.setState({choices, marketText}, () => {
      this.validateStep1("choices");
    });
  },

  checkMinimum: function () {
    let isMinNumeric = utilities.isNumeric(this.state.minValue);
    this.setState({minValueError: isMinNumeric ? null : "Minimum value must be a number"});
    return isMinNumeric;
  },

  checkMaximum: function () {
    let isMaxNumeric = utilities.isNumeric(this.state.maxValue),
        isValid = true,
        errorMessage;

    if (!isMaxNumeric) {
      errorMessage = "Maximum value must be a number";
      isValid = false;
    }

    let isMinNumeric = utilities.isNumeric(this.state.minValue);
    if (isMinNumeric && isMaxNumeric) {
      if (this.state.maxValue <= this.state.minValue) {
        errorMessage = "Maximum must be greater than minimum";
        isValid = false;
      }
    }
    this.setState({maxValueError: isValid ? null : errorMessage});
    return isValid;
  },

  onChangeMinimum: function (event) {
    var minValue = event.target.value;
    if (utilities.isNumeric(minValue)) {
      minValue = abi.number(minValue);
    }
    this.setState({minValue: minValue}, () => {
      this.validateStep1("minMax");
    });
  },

  onChangeMaximum: function (event) {
    var maxValue = event.target.value;
    if (utilities.isNumeric(maxValue)) {
      maxValue = abi.number(maxValue);
    }
    this.setState({maxValue: maxValue}, () => {
      this.validateStep1("minMax");
    });
  },

  render: function () {
    let stepContent, subheading, footer, marketType;

    if (this.props.query != null) {
      marketType = this.props.query.type;
    }

    if (marketType == null) {
      return <MarketCreateIndex/>;
    }

    if (this.state.pageNumber === 2) {
      stepContent = <MarketCreateStep2
          goToNextStep={this.goToNextStep}
          goToPreviousStep={this.goToPreviousStep}
          />;
    } else if (this.state.pageNumber === 3) {

      subheading = "Maturation Date";

      stepContent = (
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
            value={this.state.tags[i]}
            placeholder={placeholderTag}
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
            value={this.state.resources[i]}
            placeholder={placeholderText}
            onChange={this.onChangeResourceText} />;
      }

      var image = <span />;
      if (this.state.imageDataURL) {
        image = <img className="metadata-image" src={this.state.imageDataURL} />;
      }

      stepContent = (
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
              <p>Upload an image to be displayed with your market. (optional) This uploader accepts most common image types (specifically, anything recognized as an image by the HTML5 File API).  A display of your image will be shown below this paragraph.  This is exactly the way the image will look on the market page.  Note: the maximum recommended height for images is 200px; images taller than this will be shrunken to a height of 200px.</p>
              {image}
              <Input
                type="file"
                id="imageFile"
                onChange={this.onUploadImageFile} />
              <p>Enter up to three tags (categories) for your market. (optional) Examples: politics, science, sports, weather, etc.</p>
              {tags}
              { this.state.numTags < constants.MAX_ALLOWED_TAGS &&
                <Button bsStyle="default" onClick={this.onAddTag}>
                  Add tag
                </Button>
              }
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
      stepContent = <MarketCreateStep1
          marketType={marketType}
          marketText={this.state.marketText}
          marketTextError={this.state.marketTextError}
          onChangeMarketText={this.onChangeMarketText}
          categoricalChoices={this.state.choices}
          categoricalChoiceErrors={this.state.choiceTextError}
          onChangeCategoricalChoices={this.onChangeAnswerText}
          onAddCategoricalOutcome={this.onAddAnswer}
          maturationDate={this.state.maturationDate}
          maturationDateError={this.state.maturationDateError}
          minValue={this.state.minValue}
          minValueError={this.state.minValueError}
          maxValue={this.state.maxValue}
          maxValueError={this.state.maxValueError}
          onChangeMinimum={this.onChangeMinimum}
          onChangeMaximum={this.onChangeMaximum}
          onEndDatePicked={this.handleDatePicked}
          goToNextStep={this.goToNextStep}
          marketTextMaxLength={this.state.marketTextMaxLength}
          />;
    }

    return (
      <div>
        <h4>
          New Market Builder
          <span className='subheading pull-right'>{subheading}</span>
        </h4>
        <div className="">
          <ol className="breadcrumb">
            <li>
              <Link to="market-create">
                Type
              </Link>
            </li>
            <li>
              <span className={`${this.state.pageNumber > 0 ? 'active' : ''}`}>Question</span>
            </li>
            <li>
              <span className={`${this.state.pageNumber > 1 ? 'active' : ''}`}>Extra info</span>
            </li>
            <li>
              <span className={`${this.state.pageNumber > 2 ? 'active' : ''}`}>Fees & liquidity</span>
            </li>
            <li>
              <span className={`${this.state.pageNumber > 3 ? 'active' : ''}`}>Review</span>
            </li>
          </ol>
        </div>

        {stepContent}

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

module.exports = MarketCreatePage;
