import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import {
  CATEGORICAL,
  DESIGNATED_REPORTER_SPECIFIC,
  NON_EXISTENT,
  ONE,
  SCALAR,
  SCALAR_OUTCOMES,
  WALLET_STATUS_VALUES,
  YES_NO_OUTCOMES,
  ZERO,
} from 'modules/common/constants';

import { Error, LocationDisplay } from 'modules/common/form';
import { BulkTxLabel } from 'modules/common/labels';
import {
  checkAddress,
  checkCategoriesArray,
  checkForUserInputFilled,
  checkOutcomesArray,
  dateGreater,
  dividedBy,
  isBetween,
  isCheckWholeNumber,
  isFilledNumber,
  isFilledString,
  isLessThan,
  isMoreThan,
  isPositive,
  isValidFee,
  moreThanDecimals,
} from 'modules/common/validations';
import {
  ContentBlock,
  ExplainerBlock,
  LargeHeader,
  MultipleExplainerBlock,
} from 'modules/create-market/components/common';

import Styles from 'modules/create-market/components/form.styles.less';
import { MarketType } from 'modules/create-market/components/market-type';
import {
  AFFILIATE_FEE,
  BACK,
  CATEGORIES,
  CREATE,
  CUSTOM_CONTENT_PAGES,
  DENOMINATION,
  DESCRIPTION,
  DESIGNATED_REPORTER_ADDRESS,
  EMPTY_STATE,
  END_TIME,
  FEES_LIQUIDITY,
  FORM_DETAILS,
  HOUR,
  LANDING,
  MARKET_TYPE,
  MAX_PRICE,
  MIN_PRICE,
  MovieWednesdayAfterOpeningMessage,
  NEXT,
  OUTCOMES,
  REVIEW,
  SCRATCH,
  SETTLEMENT_FEE,
  SUB_CATEGORIES,
  TEMPLATE,
  TEMPLATE_FORM_DETAILS,
  TEMPLATE_INPUTS,
  TEMPLATE_PICKER,
  TICK_SIZE,
  VALIDATION_ATTRIBUTES,
  EventDetailsContent,
  ReviewContent,
  AugurMarketsContent,
} from 'modules/create-market/constants';
import FeesLiquidity from 'modules/create-market/containers/fees-liquidity';
import FormDetails from 'modules/create-market/containers/form-details';
import Review from 'modules/create-market/containers/review';
import SubCategories from 'modules/create-market/containers/sub-categories';
import TemplatePicker from 'modules/create-market/containers/template-picker';
import {
  buildResolutionDetails,
  getFormattedOutcomes,
  hasNoTemplateCategoryChildren,
  hasNoTemplateCategoryTertiaryChildren,
} from 'modules/create-market/get-template';
import {
  NO_CAT_TEMPLATE_CONTENT_PAGES,
  TEMPLATE_CONTENT_PAGES,
} from 'modules/create-market/template-navigation';

