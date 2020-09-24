import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import moment from 'moment';
import {
  REQUIRED,
  groupTypes,
  SECONDS_IN_A_DAY,
  FRIDAY_DAY_OF_WEEK,
  SATURDAY_DAY_OF_WEEK,
  SUNDAY_DAY_OF_WEEK,
  ReplaceAbbreviations,
} from '@augurproject/sdk-lite';

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
  inputDestIds?: number[];
  values: {
    [key: string]: string[];
  };
}

export interface PlaceholderValues {
  [id: number]: string;
}

export interface CategoricalOutcomes {
  [id: number]: string;
}

export interface EventExpEndNextMonth {
  id: number;
  yearDropdown?: number;
  monthDropdown?: number;
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

export interface NumberRangeValues {
  [id: number]: number[];
}

export interface TemplateValidations {
  [hash: string]: TemplateValidation;
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
  afterTuesdayDateNoFriday: number[];
  noAdditionalOutcomes: boolean;
  hoursAfterEstimatedStartTime: number;
  daysAfterStartDate: number;
  eventExpEndNextMonthValues: EventExpEndNextMonth[];
  categoricalOutcomes: CategoricalOutcomes;
  numberRangeValues: NumberRangeValues;
  yrs: number[]; // input ids of year and year ranges
  reqCats: string[];
}

export interface TemplateGroupKeys {
  groupType: string;
  groupLineId: number;
  estInputId?: number;
  header: string;
  title?: string;
  outcomes?: string[];
  keys: { key: string; id: number }[];
}
export interface TemplateGroup {
  [hash: string]: TemplateGroupKeys;
}
export interface TemplateValidationHash {
  [hash: string]: TemplateValidation;
}
export interface Template {
  hash: string;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
  resolutionRules: ResolutionRules;
  denomination?: string;
  tickSize?: number;
  minPrice?: number;
  maxPrice?: number;
  noAdditionalUserOutcomes?: boolean;
  groupName?: groupTypes; // type of group
  groupLineId?: number; // over under and spread markets to differentiate liquidity pools
  header?: string; // header for money line markets and top level markets
  title?: string; // market title for futures or non money line markets
  outcomes?: string[]; // sportsbook only, money line outcomes for non money line combined templates
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
  values?: string[];
  sublabel?: string;
  dateAfterId?: number;
  inputSourceId?: number; // input id as source of text to get list values
  defaultLabel?: string; // dropdown default label shown
  inputDestIds?: number[]; // target inputs to set list values
  categoryDestId?: number;
  eventExpEndNextMonth?: boolean;
  yearDropdown?: number;
  monthDropdown?: number;
  inputDestValues?: {
    // dropdown source data structure to use to set target input list values
    [key: string]: string[];
  };
  inputTimeOffset?: {
    [key: string]: TimeOffset;
  };
  setEndTime?: number;
  inputDateYearId?: number;
  hoursAfterEst?: number;
  holidayClosures?: {
    [key: string]: {
      [year: number]: {
        holiday: string;
        date: number;
      }[];
    };
  };
  noSort?: boolean;
  daysAfterDateStart?: number;
  denomination?: {
    [key: string]: string;
  };
  groupKey?: string;
  numberRange?: number[];
}

export interface RetiredTemplate {
  hash: string;
  autoFail: boolean;
}

export interface TemplateGroupInfo {
  hashKeyInputValues: string;
  groupType: string;
  groupLine?: string;
  estTimestamp?: string;
  header: string;
  title?: string;
  canPoolLiquidity: boolean;
  liquidityPoolId: string;
  placeholderOutcomes: string[];
}

export enum ValidationType {
  WHOLE_NUMBER = 'WHOLE_NUMBER',
  NUMBER = 'NUMBER',
  NUMBER_ONE_DECIMAL = 'NUMBER_ONE_DECIMAL',
  NOWEEKEND_HOLIDAYS = 'NOWEEKEND_HOLIDAYS',
  EXP_DATE_TUESDAY_AFTER_MOVIE_NO_FRIDAY = 'EXP_DATE_TUESDAY_AFTER_MOVIE_NO_FRIDAY',
  SOCIAL = 'SOCIAL', // social media username/handle
  YEAR_YEAR_RANGE = 'YEAR_YEAR_RANGE',
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
  TWITTER_HANDLE = 'Twitter Handle',
  INSTAGRAM_ACCOUNT = 'Instagram Account',
}

export enum TemplateInputType {
  TEXT = 'TEXT', // simple text input in market question
  DATEYEAR = 'DATEYEAR', // date picker in market question
  DATETIME = 'DATETIME', // date time with timezone picker
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
  [ValidationType.SOCIAL]: `[a-zA-Z0-9_]{1,15}`,
  [TemplateInputType.TEXT]: `(.*)`,
  [ValidationType.WHOLE_NUMBER]: `[1-9]*[0-9]+`,
  [ValidationType.NUMBER]: `[0-9]+(\\\.[0-9]+){0,1}`,
  [ValidationType.NUMBER_ONE_DECIMAL]: `[0-9]+(\.[0-9]{1}){0,1}`,
  [TemplateInputType.USER_DESCRIPTION_OUTCOME]: `(.*)`,
  [TemplateInputType.SUBSTITUTE_USER_OUTCOME]: `[0-9]+`,
  [TemplateInputType.DATETIME]: `(January|February|March|April|May|June|July|August|September|October|November|December){1} ([0]?[1-9]|[1-2][0-9]|3[0-1]), 20[0-9]{2} [0]?[1-9]|2[0-3]:[0-5][0-9] (AM|PM) \\(UTC 0\\)`,
  [TemplateInputType.DATEYEAR]: `(January|February|March|April|May|June|July|August|September|October|November|December){1} ([0]?[1-9]|[1-2][0-9]|3[0-1]), 20[0-9]{2}`,
};

export let TEMPLATE_VALIDATIONS = {};
export let RETIRED_TEMPLATES = [];
export let TEMPLATE_GROUPS = [];

export function hasTemplateTextInputs(hash: string, isCategorical: boolean) {
  const validation = TEMPLATE_VALIDATIONS[hash] as TemplateValidation;
  if (isCategorical) {
    if (
      !validation ||
      (!validation.placeholderValues &&
        Object.keys(validation.categoricalOutcomes).length > 0)
    )
      return false;
    return (
      Object.keys(validation.placeholderValues).length > 0 ||
      Object.keys(validation.categoricalOutcomes).length === 0
    );
  } else {
    if (!validation || !validation.placeholderValues) return false;
    return Object.keys(validation.placeholderValues).length > 0;
  }
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
    requiredOutcomes.filter((r) => outcomes.includes(r)).length ===
    requiredOutcomes.length
  );
}

