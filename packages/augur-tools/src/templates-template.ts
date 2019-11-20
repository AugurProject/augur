import { ethers } from 'ethers';
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
export const STOCKS = 'Stocks';
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
  values: {
    [key: string]: string[];
  };
}
export interface TemplateValidation {
  [hash: string]: {
    templateValidation: string;
    templateValidationResRules: string;
    requiredOutcomes: string[];
    outcomeDependencies: DropdownDependencies;
  }
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
  inputSourceId?: number;
}

export enum ValidationType {
  WHOLE_NUMBER = 'WHOLE_NUMBER',
  NUMBER = 'NUMBER',
}

export enum TemplateInputType {
  TEXT = 'TEXT', // simple text input in market question
  DATEYEAR = 'DATEYEAR', // date picker in market question
  DATETIME = 'DATETIME', // date time with timezone picker
  ESTDATETIME = 'ESTDATETIME', // estimated scheduled start time date time picker with timezone
  DROPDOWN = 'DROPDOWN', // dropdown list, found in market question
  DENOMINATION_DROPDOWN = 'DENOMINATION_DROPDOWN', // list of denomination values for scalar market
  ADDED_OUTCOME = 'ADDED_OUTCOME', // required outcome that is added to categorical market template
  USER_DESCRIPTION_OUTCOME = 'USER_DESCRIPTION_OUTCOME', // simple text input that is in question and added to categorical market outcomes
  SUBSTITUTE_USER_OUTCOME = 'SUBSTITUTE_USER_OUTCOME', // subsitites market question value in outcome for categorical market template
  USER_DESCRIPTION_DROPDOWN_OUTCOME = 'USER_DESCRIPTION_DROPDOWN_OUTCOME', // dropdown in market question that is added as categorical market outcome
  USER_DROPDOWN_OUTCOME = 'USER_DROPDOWN_OUTCOME', // dropdown for categorical market outcome, doesn't interact with market question.
  USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP = 'USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP', // dropdown for categorical market outcome, the list of values is determined by dropdown in market question.
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
  inputs: ExtraInfoTemplateInput[]
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
  [TemplateInputType.DATEYEAR]: `(January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})`
};

export let TEMPLATE_VALIDATIONS = {};

function hasRequiredOutcomes(requiredOutcomes: string[], outcomes: string[]) {
  return requiredOutcomes.filter(r => outcomes.includes(r)).length === requiredOutcomes.length;
}

export function generateResolutionRulesHash(rules: ResolutionRules) {
  let hash = null;
  if (!rules || !rules[REQUIRED]) return hash;
  try {
    const details = rules[REQUIRED].map(r => r.text).join('\n');
    hash = hashResolutionRules(details);
  } catch(e) {
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
    return Buffer.from(outcomeDescription, 'hex').toString()
  })
}

export const isTemplateMarket = (title, template: ExtraInfoTemplate, outcomes: string[], longDescription: string) => {
  let result = false;
  if (!template || !template.hash || !template.question || template.inputs.length === 0) return result;

  try {

    const validation = TEMPLATE_VALIDATIONS[template.hash];
    if (!!!validation) return result;

    // check market title/question matches built template question
    let checkMarketTitle = template.question;
    template.inputs.map((i: ExtraInfoTemplateInput) => {
      checkMarketTitle = checkMarketTitle.replace(`[${i.id}]`, i.value);
    });
    if (checkMarketTitle !== title) return result;

    // check for input duplicates
    const values = template.inputs.map((i: ExtraInfoTemplateInput) => i.value);
    if (new Set(values).size !== values.length) return result;

    // check for outcome duplicates
    const outcomeValue = convertOutcomes(outcomes);
    if (new Set(outcomeValue).size !== outcomeValue.length) return result;

    // reg ex to verify market question dropdown values and inputs
    console.log(validation.templateValidation);
    console.log(checkMarketTitle);
    result = isValidTemplateMarket(validation.templateValidation, checkMarketTitle);

    // check that required outcomes exist
    if (hasRequiredOutcomes(validation.requiredOutcomes, outcomeValue)) return result;

    // verify resolution rules
    const marketResolutionRules = hashResolutionRules(longDescription);
    if (marketResolutionRules !== validation.templateValidationResRules) return result;

  } catch (e) {
    console.error(e);
  }
  return result;
};

//##TEMPLATES##


//##TEMPLATE_VALIDATIONS##
