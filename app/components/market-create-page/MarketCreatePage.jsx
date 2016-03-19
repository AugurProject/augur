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

let MarketCreateIndex = require("./MarketCreateIndex");
let MarketCreateStep1 = require("./MarketCreateStep1");
let MarketCreateStep2 = require("./MarketCreateStep2");
let MarketCreateStep3 = require("./MarketCreateStep3");
let MarketCreateStep4 = require("./MarketCreateStep4");
let MarketCreateStep5 = require("./MarketCreateStep5");

let MarketCreatePage = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("config", "market", "network", "asset")],

  getInitialState: function () {
    return {
      type: null,
      newMarketId: null,
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
      addAnswerDisabled: false,
      outcomePrices: [],
      outcomePriceErrors: [],
      outcomePriceGlobalError: null,
      resources: [],
      resourceErrors: [],
      tags: [],
      tagErrors: [],
      addTagDisabled: false,
      expirySource: "generic",
      expirySourceUrl: "",
      expirySourceUrlError: null,
      newMarketRequestStatus: "",
      newMarketRequestStep: 0,
      newMarketRequestStepCount: 6,
      newMarketRequestDetail: null,
      newMarketRequestComplete: false,
      newMarketRequestSuccess: null
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    return {
      account: flux.store("config").getAccount(),
      cash: flux.store('asset').getState().cash,
      currentBlock: flux.store('network').getState().blockNumber,
      currentBranch: flux.store('branch').getCurrentBranch()
    }
  },

  onChangeMarketText: function (event) {
    let plainMarketText = event.target.value;
    let choices = this.state.choices.slice();
    let marketText = this.state.plainMarketText + " ~|>" + choices.join("|");
    this.setState({marketText, plainMarketText}, () => {
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
    var tags = this.state.tags.slice();
    var id = parseInt(event.target.getAttribute("data-index"));
    var tagText = event.target.value;
    this.checkTagText(tagText, id);
    tags[id] = tagText;
    this.setState({tags: tags}, () => {
      this.validateStep2(`tags:${id}`);
    });
  },
  checkTagText: function (tagText, id) {
    var isOk = !(/^\s*$/.test(tagText));
    var tagErrors = this.state.tagErrors.slice();
    tagErrors[id] = (isOk) ? null : "Tag cannot be blank";
    this.setState({tagErrors: tagErrors})
    return isOk;
  },

  onChangeResourceText: function (event) {
    var resources = this.state.resources.slice();
    var id = parseInt(event.target.getAttribute("data-index"));
    var resourceText = event.target.value;
    this.checkResourceText(resourceText, id);
    resources[id] = resourceText;
    this.setState({resources: resources});
  },
  checkResourceText: function (resourceText, id) {
    var isOk = !(/^\s*$/.test(resourceText));
    var resourceErrors = this.state.resourceErrors.slice();
    resourceErrors[id] = (isOk) ? null : "Resource cannot be blank";
    this.setState({resourceErrors: resourceErrors})
    return isOk;
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
      this.validateStep2("expirySourceUrl");
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
    this.setState({pageNumber: this.state.pageNumber - 1});
  },

  /**
   * This goes straight to the step, doesn't validate anything
   */
  goToStep(step) {
    this.setState({pageNumber: step});
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
      if (this.state.expirySource === "generic") {
        this.setState({expirySourceUrlError: null});
      }
    }

    if (fieldToValidate == null || fieldToValidate == "expirySourceUrl") {
      let isExpirySourceUrlValid = true;
      if (this.state.expirySource === "specific") {
        if (this.state.expirySourceUrl === "") {
          isExpirySourceUrlValid = false;
        }
      }
      this.setState({expirySourceUrlError: isExpirySourceUrlValid ? null : "Please enter the full URL of the website"});
      if (!isExpirySourceUrlValid) {
        isStepValid = false;
      }
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

    /*if (fieldToValidate == null || fieldToValidate.indexOf("outcomePrices") > -1) {
      let outcomePriceIndex = fieldToValidate == null ? null : fieldToValidate.split(":")[1];
      let outcomePriceErrors = this.state.outcomePriceErrors.slice();
      let outcomePrices = this.state.outcomePrices.slice();

      let validationResults = outcomePrices.map(this.validateOutcomePrice, this);
      let arePricesValid = validationResults.every(result => result.errorMessage == null);

      if (outcomePriceIndex != null) {
        outcomePriceErrors[outcomePriceIndex] = validationResults[outcomePriceIndex].errorMessage;
        if (validationResults[outcomePriceIndex].errorMessage != null) {
          isStepValid = false;
        }
      } else {
        if (!arePricesValid) {
          isStepValid = false;
        }
        validationResults.forEach((result, index) => {
          outcomePriceErrors[outcomePriceIndex || index] = result.errorMessage;
        });
      }

      let outcomePriceGlobalError = null;
      if (this.state.type !== "scalar") {
        if (arePricesValid) {
          let pricesSum = this.state.outcomePrices.reduce((sum, price) => sum + parseFloat(price), 0);

          if (pricesSum !== 100) {
            outcomePriceGlobalError = "Prices don't add up to 100 %";
            isStepValid = false;
          }
        }
      }

      this.setState({outcomePriceErrors, outcomePriceGlobalError});
    }*/

    return isStepValid;
  },

  sendNewMarketRequest() {
    this.setState({
      newMarketRequestDetail: null,
      newMarketRequestComplete: false,
      newMarketRequestSuccess: null,
      newMarketRequestStatus: "Sending request",
      newMarketRequestStep: 1
    });

    var self = this;
    var flux = this.getFlux();
    var newMarketParams = {
      description: this.state.marketText,
      initialLiquidity: this.state.marketInvestment,
      tradingFee: new BigNumber(this.state.tradingFee / 100)
    };
    var source = (this.state.expirySource === "specific") ? this.state.expirySourceUrl : this.state.expirySource;
    var pendingId = flux.actions.market.addPendingMarket(newMarketParams);
    var branchId = flux.store("branch").getCurrentBranch().id;
    var block = flux.store("network").getState().blockNumber;
    var metadata = {
      image: this.state.imageDataURL,
      details: this.state.detailsText,
      tags: this.state.tags,
      links: this.state.resources
    };
    let isMarketCallSuccess, isMetaDataSuccess;
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
        self.setState({
          newMarketRequestStep: 2,
          newMarketRequestStatus: "New market submitted.<br />Market ID: <small>" + r.callReturn + "</small><br />Waiting for confirmation...",
          newMarketRequestDetail: r
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
          self.setState({
            newMarketRequestStep: 3,
            newMarketRequestStatus: "Uploading market metadata...",
            newMarketRequestDetail: res
          });
        }, function (res) {
          isMetaDataSuccess = true;
          console.log("ramble.addMetadata success:", res);
          var requestStep = (isMarketCallSuccess) ? 5 : 4;
          self.setState({
            newMarketRequestStep: requestStep,
            newMarketId: marketId,
            newMarketRequestComplete: isMarketCallSuccess,
            newMarketRequestSuccess: isMarketCallSuccess,
            newMarketRequestStatus: isMarketCallSuccess ? "Your market has been successfully created!" : "Market metadata uploaded",
            newMarketRequestDetail: res
          });
        }, function (err) {
          console.error("ramble.addMetadata:", err);
          self.setState({
            newMarketRequestStatus: "Market metadata upload failed.",
            newMarketRequestDetail: err,
            newMarketRequestSuccess: false,
            newMarketRequestComplete: true
          });
        });
      },
      onSuccess: function (r) {
        isMarketCallSuccess = true;
        console.log("new market ID:", r.callReturn);
        var marketId = abi.bignum(r.callReturn);
        var requestStep = (isMetaDataSuccess) ? 5 : 4;
        self.setState({
          newMarketId: marketId,
          newMarketRequestStep: requestStep,
          newMarketRequestComplete: isMetaDataSuccess,
          newMarketRequestSuccess: isMetaDataSuccess,
          newMarketRequestStatus: isMetaDataSuccess ? "Your market has been successfully created!" : "New market confirmed.",
          newMarketRequestDetail: r
        });
        flux.actions.market.deleteMarket(pendingId);
        flux.actions.market.loadMarket(marketId);
      },
      onFailed: function (r) {
        console.error("market creation failed:", r);
        self.setState({
          newMarketRequestStatus: "Your market could not be created.",
          newMarketRequestDetail: r,
          newMarketRequestComplete: true,
          newMarketRequestSuccess: false
        });
        flux.actions.market.deleteMarket(pendingId);
      }
    });
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
    var numTags = this.state.tags.length + 1;
    if (numTags <= constants.MAX_ALLOWED_TAGS) {
      var tags = this.state.tags.slice();
      var tagErrors = this.state.tagErrors.slice();
      tags.push('');
      tagErrors.push(null);
      this.setState({
        tags: tags,
        tagErrors: tagErrors,
        addTagDisabled: numTags === constants.MAX_ALLOWED_TAGS
      });
    }
  },

  onAddResource: function (event) {
    var numResources = this.state.resources.length + 1;
    var resources = this.state.resources.slice();
    var resourceErrors = this.state.resourceErrors;
    resources.push('');
    resourceErrors.push(null);
    this.setState({
      resources: resources,
      resourceErrors: resourceErrors
    });
  },

  onAddAnswer: function (event) {
    event.preventDefault();
    var numOutcomes = this.state.choices.length + 1;
    if (numOutcomes <= constants.MAX_ALLOWED_OUTCOMES) {
      var choices = this.state.choices.slice();
      var outcomePrices = this.state.outcomePrices.slice();
      var choiceErrors = this.state.choiceErrors.slice();
      choices.push('');
      outcomePrices.push(null);
      choiceErrors.push(null);
      this.setState({
        choices: choices,
        choiceErrors: choiceErrors,
        addAnswerDisabled: numOutcomes === constants.MAX_ALLOWED_OUTCOMES
      });
    }
  },
  onRemoveAnswer: function (event) {
    event.preventDefault();
    let index = parseInt(event.currentTarget.getAttribute("data-index"));
    let choices = this.state.choices.slice();
    choices.splice(index, 1);
    let outcomePrices = this.state.outcomePrices.slice();
    outcomePrices.splice(index, 1);
    let choiceErrors = this.state.choiceErrors.slice();
    choiceErrors.splice(index, 1);
    var numOutcomes = this.state.choices.length - 1;
    this.setState({
      numOutcomes: numOutcomes,
      choices,
      outcomePrices,
      choiceErrors,
      addAnswerDisabled: numOutcomes === constants.MAX_ALLOWED_OUTCOMES
    });
  },
  onChangeAnswerText: function (event) {
    let answerText = event.target.value;
    let id = parseInt(event.target.getAttribute("data-index"));
    let choices = this.state.choices.slice();
    this.checkAnswerText(answerText, id);
    choices[id] = answerText;
    let marketText = this.state.plainMarketText + " ~|>" + choices.join("|");
    this.setState({choices, marketText}, () => {
      this.validateStep1(`choices:${id}`);
    });
  },
  checkAnswerText: function (answerText, id) {
    var isOk = !(/^\s*$/.test(answerText));
    var choiceErrors = this.state.choiceErrors.slice();
    choiceErrors[id] = (isOk) ? null : "Answer cannot be blank";
    this.setState({choiceErrors: choiceErrors})
    return isOk;
  },
  validateChoice: function (choice) {
    let isValid = !(/^\s*$/.test(choice));
    let errorMessage = isValid ? null : "Answer cannot be blank";
    return {errorMessage};
  },

  onChangeMinimum: function (event) {
    var minValue = event.target.value;
    if (utilities.isNumeric(minValue)) minValue = abi.number(minValue);
    this.setState({minValue: minValue}, () => {
      this.validateStep1("minMax");
    });
    this.checkMinimum(minValue);
  },
  onChangeMaximum: function (event) {
    var maxValue = event.target.value;
    if (utilities.isNumeric(maxValue)) maxValue = abi.number(maxValue);
    this.setState({maxValue: maxValue}, () => {
      this.validateStep1("minMax");
    });
    this.checkMaximum(maxValue);
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

  onMarketTypeChange(event) {
    event.preventDefault();

    let newMarketType = event.currentTarget.getAttribute("data-type");
    let newState = {
      type: newMarketType,
      pageNumber: 1
    };
    switch (newMarketType) {
      case "binary":
        newState.choices = ["Yes", "No"];
        newState.outcomePrices = [null, null];
        newState.choiceErrors = [null, null];
        break;
      case "categorical":
        newState.choices = ["", ""];
        newState.outcomePrices = [null, null];
        newState.choiceErrors = [null, null];
        break;
      case "scalar":
        newState.choices = [""];
        newState.outcomePrices = [null];
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

    if (this.state.account == null || this.state.cash == null || this.state.cash.toNumber() <= 0) {
      return (
        <div>
          You can't open market because you don't have enough cash.
        </div>
      );
    }

    if (marketType == null) {
      return <MarketCreateIndex
          onMarketTypeChange={this.onMarketTypeChange}
          />;
    }

    if (this.state.pageNumber === 1) {
      stepContent = <MarketCreateStep1
          marketType={marketType}
          marketText={this.state.plainMarketText}
          marketTextError={this.state.marketTextError}
          onChangeMarketText={this.onChangeMarketText}
          choices={this.state.choices}
          choiceErrors={this.state.choiceErrors}
          onChangeChoice={this.onChangeAnswerText}
          onAddCategoricalOutcome={this.onAddAnswer}
          onRemoveCategoricalOutcome={this.onRemoveAnswer}
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
          onMarketTypeChange={this.onMarketTypeChange}
          marketTextMaxLength={this.state.marketTextMaxLength}
          />
    } else if (this.state.pageNumber === 2) {
      stepContent = (
        <MarketCreateStep2
          marketText={this.state.marketText}
          expirySource={this.state.expirySource}
          expirySourceUrl={this.state.expirySourceUrl}
          expirySourceUrlError={this.state.expirySourceUrlError}
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
            confirmNewMarketModalOpen={this.props.confirmNewMarketModalOpen}
            toggleConfirmNewMarketModal={this.props.toggleConfirmNewMarketModal}
            goToNextStep={this.goToNextStep}
            goToStep={this.goToStep}
            goToPreviousStep={this.goToPreviousStep}
            />
          )
    } else if (this.state.pageNumber === 5) {
      stepContent = <MarketCreateStep5
          sendNewMarketRequest={this.sendNewMarketRequest}
          goToPreviousStep={this.goToPreviousStep}
          newMarketId={this.state.newMarketId}
          newMarketRequestStep={this.state.newMarketRequestStep}
          newMarketRequestStepCount={this.state.newMarketRequestStepCount}
          newMarketRequestComplete={this.state.newMarketRequestComplete}
          newMarketRequestDetail={this.state.newMarketRequestDetail}
          newMarketRequestStatus={this.state.newMarketRequestStatus}
          newMarketRequestSuccess={this.state.newMarketRequestSuccess}
        />
    }

    return (
      <div>
        {stepContent}
      </div>
    );
  }
});

module.exports = MarketCreatePage;
