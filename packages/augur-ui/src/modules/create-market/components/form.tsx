import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";

import { LocationDisplay, Error } from "modules/common/form";
import { 
  BACK, 
  NEXT, 
  CREATE, 
  CUSTOM_CONTENT_PAGES, 
  REVIEW, 
  FORM_DETAILS, 
  LANDING, 
  FEES_LIQUIDITY,
  DESCRIPTION,
  END_TIME,
  EXPIRY_SOURCE,
  HOUR,
  DESIGNATED_REPORTER_ADDRESS,
  VALIDATION_ATTRIBUTES,
  CATEGORIES,
  OUTCOMES,
  SCRATCH, 
  DENOMINATION,
  MIN_PRICE, 
  MAX_PRICE,
  TICK_SIZE,
  AFFILIATE_FEE,
  SETTLEMENT_FEE
} from "modules/create-market/constants";
import { 
  CATEGORICAL,
  SCALAR
} from 'modules/common/constants';
import {
  EXPIRY_SOURCE_SPECIFIC,
  DESIGNATED_REPORTER_SPECIFIC,
  YES_NO_OUTCOMES
} from "modules/common/constants";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import { createMarket } from "modules/contracts/actions/contractCalls";
import { LargeHeader, ExplainerBlock, ContentBlock } from "modules/create-market/components/common";
import { NewMarket, Drafts } from "modules/types";
import FormDetails from "modules/create-market/containers/form-details";
import Review from "modules/create-market/containers/review";
import FeesLiquidity from "modules/create-market/containers/fees-liquidity";
import makePath from "modules/routes/helpers/make-path";
import {
  CREATE_MARKET
} from "modules/routes/constants/views";
import { DEFAULT_STATE } from "modules/markets/reducers/new-market";
import { 
  isBetween, 
  isFilledNumber, 
  isFilledString, 
  checkCategoriesArray,
  checkOutcomesArray,
  isLessThan,
  isMoreThan,
  isPositive
} from "modules/common/validations";

import Styles from "modules/create-market/components/form.styles";

interface FormProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
  addDraft: Function;
  drafts: Drafts;
  updateDraft: Function;
  clearNewMarket: Function;
  discardModal: Function;
}

interface FormState {
  blockShown: Boolean;
}

interface Validations {
  value: any;
  label: string;
  updateValue?: Boolean;
  readableName: string;
  checkBetween?: Boolean; 
  checkFilledNumber?: Boolean;
  checkFilledString?: Boolean;
  min?: Number, 
  max?: Number;
  checkFilledNumberMessage?: string;
  checkFilledStringMessage?: string;
  checkCategories?: Boolean;
  checkOutcomes?: Boolean;
  checkLessThan?: Boolean;
  checkMoreThan?: Boolean;
  checkPositive?: Boolean;
}

export default class Form extends React.Component<
  FormProps,
  FormState
