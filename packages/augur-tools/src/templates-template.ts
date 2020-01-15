import { ethers } from 'ethers';
import moment from 'moment';
import { BigNumber } from 'ethers/utils';

export const REQUIRED = 'REQUIRED';
export const CHOICE = 'CHOICE';
// Market templates
export const SPORTS = 'Sports';
export const POLITICS = 'Politics';
export const FINANCE = 'Finance';
export const ENTERTAINMENT = 'Entertainment';
export const CRYPTO = 'Crypto';
export const USD = 'USD';
export const USDT = 'USDT';
export const EUR = 'EUR';

// Market Subtemplates
export const SOCCER = 'Football (Soccer)';
export const AMERICAN_FOOTBALL = 'American Football';
export const BASEBALL = 'Baseball';
export const GOLF = 'Golf';
export const BASKETBALL = 'Basketball';
export const TENNIS = 'Tennis';
export const HOCKEY = 'Hockey';
export const HORSE_RACING = 'Horse Racing';
export const US_POLITICS = 'US Politics';
export const WORLD = 'World';
export const STOCKS = 'Stocks/ETFs';
export const INDEXES = 'Indexes';
export const BITCOIN = 'Bitcoin';
export const ETHEREUM = 'Ethereum';
export const LITECOIN = 'Litecoin';
export const BTC = 'BTC';
export const ETH = 'ETH';
export const LTC = 'LTC';
export const NBA = 'NBA';
export const WNBA = 'WNBA';
export const NCAA = 'NCAA';
export const NFL = 'NFL';
export const PGA = 'PGA';
export const LPGA = 'LPGA';
export const EURO_TOUR = 'Euro Tour';
export const MENS = 'Mens';
export const WOMENS = 'Womens';
export const SINGLES = 'Singles';
export const DOUBLES = 'Doubles';
const SATURDAY_DAY_OF_WEEK = 6;
const SUNDAY_DAY_OF_WEEK = 0;

interface TimezoneDateObject {
  formattedUtc: string;
  formattedTimezone: string;
  timestamp: number;
}

export interface UserInputText {
  value: string;
}

export interface UserInputDateYear extends UserInputText {
  setEndTime: number;
}

export interface UserInputDateTime {
  endTime: number;
  hour?: number;
  minute?: number;
  meridiem: string;
  timezone: string;
  offset: number;
  offsetName: string;
  endTimeFormatted: TimezoneDateObject;
}
export interface UserInputDropdown extends UserInputText {}
export interface UserInputUserOutcome extends UserInputText {}

export interface TemplateChildren {
  [category: string]: CategoryTemplate;
}

export interface CategoryTemplate {
  templates: Template[];
  children: TemplateChildren;
}

export interface TimeOffset {
  offset: number;
  hour: number;
  minutes: number;
}

export type UserInputtedType =
  | UserInputText
  | UserInputDateYear
  | UserInputDateTime
  | UserInputDropdown
  | UserInputUserOutcome
  | TimeOffset;

export interface ValueLabelPair {
  label: string;
  value: string;
}

export interface ResolutionRule {
  text: string;
  isSelected?: boolean;
}

export interface ResolutionRules {
  [REQUIRED]?: ResolutionRule[];
}

