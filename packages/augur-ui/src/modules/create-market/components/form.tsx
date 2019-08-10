import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import { LocationDisplay, Error } from 'modules/common/form';
import {
  BACK,
  NEXT,
  CREATE,
  CUSTOM_CONTENT_PAGES,
  TEMPLATE_CONTENT_PAGES,
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
  SETTLEMENT_FEE,
  SUB_CATEGORIES,
} from 'modules/create-market/constants';
import {
  CATEGORICAL,
  SCALAR,
  BID,
  SELL,
  BUY,
  EXPIRY_SOURCE_SPECIFIC,
  DESIGNATED_REPORTER_SPECIFIC,
  YES_NO_OUTCOMES,
  NEW_ORDER_GAS_ESTIMATE,
} from 'modules/common/constants';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import {
  LargeHeader,
  ExplainerBlock,
  ContentBlock,
} from 'modules/create-market/components/common';
import { NewMarket, Drafts } from 'modules/types';
import FormDetails from 'modules/create-market/containers/form-details';
import Review from 'modules/create-market/containers/review';
import FeesLiquidity from 'modules/create-market/containers/fees-liquidity';
import SubCategories from 'modules/create-market/containers/sub-categories';
import makePath from 'modules/routes/helpers/make-path';
import { CREATE_MARKET, MY_POSITIONS } from 'modules/routes/constants/views';
import { DEFAULT_STATE } from 'modules/markets/reducers/new-market';
import {
  isBetween,
  isFilledNumber,
  isFilledString,
  checkCategoriesArray,
  checkOutcomesArray,
  isLessThan,
  isMoreThan,
  isPositive,
  moreThanDecimals,
  checkAddress,
} from 'modules/common/validations';
import { formatDate, buildformattedDate } from 'utils/format-date';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { createBigNumber } from 'utils/create-big-number';

import Styles from 'modules/create-market/components/form.styles';

import MarketView from 'modules/market/components/market-view/market-view';

interface FormProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  address: string;
  updatePage: Function;
  addDraft: Function;
  drafts: Drafts;
  updateDraft: Function;
  clearNewMarket: Function;
  discardModal: Function;
  template: boolean;
  openCreateMarketModal: Function;
}

interface FormState {
  blockShown: Boolean;
  contentPages: Array<any>;
}

interface Validations {
  value: any;
  label: string;
  updateValue?: Boolean;
  readableName: string;
  checkBetween?: Boolean;
  checkFilledNumber?: Boolean;
  checkFilledString?: Boolean;
  min?: Number;
  max?: Number;
  checkFilledNumberMessage?: string;
  checkFilledStringMessage?: string;
  checkCategories?: Boolean;
  checkOutcomes?: Boolean;
  checkLessThan?: Boolean;
  checkMoreThan?: Boolean;
  checkPositive?: Boolean;
  lessThanMessage?: string;
  decimals?: number;
  checkDecimals?: Boolean;
  checkForAdresss?: Boolean;
}

const draftError = 'ENTER A MARKET QUESTION';

export default class Form extends React.Component<FormProps, FormState> {
  state: FormState = {
    blockShown: false,
    contentPages: this.props.template
      ? TEMPLATE_CONTENT_PAGES
      : CUSTOM_CONTENT_PAGES,
    showPreview: false,
  };

  componentDidMount() {
    this.node.scrollIntoView();
  }

  componentWillUnmount() {
    if (!this.state.blockShown) this.unblock();
  }