> {
  state: FormState = {
    blockShown: false,
  };

  componentDidMount() {
    this.node.scrollIntoView();
  }

  componentWillUnmount() {
    if (!this.state.blockShown) this.unblock();
  }

  unblock = (cb?: Function) => {
    const {
      drafts,
      newMarket,
      discardModal
    } = this.props;

    const savedDraft = drafts[newMarket.uniqueId];
    const disabledSave = savedDraft && JSON.stringify(newMarket) === JSON.stringify(savedDraft);
    const unsaved = !newMarket.uniqueId && JSON.stringify(newMarket) !== JSON.stringify(DEFAULT_STATE);

    if (unsaved || disabledSave === false) {
      discardModal((close: Boolean) => {
        if (!close) {
          this.props.history.push({
            pathname: makePath(CREATE_MARKET, null),
            state: SCRATCH,
          });
          cb && cb(false);
        } else {
          cb && cb(true);
        }
      });
    } else {
      cb && cb(true);
    }
  }

  prevPage = () => {
    const { newMarket, updateNewMarket, updatePage, clearNewMarket } = this.props;

    if (newMarket.currentStep <= 0) {
      this.unblock((goBack: Boolean) => {
        if (goBack) {
          this.setState({blockShown: true}, () => {
            updatePage(LANDING);
            clearNewMarket();
          });
        }
      });
    }

    const newStep = newMarket.currentStep <= 0 ? 0 : newMarket.currentStep - 1;
    updateNewMarket({ currentStep: newStep });
    this.node.scrollIntoView();
  }

  nextPage = () => {
    const { newMarket, updateNewMarket } = this.props;
    if (this.findErrors()) return;

    const newStep =
      newMarket.currentStep >= CUSTOM_CONTENT_PAGES.length - 1
        ? CUSTOM_CONTENT_PAGES.length - 1
        : newMarket.currentStep + 1;
    updateNewMarket({ currentStep: newStep });
    this.node.scrollIntoView();
  }

  findErrors = () => {
    const { newMarket } = this.props;
    const { 
      currentStep,
      expirySourceType,
      designatedReporterType,
      marketType
    } = newMarket;
    let hasErrors = false; 

    let fields = [];

    if (currentStep === 0) {
      fields = [DESCRIPTION, END_TIME, HOUR, CATEGORIES];
      if (expirySourceType === EXPIRY_SOURCE_SPECIFIC) {
        fields.push(EXPIRY_SOURCE);
      } 
      if (designatedReporterType === DESIGNATED_REPORTER_SPECIFIC) {
        fields.push(DESIGNATED_REPORTER_ADDRESS);
      } 
      if (marketType === CATEGORICAL) {
        fields.push(OUTCOMES);
      }
      if (marketType === SCALAR) {
        fields.push(DENOMINATION, MIN_PRICE, MAX_PRICE, TICK_SIZE);
      }
    } else if (currentStep === 1) {
      fields = [SETTLEMENT_FEE, AFFILIATE_FEE]
    }


    fields.map(field => {
        const error = this.evaluate({
          ...VALIDATION_ATTRIBUTES[field],
          updateValue: false,
          value: newMarket[field], 
        });
        if (error) hasErrors = true;
      }
    );

    return hasErrors;
  }

  isValid = (currentStep) => {
    const { newMarket } = this.props;
    const validations = newMarket.validations[currentStep];
    const validationsArray = Object.keys(validations);
    return validationsArray.every(key => validations[key] === "");
  }

  saveDraft = () => {
    const {
      addDraft, 
      currentTimestamp,
      newMarket,
      updateNewMarket,
      drafts,
      updateDraft
    } = this.props;

    if (newMarket.description === DEFAULT_STATE.description) {
      return;
    }

    if (newMarket.uniqueId && drafts[newMarket.uniqueId]) {
      // update draft
      const updatedDate = Date.now(); // should be currentTimestamp
      const draftMarket = {
        ...newMarket,
        updated: updatedDate
      };
      updateDraft(newMarket.uniqueId, draftMarket);
       updateNewMarket({ 
        updated: updatedDate 
      });
    } else {
      // create new draft
      const createdDate = Date.now(); // should be currentTimestamp
      const draftMarket = {
        ...newMarket,
        uniqueId: createdDate,
        created: createdDate,
        updated: createdDate
      }

      addDraft(createdDate, draftMarket);
      updateNewMarket({ 
        uniqueId: createdDate,
        created: createdDate,
        updated: createdDate 
      });
    }
  }

  submitMarket = () => {
    const { newMarket, address } = this.props;

    createMarket({
      isValid: true,
      validations: newMarket.validations,
      currentStep: newMarket.currentStep,
      type: newMarket.type, // this isn't used
      outcomes: [],
      scalarSmallNum: newMarket.minPrice,
      scalarBigNum: newMarket.maxPrice,
      scalarDenomination: newMarket.scalarDenomination,
      description: newMarket.description,
      expirySourceType: newMarket.expirySourceType,
      expirySource: newMarket.expirySource,
      designatedReporterType: newMarket.designatedReporterType,
      designatedReporterAddress: (newMarket.designatedReporterAddress === "") ? address : newMarket.designatedReporterAddress,
      minPrice: newMarket.minPrice,
      maxPrice: newMarket.maxPrice,
      endTime: newMarket.endTime.unix(), // newMarket.endTime, this is a number (timestamp)
      tickSize: newMarket.tickSize, // maxPrice.tickSize, this needs to be a string
      hour: newMarket.hour,
      minute: newMarket.minute,
      meridiem: newMarket.meridiem,
      marketType: newMarket.marketType,
      detailsText: newMarket.detailsText,
      categories: ["", "", ""],
      settlementFee: 0,
      affiliateFee: 0,
      orderBook: {},
      orderBookSorted: {},
      orderBookSeries: {},
      initialLiquidityEth: 0,
      initialLiquidityGas: 0,
      creationError: ""
    });
  }

  evaluate = (validationsObj: Validations) => {

    const { newMarket } = this.props;

    const {
      checkBetween,
      label,
      value,
      readableName,
      min,
      max,
      checkFilledNumber,
      checkFilledNumberMessage,
      checkFilledString,
      checkFilledStringMessage,
      updateValue,
      checkCategories,
      checkOutcomes,
      checkMoreThan,
      checkLessThan,
      checkPositive
    } = validationsObj;

    const checkValidations = [
      checkFilledNumber ? isFilledNumber(value, readableName, checkFilledNumberMessage) : "",
      checkFilledString ? isFilledString(value, readableName, checkFilledStringMessage) : "",
      checkCategories ? checkCategoriesArray(value) : "",
      checkOutcomes ? checkOutcomesArray(value) : "",
      checkBetween ? isBetween(value, readableName, min, max) : "",
      checkMoreThan ? isMoreThan(value, readableName, newMarket.minPrice) : "",
      checkLessThan ? isLessThan(value, readableName, newMarket.maxPrice) : "",
      checkPositive ? isPositive(value) : "",
    ];
    const errorMsg = checkValidations.find(validation => validation !== "");

    if (errorMsg) {
      this.onError(label, errorMsg);
      return true;
    } 

    // no errors
    if (updateValue) {
      this.onChange(label, value);
    } else {
      this.onError(name, "");
    }
  }

  onChange = (name, value) => {
    const { updateNewMarket, newMarket } = this.props;
    updateNewMarket({ [name]: value });
    
    if (name === 'outcomes') {
      let outcomesFormatted = [];
      if (newMarket.marketType === CATEGORICAL) {
        outcomesFormatted = value.map((outcome, index) => ({
          description: outcome,
          id: index + 1,
          isTradable: true
        }));
        outcomesFormatted.unshift({
          id: 0,
          description: "Invalid",
          isTradable: true,
        })
      } else {
        outcomesFormatted = YES_NO_OUTCOMES;
      }
      updateNewMarket({ outcomesFormatted });
    } else if (name === 'marketType') {
      let outcomesFormatted = [];
      if (value === CATEGORICAL) {
        outcomesFormatted = newMarket.outcomes.map((outcome, index) => ({
          description: outcome,
          id: index,
          isTradable: true
        }));
      } else {
        outcomesFormatted = YES_NO_OUTCOMES;
      }
      updateNewMarket({ outcomesFormatted, orderBook: {}});
    }
    this.onError(name, "");
  }

  onError = (name, error) => {
    const { updateNewMarket, newMarket } = this.props;
    const { currentStep, validations } = newMarket;
    const updatedValidations = validations;
    
    updatedValidations[currentStep][name] = error;
    updateNewMarket({validations: updatedValidations});
  }

  render() {
    const {
      newMarket,
      drafts
    } = this.props;
    const s = this.state;

    const {
      currentStep,
      validations,
      uniqueId
    } = newMarket;

    const { 
      mainContent, 
      explainerBlockTitle, 
      firstButton, 
      secondButton, 
      explainerBlockSubtexts, 
      largeHeader,
      noDarkBackground
    } = CUSTOM_CONTENT_PAGES[currentStep];

    const savedDraft = drafts[uniqueId];
    const disabledSave = savedDraft && JSON.stringify(newMarket) === JSON.stringify(savedDraft);

    const noErrors = Object.values(validations[currentStep]).every(field => (Array.isArray(field) ? field.every(val => val === "" || !val) : !field || field === ''));

    return (
      <div 
        ref={node => {
          this.node = node;
        }}
        className={Styles.Form}
      >
        <LocationDisplay currentStep={currentStep} pages={CUSTOM_CONTENT_PAGES} />
        <LargeHeader text={largeHeader} />
        {explainerBlockTitle && explainerBlockSubtexts && 
          <ExplainerBlock
            title={explainerBlockTitle}
            subtexts={explainerBlockSubtexts}
          />
        }
        <ContentBlock noDarkBackground={noDarkBackground}>
          {mainContent === FORM_DETAILS && <FormDetails onChange={this.onChange} evaluate={this.evaluate} onError={this.onError} />}
          {mainContent === FEES_LIQUIDITY && <FeesLiquidity evaluate={this.evaluate} onChange={this.onChange} onError={this.onError} />}
          {mainContent === REVIEW && <Review />}
          {!noErrors && <Error header="complete all Required fields" subheader="You must complete all required fields highlighted above before you can continue"/>}
          <div>
            {firstButton === BACK && <SecondaryButton text="Back" action={this.prevPage} />}
            <div>
              <SecondaryButton text={disabledSave ? "Saved": "Save draft"} disabled={disabledSave} action={this.saveDraft} />
              {secondButton === NEXT &&  <PrimaryButton text="Next" action={this.nextPage} />}
              {secondButton === CREATE && <PrimaryButton text="Create" action={this.submitMarket} />}
            </div>
          </div>
        </ContentBlock>
      </div>
    );
  }
}
