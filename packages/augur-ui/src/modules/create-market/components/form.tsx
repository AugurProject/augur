import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';
import { useHistory } from 'react-router';
import { LocationDisplay, Error } from 'modules/common/form';
import {
  BACK,
  NEXT,
  CREATE,
  CUSTOM_CONTENT_PAGES,
  REVIEW,
  FORM_DETAILS,
  TEMPLATE_FORM_DETAILS,
  LANDING,
  FEES_LIQUIDITY,
  DESCRIPTION,
  END_TIME,
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
  MARKET_TYPE,
  EMPTY_STATE,
  TEMPLATE_PICKER,
  TEMPLATE_INPUTS,
  TEMPLATE,
  MovieWednesdayAfterOpeningMessage,
} from 'modules/create-market/constants';
import {
  CATEGORICAL,
  DESIGNATED_REPORTER_SPECIFIC,
  NON_EXISTENT,
  ONE,
  SCALAR,
  SCALAR_OUTCOMES,
  MODAL_DISCARD,
  MODAL_CREATE_MARKET,
  YES_NO_OUTCOMES,
  ZERO,
  APPROVE,
} from 'modules/common/constants';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import {
  LargeHeader,
  ExplainerBlock,
  ContentBlock,
} from 'modules/create-market/components/common';
import FormDetails from 'modules/create-market/components/form-details';
import Review from 'modules/create-market/components/review';
import FeesLiquidity from 'modules/create-market/fees-liquidity';
import SubCategories from 'modules/create-market/components/sub-categories';
import { CREATE_MARKET, MY_POSITIONS } from 'modules/routes/constants/views';
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
  buildformattedDate,
  convertUnixToFormattedDate,
} from 'utils/format-date';
import TemplatePicker from 'modules/create-market/components/template-picker';
import { ApprovalTxButtonLabel } from 'modules/common/labels';
import Styles from 'modules/create-market/components/form.styles.less';
import { MarketType } from 'modules/create-market/components/market-type';
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
import makePath from 'modules/routes/helpers/make-path';
import makeQuery from 'modules/routes/helpers/make-query';
import { Drafts, NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import deepClone from 'utils/deep-clone';
import {
  TemplateInput,
  TemplateInputType,
  ValidationType,
  getTemplateWednesdayAfterOpeningDay,
} from '@augurproject/templates';
import { useAppStatusStore, AppStatus } from 'modules/app/store/app-status';
import {
  marketCreationStarted,
  marketCreationSaved,
} from 'services/analytics/helpers';
import parsePath from 'modules/routes/helpers/parse-path';
import { approvalsNeededMarketCreation, approveMarketCreation } from 'modules/contracts/actions/contractCalls';

interface FormProps {
  newMarket: NewMarket;
  updateNewMarket: (newMarketData: NewMarket) => void;
  address: string;
  updatePage: (page: string) => void;
  addUpdateDraft: Function;
  drafts: Drafts;
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
}

interface FormState {
  blockShown: Boolean;
  contentPages: any[];
  templateFormStarts: number;
  disableCreate: boolean;
  showPreview: boolean;
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

const unblock = (isTemplate, templateFormStarts, history, cb?: Function) => {
  const { newMarket, drafts } = AppStatus.get();
  const { setModal } = AppStatus.actions;
  const savedDraft = drafts[newMarket.uniqueId];
  let defaultState = deepClone<NewMarket>(EMPTY_STATE);
  defaultState.validations = [];

  let market = deepClone<NewMarket>(newMarket);
  market.validations = [];
  market.currentStep = isTemplate ? templateFormStarts : 0;

  const disabledSave =
    savedDraft && JSON.stringify(market) === JSON.stringify(savedDraft);
  let unsaved =
    (!newMarket.uniqueId &&
      JSON.stringify(market) !== JSON.stringify(defaultState)) ||
    (newMarket.uniqueId &&
      JSON.stringify(market) !== JSON.stringify(savedDraft));

  if (!cb && isTemplate && newMarket.currentStep < templateFormStarts) {
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
    setModal({
      type: MODAL_DISCARD,
      cb: (close: boolean) => {
        if (!close) {
          history.push({
            pathname: makePath(CREATE_MARKET, null),
            search: makeQuery({
              [CREATE_MARKET_FORM_PARAM_NAME]: isTemplate ? TEMPLATE : SCRATCH,
            }),
          });
          cb && cb(false);
        } else {
          cb && cb(true);
        }
      },
    });
  } else {
    cb && cb(true);
  }
};

const saveDraft = (isTemplate, templateFormStarts) => {
  const {
    newMarket,
    blockchain: { currentAugurTimestamp: currentTimestamp },
    drafts,
  } = AppStatus.get();
  const { addUpdateDraft, updateNewMarket } = AppStatus.actions;

  if (newMarket.description === EMPTY_STATE.description) {
    onError('description', draftError);
    return;
  }

  const currentStep = isTemplate ? templateFormStarts : 0;
  if (newMarket.uniqueId && drafts[newMarket.uniqueId]) {
    // update draft
    const updatedDate = currentTimestamp;
    const draftMarket = {
      ...newMarket,
      currentStep,
      updated: updatedDate,
    };
    addUpdateDraft(newMarket.uniqueId, draftMarket);
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

    addUpdateDraft(key, draftMarket);
    updateNewMarket({
      uniqueId: key,
      created: createdDate,
      updated: createdDate,
    });
  }
  marketCreationSaved(newMarket?.template?.name, isTemplate);
};

const onError = (name, error) => {
  const {
    newMarket: { validations },
  } = AppStatus.get();
  const updatedValidations = validations;
  updatedValidations[name] = error;
  if (!!error)
    AppStatus.actions.updateNewMarket({ validations: updatedValidations });
};

const updateValidation = updatedValidations => {
  const {
    newMarket: { validations },
  } = AppStatus.get();
  const updatedValidation = { ...validations, ...updatedValidations };
  AppStatus.actions.updateNewMarket({ validations: updatedValidation });
};

const evaluate = (validationsObj: Validations) => {
  const {
    newMarket,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();

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
    if (newMarket?.template?.inputs?.length > 0) {
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
    return { label, errorMsg };
  }
  // no errors
  return undefined;
};

const findErrors = (isTemplate, templateFormStarts) => {
  const { newMarket } = AppStatus.get();
  const { designatedReporterType, marketType } = newMarket;

  let { currentStep } = newMarket;
  let hasErrors = false;

  let fields = [];

  if (isTemplate) currentStep = currentStep - templateFormStarts;

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
  let errorUpdates = EMPTY_STATE.validations;
  fields.map(field => {
    let value = newMarket[field];
    if (field === TEMPLATE_INPUTS) {
      value = newMarket.template[TEMPLATE_INPUTS];
    }
    if (field === END_TIME && newMarket.endTimeFormatted) {
      value = newMarket.endTimeFormatted.timestamp;
    }
    const error = evaluate({
      ...VALIDATION_ATTRIBUTES[field],
      updateValue: false,
      value,
    });

    if (error) {
      hasErrors = true;
      errorUpdates = { ...errorUpdates, [error.label]: error.errorMsg };
    }
  });
  updateValidation(errorUpdates);
  return hasErrors;
};

export const Form = ({ isTemplate, updatePage }) => {
  const {
    newMarket,
    drafts,
    loginAccount: { address, balances, tradingApproved },
    gasPriceInfo,
    blockchain: { currentAugurTimestamp: currentTimestamp },
    actions: {
      setModal,
      clearNewMarket,
      updateNewMarket,
      removeAllOrdersFromNewMarket,
    },
  } = useAppStatusStore();
  const node = useRef(null);
  const [blockShown, setBlockShown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [disableCreate, setDisableCreate] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;

  const history = useHistory();
  useEffect(() => {
    node?.current?.scrollIntoView();
  }, [newMarket.currentStep]);
  useEffect(() => {
    return () => {
      if (
        !blockShown &&
        parsePath(history.location.pathname)[0] !== CREATE_MARKET
      )
        unblock(isTemplate, templateFormStarts, history);
    };
  });
  const templateFormStarts = hasNoTemplateCategoryChildren(
    newMarket.navCategories[0]
  )
    ? 3
    : 4;
  const contentPages = isTemplate
    ? hasNoTemplateCategoryChildren(newMarket.navCategories[0])
      ? NO_CAT_TEMPLATE_CONTENT_PAGES
      : TEMPLATE_CONTENT_PAGES
    : CUSTOM_CONTENT_PAGES;
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
    disabledFunction,
    useBullets,
  } = contentPages[currentStep];

  const disableCreateButton = disableCreate || !tradingApproved;
  let savedDraft = drafts[uniqueId];
  if (savedDraft) savedDraft.validations = [];
  let comparableNewMarket = deepClone<NewMarket>(newMarket);
  comparableNewMarket.currentStep = isTemplate ? templateFormStarts : 0;
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

  const saveDraftError = validations && validations.description === draftError;

  const disabledNext = disabledFunction && disabledFunction(newMarket);

  const createModalCallback = () => {
    history.push({
      pathname: makePath(MY_POSITIONS, null),
      search: makeQuery({
        [CREATE_MARKET_PORTFOLIO]: 3,
      }),
    });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    node?.current?.scrollIntoView();
  };

  const prevPage = () => {
    const { marketType } = newMarket;
    const firstPage = 0;
    if (
      (isTemplate && currentStep === templateFormStarts) ||
      (!isTemplate && currentStep <= firstPage)
    ) {
      unblock(isTemplate, templateFormStarts, history, (goBack: Boolean) => {
        if (goBack) {
          setBlockShown(true);
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
              marketType,
              categories,
              navCategories: categories,
              currentStep: templateFormStarts - 1,
              template: null,
            });
          } else {
            updatePage(LANDING);
            clearNewMarket();
          }
        }
      });
    } else if (isTemplate && currentStep === 1) {
      clearNewMarket();
      updatePage(LANDING);
    } else {
      const newStep = currentStep <= 0 ? 0 : currentStep - 1;
      let updates = { currentStep: newStep };
      if (mainContent === TEMPLATE_PICKER && isTemplate) {
        updates = { ...updates, template: null };
      }
      updateNewMarket(updates);
    }
  };

  const nextPage = () => {
    const { currentStep, template } = newMarket;
    if (findErrors(isTemplate, templateFormStarts)) return;

    const newStep =
      currentStep >= contentPages.length - 1
        ? contentPages.length - 1
        : currentStep + 1;
    updateNewMarket({ currentStep: newStep });

    if (isTemplate && template && mainContent === TEMPLATE_PICKER) {
      marketCreationStarted(template.question, true);
    }
  };

  const onChange = (name, value) => {
    let updates = { [name]: value };

    if (name === 'outcomes') {
      const outcomesFormatted = getFormattedOutcomes(
        newMarket.marketType,
        value,
        newMarket.scalarDenomination
      );
      updates = { ...updates, outcomesFormatted };
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
        updateValidation({
          minPrice: '',
          maxPrice: '',
          scalarDenomination: '',
          tickSize: '',
        });
        updates = {
          ...updates,
          minPrice: 0,
          maxPrice: 1,
          minPriceBigNumber: ZERO,
          maxPriceBigNumber: ONE,
        };
      }
      if (value !== CATEGORICAL) {
        onError('outcomes', '');
      }
      updates = { ...updates, outcomesFormatted };
      removeAllOrdersFromNewMarket();
    } else if (name === 'scalarDenomination') {
      let outcomesFormatted = SCALAR_OUTCOMES;
      outcomesFormatted[1].description = value;
      updates = { ...updates, outcomesFormatted };
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
        onError('hour', '');
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
        onError('setEndTime', '');
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
      updates = {
        ...updates,
        endTimeFormatted,
        endTime: endTimeFormatted.timestamp,
        setEndTime,
        hour,
        minute,
        meridiem,
        offset,
        offsetName,
        timezone,
      };
    }
    updateNewMarket(updates);
    onError(name, '');
  };

  return (
    <div
      ref={node}
      className={classNames(Styles.Form, {
        [Styles.Preview]: showPreview,
      })}
    >
      {showPreview && (
        <div>
          <PrimaryButton text="Close preview" action={() => togglePreview()} />
          <span>
            <MarketView
              sortedOutcomes={selectSortedMarketOutcomes(
                newMarket.marketType,
                newMarket.outcomesFormatted
              )}
              defaultMarket={{
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
            />
          </span>
          <PrimaryButton text="Close preview" action={() => togglePreview()} />
        </div>
      )}
      {!showPreview && (
        <>
          <LocationDisplay currentStep={currentStep} pages={contentPages} />
          {largeHeader && <LargeHeader text={largeHeader} />}
          {previewButton && (
            <PrimaryButton
              text="Preview your market"
              action={() => togglePreview()}
            />
          )}
          {explainerBlockTitle && explainerBlockSubtexts && (
            <ExplainerBlock
              title={explainerBlockTitle}
              subtexts={explainerBlockSubtexts}
              useBullets={useBullets}
            />
          )}
          <ContentBlock noDarkBackground={noDarkBackground}>
            {(mainContent === FORM_DETAILS ||
              mainContent === TEMPLATE_FORM_DETAILS) && (
              <FormDetails
                isTemplate={isTemplate}
                onChange={(name, value) => onChange(name, value)}
                onError={(name, error) => onError(name, error)}
              />
            )}
            {mainContent === FEES_LIQUIDITY && (
              <FeesLiquidity
                onChange={(name, value) => onChange(name, value)}
              />
            )}
            {mainContent === REVIEW && (
              <Review setDisableCreate={val => setDisableCreate(val)} />
            )}
            {mainContent === TEMPLATE_PICKER && <TemplatePicker />}
            {mainContent === SUB_CATEGORIES && (
              <SubCategories nextPage={nextPage} />
            )}
            {mainContent === MARKET_TYPE && <MarketType />}
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
            {secondButton === CREATE && (
              <ApprovalTxButtonLabel
                className={Styles.MultipleTransactions}
                ignore={Boolean(process.env.REPORTING_ONLY)}
                title='Approve to create the market'
                buttonName='Approve'
                userEthBalance={balances.eth}
                gasPrice={gasPrice}
                hideAddFunds
                checkApprovals={approvalsNeededMarketCreation}
                doApprovals={approveMarketCreation}
                account={address}
                isApprovalCallback={(isApproved) => { setIsApproved(isApproved)}}
                approvalType={APPROVE}
              />
            )}
            <div>
              {firstButton === BACK && (
                <SecondaryButton text="Back" action={prevPage} />
              )}
              <div>
                {((isTemplate && currentStep >= templateFormStarts) ||
                  !isTemplate) && (
                  <SecondaryButton
                    text={disabledSave ? 'Saved' : 'Save draft'}
                    disabled={disabledSave}
                    action={() => saveDraft(isTemplate, templateFormStarts)}
                  />
                )}
                {secondButton === NEXT && (
                  <PrimaryButton
                    text="Next"
                    action={nextPage}
                    disabled={disabledNext}
                  />
                )}
                {secondButton === CREATE && (
                  <PrimaryButton
                    text="Create"
                    disabled={disableCreateButton}
                    action={() => {
                      setBlockShown(true);
                      setModal({
                        type: MODAL_CREATE_MARKET,
                        cb: createModalCallback,
                      });
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
};

export default Form;