  unblock = (cb?: Function) => {
    const { drafts, newMarket, discardModal } = this.props;

    const savedDraft = drafts[newMarket.uniqueId];

    let defaultState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    defaultState.validations = [];

    let market = JSON.parse(JSON.stringify(newMarket));
    market.validations = [];

    const disabledSave =
      savedDraft && JSON.stringify(newMarket) === JSON.stringify(savedDraft);
    const unsaved =
      !newMarket.uniqueId &&
      JSON.stringify(market) !== JSON.stringify(defaultState);

    if (unsaved && !disabledSave) {
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
  };

  prevPage = () => {
    const {
      newMarket,
      updateNewMarket,
      updatePage,
      clearNewMarket,
      template,
    } = this.props;

    const firstPage = template ? 1 : 0;
    if (newMarket.currentStep <= firstPage) {
      this.unblock((goBack: Boolean) => {
        if (goBack) {
          this.setState({ blockShown: true }, () => {
            updatePage(LANDING);
            clearNewMarket();
          });
        }
      });
    }

    const newStep = newMarket.currentStep <= 0 ? 0 : newMarket.currentStep - 1;
    updateNewMarket({ currentStep: newStep });
    this.node.scrollIntoView();
  };

  nextPage = () => {
    const { newMarket, updateNewMarket, template } = this.props;
    const { contentPages } = this.state;

    if (this.findErrors()) return;

    const newStep =
      newMarket.currentStep >= contentPages.length - 1
        ? contentPages.length - 1
        : newMarket.currentStep + 1;
    updateNewMarket({ currentStep: newStep });
    this.node.scrollIntoView();
  };

  updateInitialLiquidityCosts = (order, shouldReduce) => {
    const { newMarket, updateNewMarket } = this.props;
    const minPrice = newMarket.marketType === SCALAR ? newMarket.minPrice : 0;
    const maxPrice = newMarket.marketType === SCALAR ? newMarket.maxPrice : 1;
    const shareBalances = newMarket.outcomes.map(outcome => 0);
    let outcome;
    let initialLiquidityDai;
    let initialLiquidityGas;

    switch (newMarket.marketType) {
      case CATEGORICAL:
        newMarket.outcomes.forEach((outcomeName, index) => {
          if (order.outcome === outcomeName) outcome = index;
        });
        break;
      case SCALAR:
        ({ outcome } = order);
        break;
      default:
        outcome = 1;
        break;
    }

    const orderType = order.type === BID ? BUY : SELL;

    // Calculate amount of DAI needed for order
    const totalCost = calculateTotalOrderValue(
      order.quantity,
      order.price,
      orderType,
      minPrice,
      maxPrice,
      newMarket.marketType
    );

    // NOTE: Fees are going to always be 0 because we are only opening orders, and there is no costs associated with opening orders other than the escrowed ETH and the gas to put the order up.
    if (shouldReduce) {
      initialLiquidityDai = createBigNumber(
        newMarket.initialLiquidityDai
      ).minus(totalCost);
      initialLiquidityGas = createBigNumber(
        newMarket.initialLiquidityGas
      ).minus(NEW_ORDER_GAS_ESTIMATE);
    } else {
      initialLiquidityDai = createBigNumber(newMarket.initialLiquidityDai).plus(
        totalCost
      );
      initialLiquidityGas = createBigNumber(newMarket.initialLiquidityGas).plus(
        NEW_ORDER_GAS_ESTIMATE
      );
    }

    updateNewMarket({ initialLiquidityDai, initialLiquidityGas });
  };

  findErrors = () => {
    const { newMarket } = this.props;
    const {
      currentStep,
      expirySourceType,
      designatedReporterType,
      marketType,
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
      fields = [SETTLEMENT_FEE, AFFILIATE_FEE];
    }

    fields.map(field => {
      const error = this.evaluate({
        ...VALIDATION_ATTRIBUTES[field],
        updateValue: false,
        value: newMarket[field],
      });
      if (error) hasErrors = true;
    });

    return hasErrors;
  };

  isValid = currentStep => {
    const { newMarket } = this.props;
    const validations = newMarket.validations[currentStep];
    const validationsArray = Object.keys(validations);
    return validationsArray.every(key => validations[key] === '');
  };

  saveDraft = () => {
    const {
      addDraft,
      currentTimestamp,
      newMarket,
      updateNewMarket,
      drafts,
      updateDraft,
    } = this.props;

    if (newMarket.description === DEFAULT_STATE.description) {
      this.onError('description', draftError);
      return;
    }

    if (newMarket.uniqueId && drafts[newMarket.uniqueId]) {
      // update draft
      const updatedDate = currentTimestamp;
      const draftMarket = {
        ...newMarket,
        updated: updatedDate,
      };
      updateDraft(newMarket.uniqueId, draftMarket);
      updateNewMarket({
        updated: updatedDate,
      });
    } else {
      // create new draft
      const createdDate = currentTimestamp;
      const draftMarket = {
        ...newMarket,
        uniqueId: createdDate,
        created: createdDate,
        updated: createdDate,
      };

      addDraft(createdDate, draftMarket);
      updateNewMarket({
        uniqueId: createdDate,
        created: createdDate,
        updated: createdDate,
      });
    }
  };

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
      checkPositive,
      lessThanMessage,
      checkDecimals,
      decimals,
      checkForAddress,
    } = validationsObj;

