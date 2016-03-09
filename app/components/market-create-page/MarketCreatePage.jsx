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
let MarketCreateStep3 = require("./MarketCreateStep3");
let MarketCreateStep4 = require("./MarketCreateStep4");

let MarketCreatePage = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("market", "network", "asset")],

  getInitialState: function () {
    return {
      type: null,
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
      minDate: moment().format('YYYY-MM-DD'),
      minValue: null,
      maxValue: null,
      minValueError: null,
      maxValueError: null,
      choices: [],
      choiceErrors: [],
      outcomePrices: [],
      outcomePriceErrors: [],
      outcomePriceGlobalError: null,
      resources: ["", ""],
      tags: ["", ""],
      tagErrors: [null, null],
      expirySource: "generic",
      expirySourceUrl: "",
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
    let tags = this.state.tags.slice();
    let id = parseInt(event.target.getAttribute("data-index"));
    tags[id] = event.target.value;
    this.setState({tags: tags}, () => {
      this.validateStep2(`tags:${id}`);
    });
  },
  validateTag(tag) {
    let isValid = !(/^\s*$/.test(tag));
    let errorMessage = isValid ? null : "Tag cannot be blank";
    return {errorMessage};
  },

  onChangeResourceText: function (event) {
    let resources = this.state.resources.slice();
    let id = parseInt(event.target.getAttribute("data-index"));
    resources[id] = event.target.value;
    this.setState({resources: resources});
  },

  validateTradingFee(tradingFee) {
    let errorMessage = null;
    if (!utilities.isNumeric(tradingFee)) {
      errorMessage = 'Please enter valid trading fee';
    } else if (parseFloat(tradingFee) > 12.5) {
      errorMessage = 'Trading fee must be less than 12.5%';
    } else if (parseFloat(tradingFee) < 0.7) {
      errorMessage = 'Trading fee must be greater than 0.7%';
    }
    return {errorMessage};
  },
  validateMarketInvestment(marketInvestment) {
    let errorMessage = null;
    if (!utilities.isNumeric(marketInvestment)) {
      errorMessage = 'Please enter valid initial liquidity';
    } else if (parseFloat(marketInvestment) > this.state.cash.toNumber()) {
      errorMessage = `Your maximum initial liquidity is ${this.state.cash.toFixed(2)}`;
    } else if (parseFloat(marketInvestment) <= 0) {
      errorMessage = 'Initial liquidity must be greater than 0';
    }

    return {errorMessage};
  },
  validateOutcomePrice(outcomePrice) {
    let errorMessage = null;

    if (!utilities.isNumeric(outcomePrice)) {
      errorMessage = 'Please enter valid price';
    } else {
      let isScalarMarket = this.state.type === "scalar";
      let min = isScalarMarket ? this.state.minValue : 0;
      let max = isScalarMarket ? this.state.maxValue : 100;

      if (parseFloat(outcomePrice) >= max) {
        errorMessage = `Price must be less than ${max}`;
      } else if (parseFloat(outcomePrice) <= min) {
        errorMessage = `Price must be greater than ${min}`;
      }
    }

    return {errorMessage};
  },
  onChangeTradingFee: function (event) {
    this.setState({tradingFee: event.target.value}, () => {
      this.validateStep3("tradingFee");
    });
  },

  onChangeMarketInvestment: function (event) {
    this.setState({marketInvestment: event.target.value}, () => {
      this.validateStep3("marketInvestment");
    });
  },

  onOutcomePriceChange(event) {
    let index = parseInt(event.target.getAttribute("data-index"));
    let outcomePrices = this.state.outcomePrices.slice();
    outcomePrices[index] = event.target.value;

    this.setState({outcomePrices}, () => {
      this.validateStep3(`outcomePrices:${index}`);
    });
  },

  onChangeExpirySource: function (event) {
    this.setState({expirySource: event.target.value}, () => {
      this.validateStep2("expirySource");
    });
  },

  onChangeExpirySourceUrl: function (event) {
    this.setState({expirySourceUrl: event.target.value}, () => {
      this.validateStep2("expirySource");
    });
  },

  goToNextStep: function () {
    let isPageValid = this.validatePage(this.state.pageNumber);
    console.log("validated:", isPageValid);
    if (isPageValid) {
      this.setState({pageNumber: this.state.pageNumber + 1});
    }
  },

  goToPreviousStep: function () {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
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
    let isStepValid = true;

    if (fieldToValidate == null || fieldToValidate == "marketText") {
      let isMarketTextLongEnough = this.state.marketText.length <= this.state.marketTextMaxLength;
      this.setState({
        marketTextError: isMarketTextLongEnough ? null : `Text exceeds the maximum length of ${this.state.marketTextMaxLength}`
      });
      if (!isMarketTextLongEnough) {
        isStepValid = false;
      }

      let isMarketTextSet = this.state.marketText.length > 0;
      this.setState({marketTextError: isMarketTextSet ? null : 'Please enter your question'});
      if (!isMarketTextSet) {
        isStepValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate == "maturationDate") {
      let isMaturationSet = this.state.maturationDate !== '';
      this.setState({maturationDateError: isMaturationSet ? null : 'Please enter maturation date'});
      if (!isMaturationSet) {
        isStepValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate.indexOf("choices") > -1) {
      if (this.state.type === "categorical") {
        let choiceIndex = fieldToValidate == null ? null : fieldToValidate.split(":")[1];
        let choiceErrors = this.state.choiceErrors.slice();
        let choices = choiceIndex != null ? [this.state.choices[choiceIndex]] : this.state.choices.slice();

        // iterates all choices, validating each
        isStepValid = choices.reduce((isStepValid, choice, index) => {
          let validationResult = this.validateChoice(choice);
          choiceErrors[choiceIndex || index] = validationResult.errorMessage;
          return validationResult.errorMessage == null ? isStepValid : false;
        }, isStepValid);

        this.setState({choiceErrors});
      }
    }

    if (fieldToValidate == null || fieldToValidate == "minMax") {
      if (this.state.type === "scalar") {
        let isMinValid = this.checkMinimum();
        let isMaxValid = this.checkMaximum();
        if (!isMinValid || !isMaxValid) {
          isStepValid = false;
        }
      }
    }

    return isStepValid;
  },
  validateStep2(fieldToValidate) {
    let isStepValid = true;

    if (fieldToValidate == null || fieldToValidate == "expirySource") {
      let isExpirySourceValid = true;
      if (this.state.expirySource === "specific") {
        isExpirySourceValid = this.state.expirySourceUrl !== "";
      }
      // no need to display custom error message, UI always contains info
      if (!isExpirySourceValid) {
        isStepValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate.indexOf("tags") > -1) {
      let tagIndex = fieldToValidate == null ? null : fieldToValidate.split(":")[1];
      let tagErrors = this.state.tagErrors.slice();
      let tags = tagIndex != null ? [this.state.tags[tagIndex]] : this.state.tags.slice();

      // iterates all tags, validating each
      isStepValid = tags.reduce((isStepValid, tag, index) => {
        let validationResult = this.validateTag(tag);
        tagErrors[tagIndex || index] = validationResult.errorMessage;
        return validationResult.errorMessage == null ? isStepValid : false;
      }, isStepValid);

      this.setState({tagErrors});
    }

    return isStepValid;
  },
  validateStep3(fieldToValidate) {
    let isStepValid = true;

    if (fieldToValidate == null || fieldToValidate == "tradingFee") {
      let validationResult = this.validateTradingFee(this.state.tradingFee);
      this.setState({tradingFeeError: validationResult.errorMessage});
      if (validationResult.errorMessage != null) {
        isStepValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate == "marketInvestment") {
      let validationResult = this.validateMarketInvestment(this.state.marketInvestment);
      this.setState({marketInvestmentError: validationResult.errorMessage});
      if (validationResult.errorMessage != null) {
        isStepValid = false;
      }
    }

    if (fieldToValidate == null || fieldToValidate.indexOf("outcomePrices") > -1) {
      let outcomePriceIndex = fieldToValidate == null ? null : fieldToValidate.split(":")[1];
      let outcomePriceErrors = this.state.outcomePriceErrors.slice();
      let outcomePrices = outcomePriceIndex != null ? [this.state.outcomePrices[outcomePriceIndex]] : this.state.outcomePrices.slice();

      // iterates all outcomePrices, validating each
      isStepValid = outcomePrices.reduce((isStepValid, outcomePrice, index) => {
        let validationResult = this.validateOutcomePrice(outcomePrice);
        outcomePriceErrors[outcomePriceIndex || index] = validationResult.errorMessage;
        return validationResult.errorMessage == null ? isStepValid : false;
      }, isStepValid);

      let outcomePriceGlobalError = null;
      if (this.state.type !== "scalar") {
        let pricesSum = this.state.outcomePrices.reduce((sum, price) => {
          return isNaN(parseFloat(price)) ? sum : sum + parseFloat(price);
        }, 0);

        if (pricesSum !== 100) {
          // display error message on last input
          outcomePriceGlobalError = "Prices don't add up to 100 %";
          isStepValid = false;
        }
      }

      this.setState({outcomePriceErrors, outcomePriceGlobalError});
    }

    return isStepValid;
  },

  onHide: function () {
    this.setState(this.getInitialState());
  },

  sendNewMarketRequest() {
    var self = this;
    var flux = this.getFlux();
    var newMarketParams = {
      description: this.state.marketText,
      initialLiquidity: this.state.marketInvestment,
      tradingFee: new BigNumber(this.state.tradingFee / 100)
    };
    var source = (this.state.expirySource === "specific") ?
      this.state.expirySourceUrl : this.state.expirySource;
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

    let marketType = this.state.type;
    if (marketType === "binary") {
      minValue = 1;
      maxValue = 2;
      numOutcomes = 2;

    } else if (marketType === "scalar") {
      minValue = this.state.minValue;
      maxValue = this.state.maxValue;
      numOutcomes = 2;

    } else {
      // categorical
      minValue = 1;
      maxValue = 2;
      numOutcomes = this.state.choices.length;
    }

    self.toggleProgressModal();

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
    let tagErrors = this.state.tagErrors.slice();
    let tags = this.state.tags.slice();

    if (tags.length + 1 <= constants.MAX_ALLOWED_TAGS) {
      tags.push('');
      tagErrors.push(null);
      this.setState({ tags, tagErrors });
    }
  },

  onAddResource: function (event) {
    let resources = this.state.resources.slice();
    resources.push('');
    this.setState({ resources });
  },

  onAddAnswer: function (event) {
    var choices = this.state.choices.slice();
    var choiceErrors = this.state.choiceErrors.slice();
    choices.push('');
    choiceErrors.push(null);
    this.setState({ choices, choiceErrors });
  },

  validateChoice: function (choice) {
    let isValid = !(/^\s*$/.test(choice));
    let errorMessage = isValid ? null : "Answer cannot be blank";
    return {errorMessage};
  },

  onChangeAnswerText: function (event) {
    let answerText = event.target.value;
    let id = parseInt(event.target.getAttribute("data-index"));
    let choices = this.state.choices.slice();
    choices[id] = answerText;
    let marketText = this.state.plainMarketText + " Choices: " + choices.join(", ") + ".";
    this.setState({choices, marketText}, () => {
      this.validateStep1(`choices:${id}`);
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

  onMarketTypeChange(event) {
    event.preventDefault();

    let newMarketType = event.currentTarget.getAttribute("data-type");
    console.log("%o", newMarketType);
    let newState = {
      type: newMarketType,
      pageNumber: 1
    };
    switch (newMarketType) {
      case "binary":
        newState.choices = ["Yes", "No"];
        newState.choiceErrors = [null, null];
        break;
      case "categorical":
        newState.choices = ["", ""];
        newState.choiceErrors = [null, null];
        break;
      case "scalar":
        newState.choices = [""];
        newState.choiceErrors = [null];
        break;
      default:
        newState = this.getInitialState();
    }

    this.setState(newState);
  },

  render: function () {
    let marketType = this.state.type,
        stepContent, subheading;

    if (marketType == null) {
      return <MarketCreateIndex
          onMarketTypeChange={this.onMarketTypeChange}
          />;
    }

    if (this.state.pageNumber === 2) {
      stepContent = (
        <MarketCreateStep2
          expirySource={this.state.expirySource}
          expirySourceUrl={this.state.expirySourceUrl}
          onChangeExpirySource={this.onChangeExpirySource}
          onChangeExpirySourceUrl={this.onChangeExpirySourceUrl}
          tags={this.state.tags}
          tagErrors={this.state.tagErrors}
          onAddTag={this.onAddTag}
          onChangeTagText={this.onChangeTagText}
          detailsText={this.state.detailsText}
          onChangeDetailsText={this.onChangeDetailsText}
          resources={this.state.resources}
          onChangeResourceText={this.onChangeResourceText}
          onAddResource={this.onAddResource}
          imageDataURL={this.state.imageDataURL}
          onUploadImageFile={this.onUploadImageFile}
          goToNextStep={this.goToNextStep}
          goToPreviousStep={this.goToPreviousStep}
        />
      );
    } else if (this.state.pageNumber === 3) {
      stepContent = (
        <MarketCreateStep3
            marketType={marketType}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            tradingFee={this.state.tradingFee}
            tradingFeeError={this.state.tradingFeeError}
            onChangeTradingFee={this.onChangeTradingFee}
            marketInvestment={this.state.marketInvestment}
            marketInvestmentError={this.state.marketInvestmentError}
            onChangeMarketInvestment={this.onChangeMarketInvestment}
            choices={this.state.choices}
            outcomePrices={this.state.outcomePrices}
            outcomePriceErrors={this.state.outcomePriceErrors}
            outcomePriceGlobalError={this.state.outcomePriceGlobalError}
            onOutcomePriceChange={this.onOutcomePriceChange}
            goToNextStep={this.goToNextStep}
            goToPreviousStep={this.goToPreviousStep}
        />
      )
    } else if (this.state.pageNumber === 4) {
      stepContent = (
        <MarketCreateStep4
            marketType={marketType}
            marketText={this.state.marketText}
            choices={this.state.choices}
            maturationDate={this.state.maturationDate}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            expirySource={this.state.expirySource}
            expirySourceUrl={this.state.expirySourceUrl}
            tags={this.state.tags}
            detailsText={this.state.detailsText}
            resources={this.state.resources}
            imageDataURL={this.state.imageDataURL}
            tradingFee={this.state.tradingFee}
            marketInvestment={this.state.marketInvestment}
            outcomePrices={this.state.outcomePrices}
            sendNewMarketRequest={this.sendNewMarketRequest}
            goToPreviousStep={this.goToPreviousStep}
            />
          )
    } else {
      stepContent = <MarketCreateStep1
          marketType={marketType}
          marketText={this.state.marketText}
          marketTextError={this.state.marketTextError}
          onChangeMarketText={this.onChangeMarketText}
          categoricalChoices={this.state.choices}
          categoricalChoiceErrors={this.state.choiceErrors}
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
              <a href="#" onClick={this.onMarketTypeChange}>
                Type
              </a>
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