import MarketView from 'modules/market/components/market-view/market-view';
import { selectSortedMarketOutcomes } from 'modules/markets/selectors/market';
import {
  CREATE_MARKET_FORM_PARAM_NAME,
  CREATE_MARKET_PORTFOLIO,
} from 'modules/routes/constants/param-names';
import { CREATE_MARKET, MY_POSITIONS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import makeQuery from 'modules/routes/helpers/make-query';
import { Drafts, NewMarket } from 'modules/types';
import React from 'react';
import { createBigNumber } from 'utils/create-big-number';
import deepClone from 'utils/deep-clone';
import {
  buildformattedDate,
  convertUnixToFormattedDate,
} from 'utils/format-date';
import type {
  TemplateInput,
} from '@augurproject/templates';
import {
  TemplateInputType,
  ValidationType,
  getTemplateWednesdayAfterOpeningDay,
} from '@augurproject/templates';

interface FormProps {
  newMarket: NewMarket;
  updateNewMarket: (newMarketData: NewMarket) => void;
  address: string;
  updatePage: (page: string) => void;
  addDraft: Function;
  drafts: Drafts;
  updateDraft: Function;
  clearNewMarket: () => void;
  removeAllOrdersFromNewMarket: () => void;
  discardModal: Function;
  isTemplate: boolean;
  openCreateMarketModal: Function;
  currentTimestamp: number;
  needsApproval: boolean;
  marketCreationStarted: Function;
  marketCreationSaved: Function;
  maxMarketEndTime: number;
  GsnEnabled: boolean;
  gsnUnavailable: boolean;
  gsnWalletInfoSeen: boolean;
  initializeGsnWallet: Function;
  walletStatus: string;
}

interface FormState {
  blockShown: Boolean;
  contentPages: any[];
  templateFormStarts: number;
  disableCreate: boolean;
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
  checkDateGreaterMessage?: string;
  checkCategories?: Boolean;
  checkOutcomes?: Boolean;
  checkLessThan?: Boolean;
  checkDividedBy?: Boolean;
  checkMoreThan?: Boolean;
  checkPositive?: Boolean;
  checkDateGreater?: Boolean;
  lessThanMessage?: string;
  decimals?: number;
  checkDecimals?: Boolean;
  checkForAdresss?: Boolean;
  checkUserInputFilled?: Boolean;
  checkFee?: Boolean;
  checkForAddress?: Boolean;
  checkWholeNumber?: Boolean;
}

const draftError = 'ENTER A MARKET QUESTION';

export default class Form extends React.Component<FormProps, FormState> {
  state: FormState = {
    blockShown: false,
    templateFormStarts: hasNoTemplateCategoryChildren(
      this.props.newMarket.navCategories[0]
    )
      ? 3
      : 4,
    contentPages: this.props.isTemplate
      ? hasNoTemplateCategoryChildren(this.props.newMarket.navCategories[0])
        ? NO_CAT_TEMPLATE_CONTENT_PAGES
        : TEMPLATE_CONTENT_PAGES
      : CUSTOM_CONTENT_PAGES,
    showPreview: false,
    disableCreate: false,
  };

  componentDidMount() {
    window.scrollTo(0, 1);
  }

  componentWillUnmount() {
    if (!this.state.blockShown) this.unblock();
  }

  unblock = (cb?: Function) => {
    const {
      drafts,
      newMarket,
      discardModal,
      isTemplate,
      clearNewMarket,
    } = this.props;

    const savedDraft = drafts[newMarket.uniqueId];

    let defaultState = deepClone<NewMarket>(EMPTY_STATE);
    defaultState.validations = [];

    let market = deepClone<NewMarket>(newMarket);
    market.validations = [];
    market.currentStep = isTemplate ? this.state.templateFormStarts : 0;

    const disabledSave =
      savedDraft && JSON.stringify(market) === JSON.stringify(savedDraft);
    let unsaved =
      (!newMarket.uniqueId &&
        JSON.stringify(market) !== JSON.stringify(defaultState)) ||
      (newMarket.uniqueId &&
        JSON.stringify(market) !== JSON.stringify(savedDraft));

    if (
      !cb &&
      isTemplate &&
      newMarket.currentStep < this.state.templateFormStarts
    ) {
      let templateMarket = market;
      let templateDefaultState = defaultState;
      templateMarket = {
        ...templateMarket,
        navCategories: [],
        categories: [],
        marketType: '',
        currentStep: 0,
        template: null,
      };
      templateDefaultState = {
        ...templateDefaultState,
        categories: [],
        navCategories: [],
        marketType: '',
        template: null,
      };
      unsaved =
        !newMarket.uniqueId &&
        JSON.stringify(templateMarket) !== JSON.stringify(templateDefaultState);
      if (unsaved) return;
    }

    if (unsaved && !disabledSave) {
      discardModal((close: Boolean) => {
        if (!close) {
          this.props.history.push({
            pathname: makePath(CREATE_MARKET, null),
            search: makeQuery({
              [CREATE_MARKET_FORM_PARAM_NAME]: isTemplate ? TEMPLATE : SCRATCH,
            }),
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
      isTemplate,
    } = this.props;

    const firstPage = 0;
    if (
      (isTemplate && newMarket.currentStep === this.state.templateFormStarts) ||
      (!isTemplate && newMarket.currentStep <= firstPage)
    ) {
      this.unblock((goBack: Boolean) => {
        if (goBack) {
          this.setState({ blockShown: true }, () => {
            if (isTemplate) {
              const categories = [
                newMarket.categories[0],
                hasNoTemplateCategoryChildren(newMarket.categories[0])
                  ? ''
                  : newMarket.categories[1],
                hasNoTemplateCategoryTertiaryChildren(
                  newMarket.categories[0],
                  newMarket.categories[1]
                )
                  ? ''
                  : newMarket.categories[2],
              ];
              updateNewMarket({
                ...deepClone<NewMarket>(EMPTY_STATE),
                marketType: newMarket.marketType,
                categories,
                navCategories: categories,
                currentStep: this.state.templateFormStarts - 1,
                template: null,
              });
            } else {
              updatePage(LANDING);
              clearNewMarket();
            }
          });
        }
      });
    } else if (isTemplate && newMarket.currentStep === 1) {
      clearNewMarket();
      return updatePage(LANDING);
    } else {
      const newStep =
        newMarket.currentStep <= 0 ? 0 : newMarket.currentStep - 1;

      const { contentPages } = this.state;
      const { mainContent } = contentPages[newMarket.currentStep];

      if (mainContent === TEMPLATE_PICKER && isTemplate) {
        updateNewMarket({ template: null });
      }

      updateNewMarket({ currentStep: newStep });

      this.node && this.node.scrollIntoView();
    }
  };

  nextPage = () => {
    const {
      newMarket,
      updateNewMarket,
      isTemplate,
      marketCreationStarted,
    } = this.props;
    const { currentStep, marketType, template } = newMarket;

    const { contentPages } = this.state;
    if (this.findErrors()) return;

    const newStep =
      currentStep >= contentPages.length - 1
        ? contentPages.length - 1
        : currentStep + 1;
    updateNewMarket({ currentStep: newStep });

    const { mainContent } = contentPages[currentStep];
    if (isTemplate && template && mainContent === TEMPLATE_PICKER) {
      marketCreationStarted(template.question, true);
    }

    this.node && this.node.scrollIntoView();
  };

  findErrors = () => {
    const { newMarket, isTemplate } = this.props;
    const { designatedReporterType, marketType } = newMarket;

    let { currentStep } = newMarket;
    let hasErrors = false;

    let fields = [];

    if (isTemplate) currentStep = currentStep - this.state.templateFormStarts;

    if (currentStep === 0) {
      fields = [DESCRIPTION, END_TIME, HOUR, CATEGORIES];
      if (designatedReporterType === DESIGNATED_REPORTER_SPECIFIC) {
        fields.push(DESIGNATED_REPORTER_ADDRESS);
      }
      if (marketType === CATEGORICAL) {
        fields.push(OUTCOMES);
      }
      if (marketType === SCALAR) {
        fields.push(DENOMINATION, MIN_PRICE, MAX_PRICE, TICK_SIZE);
      }
      if (isTemplate) {
        fields.push(TEMPLATE_INPUTS);
      }
    } else if (currentStep === 1) {
      fields = [SETTLEMENT_FEE, AFFILIATE_FEE];
    }

    fields.map(field => {
      let value = newMarket[field];
      if (field === TEMPLATE_INPUTS) {
        value = newMarket.template[TEMPLATE_INPUTS];
      }
      if (field === END_TIME && newMarket.endTimeFormatted) {
        value = newMarket.endTimeFormatted.timestamp;
      }
      const error = this.evaluate({
        ...VALIDATION_ATTRIBUTES[field],
        updateValue: false,
        value,
      });
      if (error) hasErrors = true;
    });

    return hasErrors;
  };

  isValid = currentStep => {
    const { newMarket } = this.props;
    const validations = newMarket.validations;
    return (validations || []).every(key => validations[key] === '');
  };

  saveDraft = () => {
    const {
      addDraft,
      currentTimestamp,
      newMarket,
      updateNewMarket,
      drafts,
      updateDraft,
      isTemplate,
      marketCreationSaved,
    } = this.props;

    if (newMarket.description === EMPTY_STATE.description) {
      this.onError('description', draftError);
      return;
    }

    const currentStep = isTemplate ? this.state.templateFormStarts : 0;

    if (newMarket.uniqueId && drafts[newMarket.uniqueId]) {
      // update draft
      const updatedDate = currentTimestamp;
      const draftMarket = {
        ...newMarket,
        currentStep,
        updated: updatedDate,
      };
      updateDraft(newMarket.uniqueId, draftMarket);
      updateNewMarket({
        updated: updatedDate,
      });
    } else {
      // create new draft
      const createdDate = currentTimestamp;
      const key = createdDate + '-' + newMarket.description;
      const draftMarket = {
        ...newMarket,
        currentStep,
        uniqueId: key,
        created: createdDate,
        updated: createdDate,
      };

      addDraft(key, draftMarket);
      updateNewMarket({
        uniqueId: key,
        created: createdDate,
        updated: createdDate,
      });
    }

    marketCreationSaved(
      newMarket.template && newMarket.template.name,
      isTemplate
    );
  };

  evaluate = (validationsObj: Validations) => {
    const { newMarket, currentTimestamp } = this.props;

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
      checkDateGreaterMessage,
      checkCategories,
      checkOutcomes,
      checkMoreThan,
      checkLessThan,
      checkDividedBy,
      checkPositive,
      checkDateGreater,
      lessThanMessage,
      checkDecimals,
      decimals,
      checkForAddress,
      checkFee,
      checkUserInputFilled,
      checkWholeNumber,
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
      checkFee ? isValidFee(value, readableName, newMarket.affiliateFee) : '',
      checkDividedBy
        ? dividedBy(value, readableName, newMarket.minPrice, newMarket.maxPrice)
        : '',
      checkDateGreater
        ? dateGreater(value, currentTimestamp, checkDateGreaterMessage)
        : '',
      checkPositive ? isPositive(value) : '',
      checkDecimals ? moreThanDecimals(value, decimals) : '',
      checkForAddress ? checkAddress(value) : '',
      checkUserInputFilled
        ? checkForUserInputFilled(
            value,
            newMarket.endTimeFormatted,
            currentTimestamp
          )
        : '',
      checkWholeNumber ? isCheckWholeNumber(value) : '',
    ];

    if (label === END_TIME) {
      const endTimeFormatted = buildformattedDate(
        newMarket.setEndTime,
        parseInt(newMarket.hour, 10),
        parseInt(newMarket.minute, 10),
        newMarket.meridiem,
        newMarket.offsetName,
        newMarket.offset
      );
      checkValidations.push(
        dateGreater(
          endTimeFormatted.timestamp,
          currentTimestamp,
          checkDateGreaterMessage
        )
      );
      if (
        newMarket &&
        newMarket.template &&
        newMarket.template.inputs &&
        newMarket.template.inputs.length > 0
      ) {
        const inputs = newMarket.template.inputs;
        const afterTuesday: TemplateInput = inputs.find(
          i =>
            i.type === TemplateInputType.DATEYEAR &&
            i.validationType ===
              ValidationType.EXP_DATE_TUESDAY_AFTER_MOVIE_NO_FRIDAY
        );
        if (afterTuesday && afterTuesday.setEndTime) {
          const wednesdayAfterOpening = getTemplateWednesdayAfterOpeningDay(
            afterTuesday.setEndTime
          );
          const dateTime = convertUnixToFormattedDate(wednesdayAfterOpening);
          const message = `${MovieWednesdayAfterOpeningMessage} ${dateTime.formattedLocalShortDateTimeWithTimezone}`;
          checkValidations.push(
            dateGreater(
              endTimeFormatted.timestamp,
              wednesdayAfterOpening,
              message
            )
          );
        }
      }
    }

    const errorMsg = checkValidations.find(validation => {
      if (typeof validation === 'string') {
        return validation !== '';
      } else if (validation === null || validation === undefined) {
        return false;
      } else {
        return !validation.every(
          error =>
            error === '' ||
            (error.constructor === Object && Object.entries(error).length === 0)
        );
      }
    });

    if (errorMsg) {
      this.onError(label, errorMsg);
      return true;
    }

    // no errors
    this.onError(label, '');
  };

  onChange = (name, value) => {
    const {
      updateNewMarket,
      newMarket,
      removeAllOrdersFromNewMarket,
    } = this.props;

    let updatedMarket = ({ [name]: value });

    if (name === 'outcomes') {
      const outcomesFormatted = getFormattedOutcomes(
        newMarket.marketType,
        value,
        newMarket.scalarDenomination
      );
      updatedMarket = Object.assign(updatedMarket, { outcomesFormatted });
    } else if (name === 'marketType') {
      let outcomesFormatted = [];
      if (value === CATEGORICAL) {
        outcomesFormatted = newMarket.outcomes.map((outcome, index) => ({
          description: outcome,
          id: index,
        }));
      } else if (value === SCALAR) {
        outcomesFormatted = SCALAR_OUTCOMES;
        outcomesFormatted[1].description =
          newMarket.scalarDenomination === ''
            ? NON_EXISTENT
            : newMarket.scalarDenomination;
      } else {
        outcomesFormatted = YES_NO_OUTCOMES;
      }
      if (value !== SCALAR) {
        this.onError('minPrice', '');
        this.onError('maxPrice', '');
        this.onError('scalarDenomination', '');
        this.onError('tickSize', '');
        updatedMarket = Object.assign(updatedMarket, {
          minPrice: 0,
          maxPrice: 1,
          minPriceBigNumber: ZERO,
          maxPriceBigNumber: ONE,
        });
      }
      if (value !== CATEGORICAL) {
        this.onError('outcomes', '');
      }
      updatedMarket = Object.assign(updatedMarket, { outcomesFormatted });
      removeAllOrdersFromNewMarket();
    } else if (name === 'scalarDenomination') {
      let outcomesFormatted = SCALAR_OUTCOMES;
      outcomesFormatted[1].description = value;
      updatedMarket = Object.assign(updatedMarket, { outcomesFormatted });
    } else if (
      name === 'setEndTime' ||
      name === 'hour' ||
      name === 'minute' ||
      name === 'meridiem' ||
      name === 'timezoneDropdown' ||
      name === 'timeSelector' ||
      name === 'updateEventExpiration'
    ) {
      // timezone needs to be set on NewMarket object, this value is used to set timezone picker default value
      let setEndTime = name === 'setEndTime' ? value : newMarket.setEndTime;
      let hour = name === 'hour' ? value : newMarket.hour;
      let minute = name === 'minute' ? value : newMarket.minute;
      let meridiem = name === 'meridiem' ? value : newMarket.meridiem;
      let offset = newMarket.offset;
      let offsetName = newMarket.offsetName;
      let timezone = newMarket.timezone;

      if (name === 'timeSelector' || name === 'updateEventExpiration') {
        hour = value.hour || hour;
        minute = value.minute || minute;
        meridiem = value.meridiem || meridiem;
        this.onError('hour', '');
      }
      if (name === 'timezoneDropdown' || name === 'updateEventExpiration') {
        offset = value.offset;
        offsetName = value.offsetName;
        timezone = value.timezone;
      }
      let endTimeFormatted = buildformattedDate(
        setEndTime,
        hour,
        minute,
        meridiem,
        offsetName,
        offset
      );
      if (name === 'updateEventExpiration') {
        this.onError('setEndTime', '');
        setEndTime = value.setEndTime || newMarket.setEndTime;
        endTimeFormatted = buildformattedDate(
          setEndTime,
          hour,
          minute,
          meridiem,
          offsetName,
          offset
        );
      }
      updatedMarket = Object.assign(updatedMarket, {
        endTimeFormatted,
        endTime: endTimeFormatted.timestamp,
        setEndTime,
        hour,
        minute,
        meridiem,
        offset,
        offsetName,
        timezone,
      });
    }
    this.onError(name, '');
    updateNewMarket(updatedMarket);
  };

  onError = (name, error) => {
    const { updateNewMarket, newMarket } = this.props;
    const { currentStep, validations } = newMarket;
    const updatedValidations = validations;

    updatedValidations[name] = error;
    updateNewMarket({ validations: updatedValidations });
  };

  preview = () => {
    this.setState({ showPreview: !this.state.showPreview }, () => {
      this.node && this.node.scrollIntoView();
    });
  };

  setDisableCreate = (disable: boolean) => {
    this.setState({ disableCreate: disable });
  };
  render() {
    const {
      newMarket,
      drafts,
      updateNewMarket,
      openCreateMarketModal,
      history,
      needsApproval,
      isTemplate,
      currentTimestamp,
      GsnEnabled,
      gsnUnavailable,
      gsnWalletInfoSeen,
      initializeGsnWallet,
      walletStatus,
    } = this.props;
    const { contentPages } = this.state;

    const { currentStep, validations, uniqueId, marketType } = newMarket;

    const {
      mainContent,
      explainerBlockTitle,
      firstButton,
      secondButton,
      explainerBlockSubtexts,
      largeHeader,
      noDarkBackground,
      previewButton,
      disabledFunction,
      useBullets,
    } = contentPages[currentStep];

    const disableCreate =
      walletStatus !== WALLET_STATUS_VALUES.CREATED || this.state.disableCreate;
    let savedDraft = drafts[uniqueId];
    if (savedDraft) savedDraft.validations = [];
    let comparableNewMarket = deepClone<NewMarket>(newMarket);
    comparableNewMarket.currentStep = isTemplate
      ? this.state.templateFormStarts
      : 0;
    comparableNewMarket.validations = [];

    const disabledSave =
      savedDraft &&
      JSON.stringify(comparableNewMarket) === JSON.stringify(savedDraft);

    const noErrors = Object.values(validations || {}).every(field => {
      if (Array.isArray(field)) {
        return field.every(val => {
          if (typeof val === 'string') {
            return val === '' || !val;
          } else {
            return Object.values(val || {}).filter(v => v === '').length > 0;
          }
        });
      } else {
        return !field || field === '';
      }
    });

    const saveDraftError =
      validations && validations.description === draftError;

    const disabledNext = disabledFunction && disabledFunction(newMarket);

    const createModalCallback = () => {
      this.setState({ blockShown: true }, () => {
        history.push({
          pathname: makePath(MY_POSITIONS, null),
          search: makeQuery({
            [CREATE_MARKET_PORTFOLIO]: 3,
          }),
        });
      });
    };

    const explainerBlockContents = (explainerBlockTitle ===
      EventDetailsContent().explainerBlockTitle ||
      explainerBlockTitle === ReviewContent.explainerBlockTitle) && [
      {
        title: explainerBlockTitle,
        subtexts: explainerBlockSubtexts,
        useBullets: useBullets,
      },
      {
        title: AugurMarketsContent().explainerBlockTitle,
        subtexts: AugurMarketsContent().explainerBlockSubtexts,
        useBullets: AugurMarketsContent().useBullets,
      },
    ];

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
            <PrimaryButton text="Close preview" action={this.preview} />
            <span>
              <MarketView
                sortedOutcomes={selectSortedMarketOutcomes(
                  newMarket.marketType,
                  newMarket.outcomesFormatted
                )}
                market={{
                  ...newMarket,
                  creationTimeFormatted: convertUnixToFormattedDate(
                    currentTimestamp
                  ),
                  endTimeFormatted: convertUnixToFormattedDate(
                    newMarket.endTimeFormatted.timestamp
                  ),
                  maxPriceBigNumber: createBigNumber(newMarket.maxPrice),
                  minPriceBigNumber: createBigNumber(newMarket.minPrice),
                  details: isTemplate
                    ? buildResolutionDetails(
                        newMarket.detailsText,
                        newMarket.template.resolutionRules
                      )
                    : newMarket.detailsText,
                }}
                preview
                orderBook={newMarket.orderBook}
              />
            </span>
            <PrimaryButton text="Close preview" action={this.preview} />
          </div>
        )}
        {!this.state.showPreview && (
          <>
            <LocationDisplay currentStep={currentStep} pages={contentPages} />
            {largeHeader && <LargeHeader text={largeHeader} />}
            {previewButton && (
              <PrimaryButton text="Preview your market" action={this.preview} />
            )}
            {!explainerBlockContents && explainerBlockTitle && explainerBlockSubtexts && (
              <ExplainerBlock
                title={explainerBlockTitle}
                subtexts={explainerBlockSubtexts}
                useBullets={useBullets}
              />
            )}
            {explainerBlockContents && (
              <MultipleExplainerBlock contents={explainerBlockContents} />
            )}
            <ContentBlock noDarkBackground={noDarkBackground}>
              {mainContent === FORM_DETAILS && (
                <FormDetails onChange={this.onChange} onError={this.onError} />
              )}
              {mainContent === TEMPLATE_FORM_DETAILS && (
                <FormDetails
                  isTemplate
                  onChange={this.onChange}
                  onError={this.onError}
                />
              )}
              {mainContent === FEES_LIQUIDITY && (
                <FeesLiquidity
                  onChange={this.onChange}
                  onError={this.onError}
                />
              )}
              {mainContent === REVIEW && (
                <Review setDisableCreate={this.setDisableCreate} />
              )}
              {mainContent === TEMPLATE_PICKER && <TemplatePicker />}
              {mainContent === SUB_CATEGORIES && (
                <SubCategories nextPage={this.nextPage} />
              )}
              {mainContent === MARKET_TYPE && (
                <MarketType
                  updateNewMarket={updateNewMarket}
                  marketType={marketType}
                  categories={newMarket.navCategories}
                  nextPage={this.nextPage}
                />
              )}
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
              {secondButton === CREATE && !GsnEnabled && (
                <BulkTxLabel
                  className={Styles.MultipleTransactions}
                  buttonName={'Create'}
                  count={1}
                  needsApproval={needsApproval}
                />
              )}
              <div>
                {firstButton === BACK && (
                  <SecondaryButton text="Back" action={this.prevPage} />
                )}
                <div>
                  {((isTemplate &&
                    currentStep >= this.state.templateFormStarts) ||
                    !isTemplate) && (
                    <SecondaryButton
                      text={disabledSave ? 'Saved' : 'Save draft'}
                      disabled={disabledSave}
                      action={this.saveDraft}
                    />
                  )}
                  {secondButton === NEXT && (
                    <PrimaryButton
                      text="Next"
                      action={this.nextPage}
                      disabled={disabledNext}
                    />
                  )}
                  {secondButton === CREATE && (
                    <PrimaryButton
                      text="Create"
                      disabled={disableCreate}
                      action={() => {
                        gsnUnavailable && !gsnWalletInfoSeen
                          ? initializeGsnWallet(() =>
                              setTimeout(() => {
                                openCreateMarketModal(createModalCallback);
                              })
                            )
                          : openCreateMarketModal(createModalCallback);
                      }}
                    />
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