    const checkValidations = [
      checkFilledNumber
        ? isFilledNumber(value, readableName, checkFilledNumberMessage)
        : '',
      checkFilledString
        ? isFilledString(value, readableName, checkFilledStringMessage)
        : '',
      checkCategories ? checkCategoriesArray(value) : '',
      checkOutcomes ? checkOutcomesArray(value) : '',
      checkBetween ? isBetween(value, readableName, min, max) : '',
      checkMoreThan ? isMoreThan(value, readableName, newMarket.minPrice) : '',
      checkLessThan
        ? isLessThan(value, readableName, newMarket.maxPrice, lessThanMessage)
        : '',
      checkPositive ? isPositive(value) : '',
      checkDecimals ? moreThanDecimals(value, decimals) : '',
      checkForAddress ? checkAddress(value) : '',
    ];
    const errorMsg = checkValidations.find(validation => validation !== '');

    if (errorMsg) {
      this.onError(label, errorMsg);
      return true;
    }

    // no errors
    if (updateValue) {
      this.onChange(label, value);
    } else {
      this.onError(name, '');
    }
  };

  onChange = (name, value, callback) => {
    const { updateNewMarket, newMarket } = this.props;
    updateNewMarket({ [name]: value });

    if (name === 'outcomes') {
      let outcomesFormatted = [];
      if (newMarket.marketType === CATEGORICAL) {
        outcomesFormatted = value.map((outcome, index) => ({
          description: outcome,
          id: index + 1,
          isTradable: true,
        }));
        outcomesFormatted.unshift({
          id: 0,
          description: 'Invalid',
          isTradable: true,
        });
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
          isTradable: true,
        }));
      } else {
        outcomesFormatted = YES_NO_OUTCOMES;
      }
      updateNewMarket({ outcomesFormatted, orderBook: {} });
    } else if (
      name === 'setEndTime' ||
      name === 'hour' ||
      name === 'minute' ||
      name === 'meridiem' ||
      name === 'timezoneDropdown' ||
      name === 'timeSelector'
    ) {
      // timezone needs to be set on NewMarket object, this value is used to set timezone picker default value
      const setEndTime =
        name === 'setEndTime' ? value : newMarket.setEndTime;
      let hour = name === 'hour' ? value : newMarket.hour;
      let minute = name === 'minute' ? value : newMarket.minute;
      let meridiem = name === 'meridiem' ? value : newMarket.meridiem;
      let offset = newMarket.offset;
      let offsetName = newMarket.offsetName;
      let timezone = newMarket.timezone;

      if (name === "timeSelector") {
        hour = value.hour || hour;
        minute = value.minute || minute;
        meridiem = value.meridiem || meridiem;
      }
      if (name === "timezoneDropdown") {
        offset = value.offset;
        offsetName = value.offsetName;
        timezone = value.timezone;
      }
      const endTimeFormatted = buildformattedDate(
        setEndTime,
        hour,
        minute,
        meridiem,
        offsetName,
        offset
      );

      updateNewMarket({ endTimeFormatted, setEndTime, hour, minute, meridiem, offset, offsetName, timezone });
    }
    this.onError(name, '');
    if (callback) callback(name);
  };

  onError = (name, error) => {
    const { updateNewMarket, newMarket } = this.props;
    const { currentStep, validations } = newMarket;
    const updatedValidations = validations;

    updatedValidations[currentStep][name] = error;
    updateNewMarket({ validations: updatedValidations });
  };

  preview = () => {
    this.setState({ showPreview: !this.state.showPreview }, () => {
      this.node.scrollIntoView();
    });
  };

  render() {
    const {
      newMarket,
      drafts,
      template,
      openCreateMarketModal,
      history
    } = this.props;
    const { contentPages } = this.state;

    const { currentStep, validations, uniqueId } = newMarket;

    const {
      mainContent,
      explainerBlockTitle,
      firstButton,
      secondButton,
      explainerBlockSubtexts,
      largeHeader,
      noDarkBackground,
      previewButton,
    } = contentPages[currentStep];

    const savedDraft = drafts[uniqueId];
    const disabledSave =
      savedDraft && JSON.stringify(newMarket) === JSON.stringify(savedDraft);

    const noErrors = Object.values(
      (validations && validations[currentStep]) || {}
    ).every(field =>
      Array.isArray(field)
        ? field.every(val => val === '' || !val)
        : !field || field === ''
    );
    const saveDraftError =
      validations &&
      validations[currentStep] &&
      validations[currentStep].description === draftError;

    return (
      <div
        ref={node => {
          this.node = node;
        }}
        className={classNames(Styles.Form, {
          [Styles.Preview]: this.state.showPreview,
        })}
      >
        {this.state.showPreview && (
          <div>
            <span>Your market preview</span>
            <PrimaryButton text="Close preview" action={this.preview} />
            <MarketView market={newMarket} preview />
            <PrimaryButton text="Close preview" action={this.preview} />
          </div>
        )}
        {!this.state.showPreview && (
          <>
            <LocationDisplay currentStep={currentStep} pages={contentPages} />
            <LargeHeader text={largeHeader} />
            {previewButton && (
              <PrimaryButton text="Preview your market" action={this.preview} />
            )}
            {explainerBlockTitle && explainerBlockSubtexts && (
              <ExplainerBlock
                title={explainerBlockTitle}
                subtexts={explainerBlockSubtexts}
              />
            )}
            <ContentBlock noDarkBackground={noDarkBackground}>
              {mainContent === FORM_DETAILS && (
                <FormDetails onChange={this.onChange} onError={this.onError} />
              )}
              {mainContent === FEES_LIQUIDITY && (
                <FeesLiquidity
                  onChange={this.onChange}
                  onError={this.onError}
                  updateInitialLiquidityCosts={this.updateInitialLiquidityCosts}
                />
              )}
              {mainContent === REVIEW && <Review />}
              {mainContent === SUB_CATEGORIES && <SubCategories />}
              {saveDraftError && (
                <Error
                  header="Unable to save draft"
                  subheader="Enter a market question to save this market as a draft"
                />
              )}
              {!noErrors && !saveDraftError && (
                <Error
                  header="complete all Required fields"
                  subheader="You must complete all required fields highlighted above before you can continue"
                />
              )}
              <div>
                {firstButton === BACK && (
                  <SecondaryButton text="Back" action={this.prevPage} />
                )}
                <div>
                  <SecondaryButton
                    text={disabledSave ? 'Saved' : 'Save draft'}
                    disabled={disabledSave}
                    action={this.saveDraft}
                  />
                  {secondButton === NEXT && (
                    <PrimaryButton text="Next" action={this.nextPage} />
                  )}
                  {secondButton === CREATE && (
                    <PrimaryButton text="Create" action={() => {
                      openCreateMarketModal(() => {
                        this.setState({blockShown: true}, () => {
                          history.push({
                            pathname: makePath(MY_POSITIONS, null),
                          });
                        });
                      })
                    }} />
                  )}
                </div>
              </div>
            </ContentBlock>
          </>
        )}
      </div>
    );
  }
}