export function generateResolutionRulesHash(rules: ResolutionRules) {
  let hash = null;
  if (!rules || !rules[REQUIRED]) return hash;
  try {
    const details = rules[REQUIRED].map((r) => r.text).join('\n');
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

function hashGroupKeyValues(keyValues: string[]): string {
  const params = JSON.stringify(keyValues);
  const value = `0x${Buffer.from(params, 'utf8').toString('hex')}`;
  return ethers.utils.sha256(value);
}

export const isValidTemplateMarket = (
  templateValidation: string,
  marketTitle: string
) => {
  if (!templateValidation || !templateValidation) return false;
  return !!marketTitle.match(templateValidation);
};

function hasMarketQuestionDependencies(
  validationDep: DropdownDependencies,
  inputs: ExtraInfoTemplateInput[]
) {
  if (!validationDep) return true;
  const input = inputs.find((i) => i.id === validationDep.inputSourceId);
  if (!input) return false;
  const correctValues = validationDep.values[input.value] || [];
  const testValues = inputs.filter((i) =>
    validationDep.inputDestIds.includes(i.id)
  );
  if (!testValues) return false;
  return (
    testValues.length ===
    testValues.filter((value) => correctValues.includes(value.value)).length
  );
}

function isDependencyOutcomesCorrect(
  validationDep: DropdownDependencies,
  requiredOutcomes: string[],
  inputs: ExtraInfoTemplateInput[],
  outcomes: string[]
) {
  let result = false;
  const testOutcomes = outcomes.filter((o) => !requiredOutcomes.includes(o));

  if (validationDep) {
    const input = inputs.find((i) => i.id === validationDep.inputSourceId);
    if (!input) return false;
    const correctValues = validationDep.values[input.value] || [];
    result =
      testOutcomes.filter((o) => correctValues.includes(o)).length ===
      testOutcomes.length;
  }
  return result;
}

function estimatedDateTimeAfterMarketEndTime(
  inputs: ExtraInfoTemplateInput[],
  hoursAfterEstimatedStartTime: number,
  endTime: number
) {
  const input = inputs.find((i) => i.type === TemplateInputType.ESTDATETIME);
  if (!input) return false;
  // add number of hours to estimated start timestamp then compare to market event expiration
  const secondsAfterEst = hoursAfterEstimatedStartTime * 60 * 60;
  return Number(input.timestamp) + secondsAfterEst > Number(endTime);
}
function daysRequiredAfterStartDate(
  inputs: ExtraInfoTemplateInput[],
  daysAfterStartDate: number,
  endTime: number
) {
  const input = inputs.find((i) => i.type === TemplateInputType.DATEYEAR);
  if (!input || !daysAfterStartDate) return true;
  // add number of hours to estimated start timestamp then compare to market event expiration
  const secondsAfterStartDate = SECONDS_IN_A_DAY.multipliedBy(
    daysAfterStartDate
  ).toNumber();
  const dayTimestamp = getDateYearTimestamp(input.value)
  return dayTimestamp + secondsAfterStartDate >= Number(endTime);
}

function daysRequiredAfterMonthDate(
  inputs: ExtraInfoTemplateInput[],
  eventExpEndNextMonthValues: EventExpEndNextMonth[],
  endTime: number
) {
  if (eventExpEndNextMonthValues.length === 0) return true;
  const monthId = eventExpEndNextMonthValues.find(
    (i) => i.yearDropdown !== undefined
  );
  const yearId = eventExpEndNextMonthValues.find(
    (i) => i.monthDropdown !== undefined
  );

  const monthInput = monthId && inputs.find((i) => i.id === monthId.id);
  const yearInput = yearId && inputs.find((i) => i.id === yearId.id);

  if (!monthInput || !yearInput) return false;
  const newEndTime = moment()
    .utc()
    .month(monthInput.value)
    .year(Number(yearInput.value))
    .add(1, 'M')
    .endOf('month')
    .seconds(0)
    .unix();
  if (newEndTime > Number(endTime)) {
    return false;
  } else return true;
}

function isDateInQuestionValid(
  inputs: ExtraInfoTemplateInput[],
  endTime: number,
  creationTime: number
): boolean {
  const filteredInputs = inputs.filter((i) =>
    [
      String(TemplateInputType.DATEYEAR),
      String(TemplateInputType.DATETIME),
      String(TemplateInputType.ESTDATETIME),
    ].includes(i.type)
  );
  if (!filteredInputs || filteredInputs.length === 0) return true;
  return filteredInputs.reduce((p, input) => {
    const timestamp =
      input.type === TemplateInputType.DATEYEAR
        ? getDateYearTimestamp(input.value)
        : Number(input.timestamp);
    if (!timestamp) return false;
    if (
      Number(timestamp) > Number(endTime) ||
      Number(creationTime) > Number(timestamp)
    ) {
      return false;
    }
    return p;
  }, true);
}

function IsOnOrAfterWednesdayAfterOpeningOnOpeningFriday(
  inputs: ExtraInfoTemplateInput[],
  endTime: number,
  ids: number[]
) {
  if (!ids || ids.length === 0) return true;
  const afterTuesday: ExtraInfoTemplateInput = inputs.find(
    (i) => ids && ids.includes(i.id)
  );
  const onFridayOpening = inputs.find(
    (i) => i.type === TemplateInputType.DATEYEAR
  );
  if (!afterTuesday && !onFridayOpening) return true;
  if (
    onFridayOpening &&
    moment.unix(getDateYearTimestamp(onFridayOpening.value)).weekday() !==
      FRIDAY_DAY_OF_WEEK
  ) {
    return false;
  } else {
    const wednesdayDatetime = getTemplateWednesdayAfterOpeningDay(
      getDateYearTimestamp(afterTuesday.value)
    );
    return wednesdayDatetime <= endTime;
  }
}

export function tellOnHoliday(
  inputs: ExtraInfoTemplateInput[],
  input: ExtraInfoTemplateInput,
  closing: DateInputDependencies
) {
  let holidayPresent = null;
  const exchange = inputs.find((i) => i.id === closing.inputSourceId);
  if (!exchange) return 'exchange not found'; //exchange is required
  if (exchange.value) {
    const holidayClosures = closing.holidayClosures[exchange.value];
    const inputYear = moment.unix(Number(input.timestamp)).year();
    const holidayClosuresPerYear =
      holidayClosures && holidayClosures[inputYear];
    if (holidayClosuresPerYear) {
      const userTimestamp = moment.unix(Number(input.timestamp));
      holidayClosuresPerYear.forEach((holiday) => {
        const holidayDate = moment(
          `${holiday.date} ${inputYear}`,
          'MMM DD YYYY'
        ).startOf('day');
        const sameDay = userTimestamp.isSame(holidayDate, 'day');
        if (sameDay) {
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
  const deps = dateDependencies.filter((d) => d.noWeekendHolidays);
  const result = deps.reduce((p, d) => {
    const input = inputs.find((i) => i.id === d.id);
    if (!input) return false;
    const dayOfWeek = moment.unix(Number(input.timestamp)).weekday();
    if (
      dayOfWeek === SATURDAY_DAY_OF_WEEK ||
      dayOfWeek === SUNDAY_DAY_OF_WEEK
    ) {
      return false;
    }
    closingDateDependencies.forEach((closing) => {
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
  const depBefore = dateDependencies.find((d) => d.dateAfterId);
  if (!depBefore) return true;
  const mustBeforeDate = inputs.find((i) => i.id === depBefore.dateAfterId);
  const source = inputs.find((i) => i.id === depBefore.id);
  if (!source || !mustBeforeDate) return false;
  if (source.timestamp <= mustBeforeDate.timestamp) {
    return false;
  }
  return true;
}

export function getTemplateWednesdayAfterOpeningDay(openingDay: number) {
  const wednesdayOfNextWeekOpeningDay = moment
    .unix(openingDay)
    .add(1, 'week')
    .utc()
    .day('Wednesday')
    .startOf('day');

  return wednesdayOfNextWeekOpeningDay.unix();
}

function getDateYearTimestamp(dayFormat: string): number {
  const dayTimestamp = moment(dayFormat, 'MMMM D, YYYY', true);
  if(!dayTimestamp.isValid()) return 0;
  return dayTimestamp.startOf('day').unix();
}

export function getExchangeClosingWithBufferGivenDay(
  dayFormat: string,
  hour: number,
  minutes: number,
  offset: number,
) {
  // one hour time buffer after lastest exchange closing is built in.
  const OneHourBuffer = 1;
  const startOfDay = moment.unix(getDateYearTimestamp(dayFormat));
  if(!startOfDay.isValid()) return 0;
  startOfDay.set({
    hour: hour - offset + OneHourBuffer,
    minute: minutes,
  });
  return startOfDay.unix();
}

function closingDateDependenciesCheck(
  inputs: ExtraInfoTemplateInput[],
  endTime: number,
  creationTime: number,
  closingDateDependencies: DateInputDependencies[]
) {
  if (!closingDateDependencies) return true;
  const deps = closingDateDependencies.filter((d) => d.inputDateYearId);
  const result = deps.reduce((p, d) => {
    const dateYearSource = inputs.find((i) => i.id === d.inputDateYearId);
    const exchangeValue = inputs.find((i) => i.id === d.inputSourceId);
    if (!dateYearSource || !exchangeValue || !dateYearSource.value)
      return false;
    const timeOffset = d.inputTimeOffset[exchangeValue.value] as TimeOffset;
    if (timeOffset) {
      const closingDateTime = getExchangeClosingWithBufferGivenDay(
        dateYearSource.value,
        timeOffset.hour,
        timeOffset.minutes,
        timeOffset.offset
      );
      if (closingDateTime > endTime || creationTime > closingDateTime) {
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

export const populateTemplateTitle = (
  templateString,
  inputs,
  useAbbrivations
) => {
  let title = inputs.reduce((acc, input) => {
    return acc.replace(`[${input.id}]`, `${input.value}`);
  }, templateString);
  if (useAbbrivations) {
    title = Object.keys(ReplaceAbbreviations).reduce(
      (p, abbr) => p.replace(abbr, ReplaceAbbreviations[abbr]),
      title
    );
  }
  return title;
};

export function getGroupHashInfo({
  hash,
  inputs,
}: ExtraInfoTemplate): TemplateGroupInfo {
  const defaultValues = {
    hashKeyInputValues: undefined,
    groupType: undefined,
    groupLine: undefined,
    header: undefined,
    title: undefined,
    estTimestamp: undefined,
    canPoolLiquidity: false,
    liquidityPoolId: undefined,
    placeholderOutcomes: undefined,
  };
  if (!hash || !inputs) return defaultValues;
  const hashGroup: TemplateGroupKeys = TEMPLATE_GROUPS.find((g) => g[hash]);
  if (!hashGroup) return defaultValues;
  const group = hashGroup[hash];
  const keyValues = group.keys.map((key) =>
    String(inputs.find((i) => i.id === key.id).value)
  );
  const hashKeyInputValues = hashGroupKeyValues(keyValues);
  const groupLine = group?.groupLineId
    ? inputs[group.groupLineId].value
    : undefined;
  const estTimestamp = group?.estInputId
    ? inputs.find((i) => String(i.id) === String(group.estInputId))?.timestamp
    : undefined;
  const header = group.header
    ? populateTemplateTitle(group.header, inputs, true)
    : undefined;
  const title = group.title
    ? populateTemplateTitle(group.title, inputs, true)
    : undefined;
  let liquidityPoolId = undefined;
  const canPoolLiquidity = !hasTemplateTextInputs(hash, true);
  if (canPoolLiquidity) {
    liquidityPoolId = hashGroupKeyValues({
      ...keyValues,
      hash: hash,
      groupLine: groupLine,
    });
  }
  const moneyLineOutcomes = group?.outcomes;
  let placeholderOutcomes = undefined;
  if (moneyLineOutcomes) {
    placeholderOutcomes = moneyLineOutcomes.map((o) =>
      populateTemplateTitle(o, inputs, false)
    );
  }

  return {
    hashKeyInputValues,
    groupType: group.groupType,
    groupLine,
    estTimestamp,
    header,
    title,
    canPoolLiquidity,
    liquidityPoolId,
    placeholderOutcomes,
  };
}

function inputWithinNumericRange(
  inputs: ExtraInfoTemplateInput[],
  numberRangeValues: NumberRangeValues
) {
  let passes = true;
  if (!numberRangeValues || Object.keys(numberRangeValues).length === 0)
    return passes;
  Object.keys(numberRangeValues).forEach((index) => {
    const input = inputs.find((i) => String(i.id) === String(index));
    const range = numberRangeValues[index];
    if (
      Number(input.value) < Number(range[0]) ||
      Number(input.value) > Number(range[1])
    ) {
      passes = false;
    }
  });
  return passes;
}

export function isValidYearYearRangeInQuestion(
  inputs: ExtraInfoTemplateInput[],
  yearYearRangeInputs: number[],
  endTime: number,
  creationTime: number
) {
  const yearInputs = inputs.filter((input) =>
    yearYearRangeInputs.includes(input.id)
  );
  if (!yearInputs || yearInputs.length === 0) return true;
  const endTimeYear = moment.unix(endTime).utc().year();
  const creationTimeYear = moment.unix(creationTime).utc().year();
  return yearInputs.reduce((p, input: ExtraInfoTemplateInput) => {
    const years = input.value
      ?.split('-')
      .map((year) => (year.length === 2 ? `20${year}` : year));
    const testYear = years.length === 1 ? years[0] : years[1];
    if (!testYear) return false;
    if (Number(testYear) < creationTimeYear) return false;
    if (Number(testYear) > endTimeYear) return false;
    return p;
  }, true);
}

function isMarketInAllCorrectCategories(
  categories: string[],
  requiredCategories: string[]
): boolean {
  if ((!categories || categories.length === 0) && requiredCategories.length > 0)
    return false;
  return requiredCategories.reduce(
    (p, c, index) =>
      String(c).toLowerCase() !== String(categories[index]).toLowerCase()
        ? false
        : p,
    true
  );
}

export const isTemplateMarket = (
  title,
  template: ExtraInfoTemplate,
  outcomes: string[],
  longDescription: string,
  endTime: string,
  creationTime: string,
  categories: string[],
  errors: string[] = []
) => {
  if (
    !template ||
    !template.hash ||
    !template.question ||
    template.inputs.length === 0 ||
    !endTime ||
    !creationTime
  ) {
    errors.push(
      'value missing template | hash | question | inputs | endTime | creationTime'
    );
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
      checkMarketTitle = checkMarketTitle.replace(
        `[${i.id}]`,
        String(i.value).trim()
      );
    });
    if (checkMarketTitle !== title) {
      errors.push('populated title does not match title given');
      return false;
    }

    if (
      !inputWithinNumericRange(template.inputs, validation.numberRangeValues)
    ) {
      errors.push('numeric input is outside of valid numeric range');
      return false;
    }
    // check ESTDATETIME isn't after market event expiration or is within required hour buffer
    if (
      estimatedDateTimeAfterMarketEndTime(
        template.inputs,
        validation.hoursAfterEstimatedStartTime,
        new BigNumber(endTime).toNumber()
      )
    ) {
      errors.push(
        'estimated schedule date time is after market event expiration endTime'
      );
      return false;
    }
    if (
      !daysRequiredAfterStartDate(
        template.inputs,
        validation.daysAfterStartDate,
        new BigNumber(endTime).toNumber()
      )
    ) {
      errors.push(
        'start date in question is not the required number of days before market event expiration endTime'
      );
      return false;
    }

    if (
      !daysRequiredAfterMonthDate(
        template.inputs,
        validation.eventExpEndNextMonthValues,
        new BigNumber(endTime).toNumber()
      )
    ) {
      errors.push(
        'month and year in question is not a month before market event expiration endTime'
      );
      return false;
    }

    // check DATEYEAR, ... isn't after market creation date and endTime isn't before
    if (
      !isDateInQuestionValid(
        template.inputs,
        new BigNumber(endTime).toNumber(),
        new BigNumber(creationTime).toNumber()
      )
    ) {
      errors.push(
        'date in market question can not be before market creationTime or after event expiration'
      );
      return false;
    }
    if (
      !isValidYearYearRangeInQuestion(
        template.inputs,
        validation.yrs,
        new BigNumber(endTime).toNumber(),
        new BigNumber(creationTime).toNumber()
      )
    ) {
      errors.push(
        'year in market question can not be before market creationTime year or after event expiration year'
      );
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
      !closingDateDependenciesCheck(
        template.inputs,
        new BigNumber(endTime).toNumber(),
        new BigNumber(creationTime).toNumber(),
        validation.closingDateDependencies
      )
    ) {
      errors.push(
        'event expiration can not be before exchange close time, or market creation after exchange close time'
      );
      return false;
    }

    if (
      !IsOnOrAfterWednesdayAfterOpeningOnOpeningFriday(
        template.inputs,
        new BigNumber(endTime).toNumber(),
        validation.afterTuesdayDateNoFriday
      )
    ) {
      errors.push(
        'event expiration can not be before Wednesday after movie opening weekend and/or opening day must be a friday'
      );
      return false;
    }

    // check for input duplicates
    const values = template.inputs.map((i: ExtraInfoTemplateInput) => i.value);
    if (new Set(values).size !== values.length) {
      errors.push('template input values have duplicates');
      return false;
    }

    // check for outcome duplicates
    if (new Set(outcomes).size !== outcomes.length) {
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
    if (!hasRequiredOutcomes(validation.requiredOutcomes, outcomes)) {
      errors.push('required outcomes are missing');
      return false;
    }

    // check no additional outcomes is a requirement
    if (
      validation.noAdditionalOutcomes &&
      validation.requiredOutcomes.length !== outcomes.length
    ) {
      errors.push(
        'no additioanl outcomes is a requirement, only required outcomes are allowed'
      );
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
          outcomes
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
        outcomes
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
        'hash of resolution details  is different than validation resolution rules hash'
      );
      return false;
    }

    // verify template market is in correct categories
    if (!isMarketInAllCorrectCategories(categories, validation.reqCats)) {
      errors.push('templated market does not have correct categories');
      // https://github.com/AugurProject/augur/issues/8761 full details
      // only applies to markets created after Thursday, July 30, 2020 7:00:00 PM
      if (new BigNumber(creationTime).gt(1596135600)) {
        return false;
      }
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

//##TEMPLATE_GROUPS##
