import { ethers } from 'ethers';
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
export const SOCCER = 'Soccer';
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

export type UserInputtedType =
  | UserInputText
  | UserInputDateYear
  | UserInputDateTime
  | UserInputDropdown
  | UserInputUserOutcome;

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
export interface TemplateValidation {
  templateValidation: string;
  templateValidationResRules: string;
  requiredOutcomes: string[];
  outcomeDependencies: DropdownDependencies;
  substituteDependencies: string[];
  marketQuestionDependencies: DropdownDependencies;
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
  inputSourceId?: number; // input id as source of text to get list values
  defaultLabel?: string; // dropdown default label shown
  inputDestId?: number; // target input to set list values
  inputDestValues: { // dropdown source data structure to use to set target input list values
    [key: string]: ValueLabelPair[];
  }
}

export interface RetiredTemplate {
  hash: string;
  autoFail: boolean;
}

export enum ValidationType {
  WHOLE_NUMBER = 'WHOLE_NUMBER',
  NUMBER = 'NUMBER',
}

export enum TemplateInputType {
  TEXT = 'TEXT', // simple text input in market question
  DATEYEAR = 'DATEYEAR', // date picker in market question
  DATETIME = 'DATETIME', // date time with timezone picker
  DATESTART = 'DATESTART',
  ESTDATETIME = 'ESTDATETIME', // estimated scheduled start time date time picker with timezone
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
  [ValidationType.WHOLE_NUMBER]: `[0-9]*`,
  [ValidationType.NUMBER]: `[0-9]+\.*[0-9]*`,
  [TemplateInputType.USER_DESCRIPTION_OUTCOME]: `(.*)`,
  [TemplateInputType.SUBSTITUTE_USER_OUTCOME]: `[0-9]*`,
  [TemplateInputType.DATETIME]: `(January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) \d\d:\d\d (AM|PM) \\(UTC 0\\)`,
  [TemplateInputType.DATEYEAR]: `(January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})`,
};

export let TEMPLATE_VALIDATIONS = {};
export let RETIRED_TEMPLATES = [];

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
  return requiredOutcomes.filter(r => outcomes.includes(r)).length === requiredOutcomes.length;
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

export const isValidTemplateMarket = (templateValidation: string, marketTitle: string) => {
  if (!templateValidation || !templateValidation) return false;
  return !!marketTitle.match(templateValidation);
};

function convertOutcomes(outcomes: string[]) {
  if (!outcomes) return [];
  return outcomes.map(o => {
    const outcomeDescription = o.replace('0x', '');
    const value = Buffer.from(outcomeDescription, 'hex').toString();
    return [...value].reduce((p, i) => i.charCodeAt(0) !== 0 ? [...p,i] : p, []).join('')
  });
}

function hasMarketQuestionDependencies(validationDep: DropdownDependencies, inputs: ExtraInfoTemplateInput[]) {
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
      result = testOutcomes.filter(o => correctValues.includes(o)).length === testOutcomes.length;
  }
  return result;
}

function estimatedDateTimeAfterMarketEndTime(inputs: ExtraInfoTemplateInput[], endTime: number) {
  const input = inputs.find(i => i.type === TemplateInputType.ESTDATETIME);
  if (!input) return false;
  return Number(input.timestamp) >= Number(endTime);
}

function dateStartAfterMarketEndTime(inputs: ExtraInfoTemplateInput[], endTime: number) {
  const input = inputs.find(i => i.type === TemplateInputType.DATESTART);
  if (!input) return false;
  return Number(input.timestamp) >= Number(endTime);
}

function isRetiredAutofail(hash:string) {
  const found: RetiredTemplate = RETIRED_TEMPLATES.find((t: RetiredTemplate) => t.hash === hash);
  if (!found) return false;
  return found.autoFail;
}

export const isTemplateMarket = (title, template: ExtraInfoTemplate, outcomes: string[], longDescription: string, endTime: string, errors: string[] = []) => {
  if (!template || !template.hash || !template.question || template.inputs.length === 0 || !endTime) {
    errors.push('value missing template | hash | question | inputs | endTime');
    return false;
  }

  try {
    if (isRetiredAutofail(template.hash)){
      errors.push('template hash has been retired and set to auto-fail');
      return false;
    }

    const validation = TEMPLATE_VALIDATIONS[template.hash] as TemplateValidation;
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
    if (estimatedDateTimeAfterMarketEndTime(template.inputs, new BigNumber(endTime).toNumber())) {
      errors.push('estimated schedule date time is after market event expiration endTime');
      return false;
    }

    // check DATESTART isn't after market event expiration
    if (dateStartAfterMarketEndTime(template.inputs, new BigNumber(endTime).toNumber())) {
      errors.push('start date is after market event expiration endTime');
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
    if (!isValidTemplateMarket(validation.templateValidation, checkMarketTitle)) {
      errors.push('populated market question does not match regex');
      return false;
    }

    // check that required outcomes exist
    if (!hasRequiredOutcomes(validation.requiredOutcomes, outcomeValues)) {
      errors.push('required outcomes are missing');
      return false;
    }

    // check that dropdown dep values are correct
    if (!hasMarketQuestionDependencies(validation.marketQuestionDependencies, template.inputs)) {
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
      ){
        errors.push('outcome dependencies are incorrect');
        return false;
      }
    }

    if (!hasSubstituteOutcomes(template.inputs, validation.substituteDependencies, outcomeValues)) {
      errors.push('outcomes values from substituted market question inputs are incorrect');
      return false;
    }
    // verify resolution rules
    const marketResolutionRules = hashResolutionRules(longDescription);
    if (marketResolutionRules !== validation.templateValidationResRules) {
      errors.push('hash of resolution details is different than validation resolution rules hash');
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