export interface Categories {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface DropdownDependencies {
  inputSourceId: number;
  inputDestId?: number;
  values: {
    [key: string]: string[];
  };
}

export interface PlaceholderValues {
  [id: number]: string;
}

export interface DateDependencies {
  id: number;
  noWeekendHolidays?: boolean;
  dateAfterId?: number;
}
export interface DateInputDependencies {
  inputDateYearId: number;
  inputSourceId: number;
  holidayClosures?: {
    [key: string]: {
      [year: number]: {
        holiday: string;
        date: number;
      }[];
    };
  };
  inputTimeOffset: {
    [key: string]: TimeOffset;
  };
}
export interface TemplateValidation {
  templateValidation: string;
  templateValidationResRules: string;
  requiredOutcomes: string[];
  outcomeDependencies: DropdownDependencies;
  substituteDependencies: string[];
  marketQuestionDependencies: DropdownDependencies;
  dateDependencies: DateDependencies[];
  closingDateDependencies: DateInputDependencies[];
  placeholderValues: PlaceholderValues;
  afterTuesdayDate: number[];
}

export interface TemplateValidationHash {
  [hash: string]: TemplateValidation;
}
export interface Template {
  hash: string;
  categories: Categories;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
  resolutionRules: ResolutionRules;
  denomination?: string;
  tickSize?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface TemplateInput {
  id: number;
  type: TemplateInputType;
  placeholder: string;
  label?: string;
  tooltip?: string;
  userInput?: string;
  userInputObject?: UserInputtedType;
  validationType?: ValidationType;
  values?: ValueLabelPair[];
  sublabel?: string;
  dateAfterId?: number;
  inputSourceId?: number; // input id as source of text to get list values
  defaultLabel?: string; // dropdown default label shown
  inputDestId?: number; // target input to set list values
  inputDestValues: {
    // dropdown source data structure to use to set target input list values
    [key: string]: ValueLabelPair[];
  };
  inputTimeOffset: {
    [key: string]: TimeOffset;
  };
  setEndTime?: number;
  inputDateYearId?: number;
  holidayClosures?: {
    [key: string]: {
      [year: number]: {
        holiday: string;
        date: number;
      }[];
    };
  };
}

export interface RetiredTemplate {
  hash: string;
  autoFail: boolean;
}

export enum ValidationType {
  WHOLE_NUMBER = 'WHOLE_NUMBER',
  NUMBER = 'NUMBER',
  NOWEEKEND_HOLIDAYS = 'NOWEEKEND_HOLIDAYS',
  EXP_DATE_TUESDAY_AFTER_MOVIE = 'EXP_DATE_TUESDAY_AFTER_MOVIE',
}

export enum TEXT_PLACEHOLDERS {
  SINGLE_PLAYER = "Single Player's Name",
  MULTIPLE_PLAYER = "Two Player's Names",
  SINGLE_CANDIDATE = 'Single Candidates Name',
  SINGLE_PERSON_NAME = "Single Person's Name",
  SINGLE_HORSE = "Single Horse's Name",
  SINGLE_PERSON = 'Single Person',
  SINGLE_LOCATION = 'Single Location',
  SINGLE_PERSON_OR_GROUP_OR_MOVIE_TITLE = 'Single Person or Single Group or Movie Title',
  INDIVIDUAL_MOVIE_TITLE = 'Individual Movie Title',
  STOCK_OR_ETF = 'Individual Stock or ETF Name',
  INDIVIDUAL_STOCK_OR_ETF_NAME = 'Individual Stock or ETF Name',
  INDIVIDUAL_STOCK_OR_ETF_SYMBOL = 'Individual Stock or ETF Ticker Symbol',
}

export enum TemplateInputType {
  TEXT = 'TEXT', // simple text input in market question
  DATEYEAR = 'DATEYEAR', // date picker in market question
  DATETIME = 'DATETIME', // date time with timezone picker
  DATESTART = 'DATESTART', // market end time can not be before the start of this day
  ESTDATETIME = 'ESTDATETIME', // estimated scheduled start time date time picker with timezone
  DATEYEAR_CLOSING = 'DATEYEAR_CLOSING', // expiration time can not be before this offset on DATEYEAR in market question
  DROPDOWN = 'DROPDOWN', // dropdown list, found in market question
  DENOMINATION_DROPDOWN = 'DENOMINATION_DROPDOWN', // list of denomination values for scalar market
  ADDED_OUTCOME = 'ADDED_OUTCOME', // required outcome that is added to categorical market template
  USER_DESCRIPTION_OUTCOME = 'USER_DESCRIPTION_OUTCOME', // simple text input that is in question and added to categorical market outcomes
  SUBSTITUTE_USER_OUTCOME = 'SUBSTITUTE_USER_OUTCOME', // subsitites market question values in outcome for categorical market template
  USER_DESCRIPTION_DROPDOWN_OUTCOME = 'USER_DESCRIPTION_DROPDOWN_OUTCOME', // dropdown in market question that is added as categorical market outcome
  USER_DROPDOWN_OUTCOME = 'USER_DROPDOWN_OUTCOME', // dropdown for categorical market outcome, doesn't interact with market question.
  USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP = 'USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP', // dropdown for categorical market outcome, the list of values is determined by dropdown in market question.
  DROPDOWN_QUESTION_DEP = 'DROPDOWN_QUESTION_DEP', // market question dropdown list of values is determined by other dropdown in market question.
}

export interface ExtraInfoTemplateInput {
  id: number;
  value: string;
  timestamp?: string;
  type: string;
}

export interface ExtraInfoTemplate {
  hash: string;
  question: string;
  inputs: ExtraInfoTemplateInput[];
}

export interface ExtraInfo {
  _scalarDenomination?: string;
  longDescription?: string;
  description?: string;
  categories?: string[];
  template?: ExtraInfoTemplate;
}

export const ValidationTemplateInputType = {
  [TemplateInputType.TEXT]: `(.*)`,
  [ValidationType.WHOLE_NUMBER]: `[0-9]+`,
  [ValidationType.NUMBER]: `[0-9]+(\\\.[0-9]+){0,1}`,
  [TemplateInputType.USER_DESCRIPTION_OUTCOME]: `(.*)`,
  [TemplateInputType.SUBSTITUTE_USER_OUTCOME]: `[0-9]+`,
  [TemplateInputType.DATETIME]: `(January|February|March|April|May|June|July|August|September|October|November|December){1} ([1-9]|[1-2][0-9]|3[0-1]), 20[0-9]{2} \d\d:\d\d (AM|PM) \\(UTC 0\\)`,
  [TemplateInputType.DATEYEAR]: `(January|February|March|April|May|June|July|August|September|October|November|December){1} ([1-9]|[1-2][0-9]|3[0-1]), 20[0-9]{2}`,
  [TemplateInputType.DATESTART]: `(January|February|March|April|May|June|July|August|September|October|November|December){1} ([1-9]|[1-2][0-9]|3[0-1]), 20[0-9]{2}`,
};

export let TEMPLATE_VALIDATIONS = {};
export let RETIRED_TEMPLATES = [];

export function hasTemplateTextInputs(hash: string) {
  const validation = TEMPLATE_VALIDATIONS[hash] as TemplateValidation;
  if (!validation || !validation.placeholderValues) return false;
  return Object.keys(validation.placeholderValues).length > 0;
}

export function getTemplatePlaceholderById(hash: string, id: number) {
  const validation = TEMPLATE_VALIDATIONS[hash] as TemplateValidation;
  if (!validation || !validation.placeholderValues) return null;
  return validation.placeholderValues[id];
}

function hasSubstituteOutcomes(
  inputs: ExtraInfoTemplateInput[],
  substituteDependencies: string[],
  outcomeValues: string[]
): boolean {
  if (
    !outcomeValues ||
    outcomeValues.length === 0 ||
    !substituteDependencies ||
    substituteDependencies.length === 0
  ) {
    return true; // nothing to validate
  }
  let result = true;
  substituteDependencies.forEach((outcomeTemplate: string) => {
    if (!result) return;
    const outcomeValue = inputs.reduce(
      (p, input: ExtraInfoTemplateInput) =>
        p.replace(`[${input.id}]`, `${input.value}`),
      outcomeTemplate
    );
    result = outcomeValues.includes(outcomeValue);
  });
  return result;
}

function hasRequiredOutcomes(requiredOutcomes: string[], outcomes: string[]) {
  return (
    requiredOutcomes.filter(r => outcomes.includes(r)).length ===
    requiredOutcomes.length
  );
}

export function generateResolutionRulesHash(rules: ResolutionRules) {
  let hash = null;
  if (!rules || !rules[REQUIRED]) return hash;
  try {
    const details = rules[REQUIRED].map(r => r.text).join('\n');
    hash = hashResolutionRules(details);
  } catch (e) {
    console.log(rules, rules[REQUIRED]);
  }
  return hash;
}

function hashResolutionRules(details) {
  if (!details) return null;
  const value = `0x${Buffer.from(details, 'utf8').toString('hex')}`;
  return ethers.utils.sha256(value);
}

export const isValidTemplateMarket = (
  templateValidation: string,
  marketTitle: string
) => {
  if (!templateValidation || !templateValidation) return false;
  return !!marketTitle.match(templateValidation);
};

function convertOutcomes(outcomes: string[]) {
  if (!outcomes) return [];
  return outcomes.map(o => {
    const outcomeDescription = o.replace('0x', '');
    const value = Buffer.from(outcomeDescription, 'hex').toString();
    return [...value]
      .reduce((p, i) => (i.charCodeAt(0) !== 0 ? [...p, i] : p), [])
      .join('');
  });
}

function hasMarketQuestionDependencies(
  validationDep: DropdownDependencies,
  inputs: ExtraInfoTemplateInput[]
) {
  if (!validationDep) return true;
  const input = inputs.find(i => i.id === validationDep.inputSourceId);
  if (!input) return false;
  const correctValues = validationDep.values[input.value] || [];
  const testValue = inputs.find(i => i.id === validationDep.inputDestId);
  if (!testValue) return false;
  return correctValues.includes(testValue.value);
}

function isDependencyOutcomesCorrect(
  validationDep: DropdownDependencies,
  requiredOutcomes: string[],
  inputs: ExtraInfoTemplateInput[],
  outcomes: string[]
) {
  let result = false;
  const testOutcomes = outcomes.filter(o => !requiredOutcomes.includes(o));

  if (validationDep) {
    const input = inputs.find(i => i.id === validationDep.inputSourceId);
    if (!input) result = false;
    const correctValues = validationDep.values[input.value] || [];
    result =
      testOutcomes.filter(o => correctValues.includes(o)).length ===
      testOutcomes.length;
  }
  return result;
}

function estimatedDateTimeAfterMarketEndTime(
  inputs: ExtraInfoTemplateInput[],
  endTime: number
) {
  const input = inputs.find(i => i.type === TemplateInputType.ESTDATETIME);
  if (!input) return false;
  return Number(input.timestamp) >= Number(endTime);
}

function dateStartAfterMarketEndTime(
  inputs: ExtraInfoTemplateInput[],
  endTime: number
) {
  const input = inputs.find(i => i.type === TemplateInputType.DATESTART);
  if (!input) return false;
  return Number(input.timestamp) >= Number(endTime);
}

function wednesdayAfterOpening(
  inputs: ExtraInfoTemplateInput[],
  endTime: number,
  ids: number[]
) {
  const afterTuesday: ExtraInfoTemplateInput = inputs.find(i =>
    ids.includes(i.id)
  );
  if (!afterTuesday) return true;
  const wednesdayDatetime = getTemplateWednesdayAfterOpeningDay(
    Number(afterTuesday.timestamp)
  );
  return endTime < wednesdayDatetime;
}

export function tellOnHoliday(
  inputs: ExtraInfoTemplateInput[],
  input: ExtraInfoTemplateInput,
  closing: DateInputDependencies
) {
  let holidayPresent = null;
  const exchange = inputs.find(i => i.id === closing.inputSourceId);
  if (!exchange) return 'exchange not found'; //exchange is required
  if (exchange.value) {
    const holidayClosures = closing.holidayClosures[exchange.value];
    const inputYear = moment.unix(Number(input.timestamp)).year();
    const holidayClosuresPerYear =
      holidayClosures && holidayClosures[inputYear];
    if (holidayClosuresPerYear) {
      const offset = closing.inputTimeOffset[exchange.value].offset;
      holidayClosuresPerYear.forEach(holiday => {
        const OneHourBuffer = 1;
        const utcHolidayDate = moment.unix(holiday.date).utc();
        const convertedUtcHolidayDate = moment(utcHolidayDate).add(
          offset,
          'hours'
        );
        const startHolidayDate = moment(convertedUtcHolidayDate).subtract(
          OneHourBuffer,
          'hours'
        );
        const endHolidayDate = moment(startHolidayDate).add(
          24 + OneHourBuffer,
          'hours'
        );
        if (
          moment(Number(input.timestamp) * 1000).unix() >=
            startHolidayDate.unix() &&
          moment(Number(input.timestamp) * 1000).unix() <= endHolidayDate.unix()
        ) {
          holidayPresent = holiday;
        }
      });
    }
  }
  return holidayPresent;
}

function dateNoWeekendHoliday(
  inputs: ExtraInfoTemplateInput[],
  dateDependencies: DateDependencies[],
  closingDateDependencies: DateInputDependencies[]
) {
  if (!dateDependencies) return true;
  const deps = dateDependencies.filter(d => d.noWeekendHolidays);
  const result = deps.reduce((p, d) => {
    const input = inputs.find(i => i.id === d.id);
    if (!input) return false;
    const dayOfWeek = moment.unix(Number(input.timestamp)).weekday();
    if (
      dayOfWeek === SATURDAY_DAY_OF_WEEK ||
      dayOfWeek === SUNDAY_DAY_OF_WEEK
    ) {
      return false;
    }
    closingDateDependencies.forEach(closing => {
      if (closing && tellOnHoliday(inputs, input, closing)) {
        p = false;
      }
    });
    return p;
  }, true);
  return result;
}

function dateComparisonDependencies(
  inputs: ExtraInfoTemplateInput[],
  dateDependencies: DateDependencies[]
) {
  if (!dateDependencies) return true;
  const deps = dateDependencies.filter(d => d.dateAfterId);
  const result = deps.reduce((p, d) => {
    const dep = inputs.find(i => i.id === d.dateAfterId);
    const source = inputs.find(i => i.id === d.id);
    if (!dep || !source) return false;
    if (dep.timestamp <= source.timestamp) {
      return false;
    }
    return p;
  }, true);
  return result;
}

export function getTemplateWednesdayAfterOpeningDay(
  openingDay: number,
) {
  const wednesdayOfNextWeekOpeningDay = moment
    .unix(openingDay)
    .add(1, 'week')
    .utc()
    .day("Wednesday")
    .startOf('day');

  return wednesdayOfNextWeekOpeningDay.unix();
}

export function getTemplateExchangeClosingWithBuffer(
  dayTimestamp: number,
  hour: number,
  minutes: number,
  offset: number
) {
  // one hour time buffer after lastest exchange closing is built in.
  const OneHourBuffer = 1;
  const closingDateTime = moment
    .unix(dayTimestamp)
    .utc()
    .startOf('day');

  closingDateTime.set({
    hour: hour - offset + OneHourBuffer,
    minute: minutes,
  });
  return closingDateTime.unix();
}

function closingDateDependencies(
  inputs: ExtraInfoTemplateInput[],
  endTime: number,
  closingDateDependencies: DateInputDependencies[]
) {
  if (!closingDateDependencies) return true;
  const deps = closingDateDependencies.filter(d => d.inputDateYearId);
  const result = deps.reduce((p, d) => {
    const dateYearSource = inputs.find(i => i.id === d.inputDateYearId);
    const exchangeValue = inputs.find(i => i.id === d.inputSourceId);
    if (!dateYearSource || !exchangeValue) return false;
    const timeOffset = d.inputTimeOffset[exchangeValue.value] as TimeOffset;
    if (timeOffset) {
      const closingDateTime = getTemplateExchangeClosingWithBuffer(
        Number(dateYearSource.timestamp),
        timeOffset.hour,
        timeOffset.minutes,
        timeOffset.offset
      );
      if (closingDateTime >= endTime) {
        return false;
      }
    }
    return p;
  }, true);
  return result;
}

function isRetiredAutofail(hash: string) {
  const found: RetiredTemplate = RETIRED_TEMPLATES.find(
    (t: RetiredTemplate) => t.hash === hash
  );
  if (!found) return false;
  return found.autoFail;
}

export const isTemplateMarket = (
  title,
  template: ExtraInfoTemplate,
  outcomes: string[],
  longDescription: string,
  endTime: string,
  errors: string[] = []
) => {
  if (
    !template ||
    !template.hash ||
    !template.question ||
    template.inputs.length === 0 ||
    !endTime
  ) {
    errors.push('value missing template | hash | question | inputs | endTime');
    return false;
  }

  try {
    if (isRetiredAutofail(template.hash)) {
      errors.push('template hash has been retired and set to auto-fail');
      return false;
    }

    const validation = TEMPLATE_VALIDATIONS[
      template.hash
    ] as TemplateValidation;
    if (!!!validation) {
      errors.push('no validation found for hash');
      return false;
    }

    // check market title/question matches built template question
    let checkMarketTitle = template.question;
    template.inputs.map((i: ExtraInfoTemplateInput) => {
      checkMarketTitle = checkMarketTitle.replace(`[${i.id}]`, i.value);
    });
    if (checkMarketTitle !== title) {
      errors.push('populated title does not match title given');
      return false;
    }

    // check ESTDATETIME isn't after market event expiration
    if (
      estimatedDateTimeAfterMarketEndTime(
        template.inputs,
        new BigNumber(endTime).toNumber()
      )
    ) {
      errors.push(
        'estimated schedule date time is after market event expiration endTime'
      );
      return false;
    }

    // check DATESTART isn't after market event expiration
    if (
      dateStartAfterMarketEndTime(
        template.inputs,
        new BigNumber(endTime).toNumber()
      )
    ) {
      errors.push('start date is after market event expiration endTime');
      return false;
    }

    // check DATE isn't on weekend or holiday
    if (
      !dateNoWeekendHoliday(
        template.inputs,
        validation.dateDependencies,
        validation.closingDateDependencies
      )
    ) {
      errors.push('market question date can not be on weekend or on a holiday');
      return false;
    }

    // check DATE dependencies
    if (
      !dateComparisonDependencies(template.inputs, validation.dateDependencies)
    ) {
      errors.push('market question end date can not be after start date');
      return false;
    }

    if (
      !closingDateDependencies(
        template.inputs,
        new BigNumber(endTime).toNumber(),
        validation.closingDateDependencies
      )
    ) {
      errors.push('event expiration can not be before exchange close time');
      return false;
    }

    if (
      !wednesdayAfterOpening(
        template.inputs,
        new BigNumber(endTime).toNumber(),
        validation.afterTuesdayDate
      )
    ) {
      errors.push('event expiration can not be before Wednesday after movie opening weekend');
      return false;
    }

    // check for input duplicates
    const values = template.inputs.map((i: ExtraInfoTemplateInput) => i.value);
    if (new Set(values).size !== values.length) {
      errors.push('template input values have duplicates');
      return false;
    }

    // check for outcome duplicates
    const outcomeValues = convertOutcomes(outcomes);
    if (new Set(outcomeValues).size !== outcomeValues.length) {
      errors.push('outcome array has duplicates');
      return false;
    }

    // reg ex to verify market question dropdown values and inputs
    if (
      !isValidTemplateMarket(validation.templateValidation, checkMarketTitle)
    ) {
      errors.push('populated market question does not match regex');
      return false;
    }

    // check that required outcomes exist
    if (!hasRequiredOutcomes(validation.requiredOutcomes, outcomeValues)) {
      errors.push('required outcomes are missing');
      return false;
    }

    // check that dropdown dep values are correct
    if (
      !hasMarketQuestionDependencies(
        validation.marketQuestionDependencies,
        template.inputs
      )
    ) {
      errors.push('market question dropdown dependencies values are incorrect');
      return false;
    }

    if (validation.outcomeDependencies !== null) {
      if (
        !isDependencyOutcomesCorrect(
          validation.outcomeDependencies,
          validation.requiredOutcomes,
          template.inputs,
          outcomeValues
        )
      ) {
        errors.push('outcome dependencies are incorrect');
        return false;
      }
    }

    if (
      !hasSubstituteOutcomes(
        template.inputs,
        validation.substituteDependencies,
        outcomeValues
      )
    ) {
      errors.push(
        'outcomes values from substituted market question inputs are incorrect'
      );
      return false;
    }
    // verify resolution rules
    const marketResolutionRules = hashResolutionRules(longDescription);
    if (marketResolutionRules !== validation.templateValidationResRules) {
      errors.push(
        'hash of resolution details is different than validation resolution rules hash'
      );
      return false;
    }

    return true;
  } catch (e) {
    console.error(e);
    errors.push(e);
    return false;
  }
};

//##RETIRED_TEMPLATES

//##TEMPLATES##

//##TEMPLATE_VALIDATIONS##
