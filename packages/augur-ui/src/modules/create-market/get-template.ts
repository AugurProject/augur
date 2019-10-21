import { CATEGORICAL, YES_NO, SCALAR } from 'modules/common/constants';
import {
  SOCCER,
  AMERICAN_FOOTBALL,
  BASEBALL,
  SPORTS,
  ENTERTAINMENT,
  POLITICS,
  US_POLITICS,
  WORLD,
  FINANCE,
  CRYPTO,
  MARKET_TEMPLATES,
  MARKET_SUB_TEMPLATES,
  MARKET_TYPE_TEMPLATES,
  MarketCardTemplate,
  BASKETBALL,
  HOCKEY,
  HORSE_RACING,
  TENNIS,
  GOLF,
} from 'modules/create-market/constants';
import { LIST_VALUES } from 'modules/create-market/template-list-values';
import { ValueLabelPair, TimezoneDateObject } from 'modules/types';
import deepClone from 'utils/deep-clone';
import { Getters } from '@augurproject/sdk';
import { formatDai } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';

export const OPTIONAL = 'OPTIONAL';
export const CHOICE = 'CHOICE';

export enum TemplateInputTypeNames {
  TEAM_VS_TEAM_BIN = 'TEAM_VS_TEAM_BIN',
  TEAM_VS_TEAM_CAT = 'TEAM_VS_TEAM_CAT',
  OVER_UNDER = 'OVER_UNDER',
  TEAM_VS_TEAM_POINTS_BIN = 'TEAM_VS_TEAM_POINTS_BIN',
  TEAM_WINS_BIN_YEAR = 'TEAM_WINS_BIN_YEAR',
  TEAM_WINS_EVENT = 'TEAM_WINS_EVENT',
  PLAYER_AWARD = 'PLAYER_AWARD',
  YEAR_EVENT = 'YEAR_EVENT',
  BASEBALL_YEAR_EVENT = 'BASEBALL_YEAR_EVENT',
  TEAM_WINS_EVENT_YEAR = 'TEAM_WINS_EVENT_YEAR',
  ENTERTAINMNET_AWARDS_BIN = 'ENTERTAINMNET_AWARDS_BIN',
  ENTERTAINMNET_AWARDS_BIN_2 = 'ENTERTAINMNET_AWARDS_BIN_2',
  ENTERTAINMNET_AWARDS_BIN_3 = 'ENTERTAINMNET_AWARDS_BIN_3',
  ENTERTAINMNET_AWARDS_BIN_4 = 'ENTERTAINMNET_AWARDS_BIN_4',
  ENTERTAINMNET_AWARDS_CAT = 'ENTERTAINMNET_AWARDS_CAT',
}

export enum TemplateInputType {
  TEXT = 'TEXT',
  DATEYEAR = 'DATEYEAR',
  DATETIME = 'DATETIME',
  DROPDOWN = 'DROPDOWN',
  DENOMINATION_DROPDOWN = 'DENOMINATION_DROPDOWN',
  ADDED_OUTCOME = 'ADDED_OUTCOME',
  USER_DESCRIPTION_OUTCOME = 'USER_DESCRIPTION_TEXT',
  SUBSTITUTE_USER_OUTCOME = 'SUBSTITUTE_USER_OUTCOME',
}

export enum ValidationType {
  WHOLE_NUMBER = 'WHOLE_NUMBER',
  NUMBER = 'NUMBER',
}

export interface UserInputText {
  value: string;
}

export interface UserInputDateYear extends UserInputText {}
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

export type UserInputtedType =
  | UserInputText
  | UserInputDateYear
  | UserInputDateTime
  | UserInputDropdown
  | UserInputUserOutcome;

export interface CategoryList {
  [category: string]: [
    {
      [category: string]: [
        {
          [index: number]: string;
        }
      ];
    }
  ];
}

interface TemplateChildren {
  [category: string]: CategoryTemplate;
}

interface CategoryTemplate {
  templates: Template[];
  children: TemplateChildren;
}

interface ResolutionRule {
  text: string;
  isSelected?: boolean;
}

interface ResolutionRules {
  [OPTIONAL]: ResolutionRule[];
  [CHOICE]: ResolutionRule[];
}

export interface Template {
  templateId: string;
  categories: Categories;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
  inputsType: TemplateInputTypeNames;
  resolutionRules: ResolutionRules;
  denomination: string;
}

export interface TemplateInput {
  id: number;
  type: TemplateInputType;
  placeholder: string;
  tooltip?: string;
  userInput?: string;
  userInputObject?: UserInputtedType;
  values?: ValueLabelPair[];
}

export interface Categories {
  primary: string;
  secondary: string;
}

export const getTemplateRadioCardsMarketTypes = (categories: Categories) => {
  if (!categories || !categories.primary) return MARKET_TYPE_TEMPLATES;
  const templates = getTemplates(categories, null, false);
  if (!templates) return [];
  const marketTypes = templates.reduce((p, t) => [...p, t.marketType], []);
  return [...new Set(marketTypes)].map(m =>
    MARKET_TYPE_TEMPLATES.find(t => t.value === m)
  );
};

export const getTemplateRadioCards = (
  categories: Categories,
  categoryStats: Getters.Markets.CategoryStats | null
): MarketCardTemplate[] => {
  const cats = getTemplateCategories(categories);
  if (cats.length === 0) return [];
  if (!categories.primary) {
    return cats
      .map(c => MARKET_TEMPLATES.find(t => t.value === c))
      .map(c => addCategoryStats(categories, c, categoryStats));
  }

  const useParentValues = hasNoTemplateCategoryChildren(categories.primary);

  if (categories.primary && (useParentValues || !categories.secondary)) {
    return cats
      .map(c =>
        MARKET_SUB_TEMPLATES[categories.primary].find(t => t.value === c)
      )
      .map(c => addCategoryStats(categories, c, categoryStats));
  }

  if (categories.primary && categories.secondary) {
    return cats
      .map(c =>
        MARKET_SUB_TEMPLATES[categories.primary].find(t => t.value === c)
      )
      .map(c => addCategoryStats(categories, c, categoryStats));
  }

  return [];
};

export const addCategoryStats = (
  categories: Categories | null,
  card: MarketCardTemplate,
  categoryStats: Getters.Markets.CategoryStats
): MarketCardTemplate => {
  if (!categoryStats) return card;
  if (!card) return card;
  let stats = null;
  const cardValue = card.value.toLowerCase();
  if (!categories || !categories.primary) stats = categoryStats[cardValue];
  if (categories && categories.primary && !categories.secondary) {
    const catStats = categoryStats[categories.primary.toLowerCase()];
    stats = catStats.categories[cardValue];
  }
  if (categories && categories.primary && categories.secondary) {
    let catStats = categoryStats[categories.primary.toLowerCase()];
    catStats = catStats[categories.secondary.toLowerCase()];
    stats = catStats.categories[cardValue];
  }
  if (stats) {
    const vol = formatDai(stats.volume || '0').formatted;
    const mkrLabel = stats.numberOfMarkets === 1 ? 'Market' : 'Markets';
    card.description = `${stats.numberOfMarkets} ${mkrLabel} | $${vol}`;
  }
  return card;
};

const getTemplateCategories = (categories: Categories): string[] => {
  let emptyCats = [];
  if (!categories || !categories.primary) return Object.keys(TEMPLATES);
  const primaryCat = TEMPLATES[categories.primary];
  if (!primaryCat) return emptyCats;
  if (!categories.secondary)
    return primaryCat.children ? Object.keys(primaryCat.children) : [];
  const secondaryCat = primaryCat.children
    ? primaryCat.children[categories.secondary]
    : emptyCats;
  if (!secondaryCat) return emptyCats;
  return secondaryCat.children ? Object.keys(secondaryCat.children) : [];
};

export const getTemplates = (
  categories: Categories,
  marketType: string,
  filterByMarketType: boolean = true
): Template[] => {
  if (!marketType && filterByMarketType) return [];
  let categoryTemplates: CategoryTemplate = TEMPLATES[categories.primary];

  if (!categoryTemplates) return [];

  const useParentValues = hasNoTemplateCategoryChildren(categories.primary);
  if (!categories.secondary || useParentValues)
    return filterByMarketType
      ? getTemplatesByMarketType(categoryTemplates.templates, marketType)
      : categoryTemplates.templates;

  categoryTemplates =
    categoryTemplates.children &&
    categoryTemplates.children[categories.secondary];
  if (!categoryTemplates) return [];

  return filterByMarketType
    ? getTemplatesByMarketType(categoryTemplates.templates, marketType)
    : categoryTemplates.templates;
};

const getTemplatesByMarketType = (
  categoryTemplates: Template[],
  marketType
) => {
  const values = categoryTemplates.filter(t => t.marketType === marketType);
  return values.map(v => ({
    ...v,
    inputs: v.inputs.length === 0 ? getInputsByType(v.inputsType) : v.inputs,
  }));
};

const getInputsByType = (inputName: TemplateInputTypeNames) => {
  return deepClone<TemplateInput[]>(INPUTS[inputName]);
};

export const getTemplateReadableDescription = (template: Template) => {
  let question = template.question;
  const inputs = template.inputs;
  for (const i in inputs) {
    question = question.replace(
      `[${inputs[i].id}]`,
      `[${inputs[i].placeholder}]`
    );
  }
  return question;
};

export const buildMarketDescription = (
  question: string,
  inputs: TemplateInput[]
) => {
  inputs.forEach((input: TemplateInput) => {
    const userInputFormatted =
      input.type === TemplateInputType.DATEYEAR
        ? convertUnixToFormattedDate(input.userInput).formattedSimpleData
        : input.userInput;
    question = question.replace(
      `[${input.id}]`,
      `${input.userInput ? userInputFormatted : `[${input.placeholder}]`}`
    );
  });

  return question;
};

export const tellIfEditableOutcomes = (inputs: TemplateInput[]) => {
  return (
    inputs.filter(
      input =>
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME ||
        input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME
    ).length > 0
  );
};

export const createTemplateOutcomes = (inputs: TemplateInput[]) => {
  return inputs
    .filter(
      input =>
        input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME ||
        input.type === TemplateInputType.ADDED_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME
    )
    .map((input: TemplateInput) => {
      if (input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME) {
        return substituteUserOutcome(input, inputs);
      }
      return input.userInput || input.placeholder;
    });
};

export const substituteUserOutcome = (
  input: TemplateInput,
  inputs: TemplateInput[]
) => {
  let matches = input.placeholder.match(/\[(.*?)\]/);
  let submatch = '0';
  if (matches) {
    submatch = String(matches[1]);
  }

  let text = input.placeholder.replace(
    `[${submatch}]`,
    `${
      inputs[submatch].userInput
        ? inputs[submatch].userInput
        : `[${inputs[submatch].placeholder}]`
    }`
  );

  return text;
};

export const buildResolutionDetails = (
  userDetails: string,
  resolutionRules: ResolutionRules
) => {
  let details = userDetails;
  Object.values(resolutionRules).forEach(
    type =>
      type &&
      type.forEach(rule => {
        if (rule.isSelected) {
          if (details.length > 0) {
            details = details.concat('\n');
          }
          details = details.concat(rule.text);
        }
      })
  );
  return details;
};

export const hasNoTemplateCategoryChildren = category => {
  if (!category) return false;
  if (TEMPLATES[category].children) return false;
  return true;
};

const TEMPLATES = {
  [POLITICS]: {
    children: {
      [US_POLITICS]: {
        templates: [
          {
            templateId: `pol-win-event`,
            marketType: YES_NO,
            question: `Will [0] win the [1] presidential election`,
            example: `Will Donald Trump win the 2020 Presidential election`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-pres-nom`,
            marketType: YES_NO,
            question: `Will [0] win the [1] [2] presidential nomination`,
            example: `Will Elizabeth Warren win the 2020 Democratic Presidential nomination`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-office-nom`,
            marketType: YES_NO,
            question: `Will [0] run for [1] by [2]`,
            example: `Will Oprah Winfrey run for President by December 31, 2019 1 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                values: LIST_VALUES.OFFICES,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
                placeholder: `By Specific Datetime`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-imp`,
            marketType: YES_NO,
            question: `Will [0] be impeached by [1]`,
            example: `Will Donald Trump be impeached by December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `By Specific Datetime`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-prez-cat`,
            marketType: CATEGORICAL,
            question: `Who will win the [0] US presidential election`,
            example: `Who will win the 2020 US presidential election`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-nom-cat`,
            marketType: CATEGORICAL,
            question: `Who will be the [0] [1] [2] nominee`,
            example: `Who will be the 2020 Republican Vice President nominee`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                values: LIST_VALUES.OFFICES,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-state-prez-cat`,
            marketType: CATEGORICAL,
            question: `Which party will win [0] in the [1] Presidential election`,
            example: `Which party will win Michigan in the 2020 Presidential election`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                values: LIST_VALUES.US_STATES,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [WORLD]: {
        templates: [
          {
            templateId: `pol-world-pos-cat`,
            marketType: YES_NO,
            question: `Will [0] be [1] of [2] on [3]`,
            example: `Will Kim Jong Un be Supreme Leader of North Korea on December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Position`,
                values: LIST_VALUES.POL_POSITION,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Location`,
              },
              {
                id: 3,
                type: TemplateInputType.DATETIME,
                placeholder: `By Specific Datetime`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `pol-world-imp-cat`,
            marketType: YES_NO,
            question: `Will [0] be impeached by [1]`,
            example: `Will Benjamin Netanyahu be impeached be December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `By Specific Datetime`,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
    },
  },
  [CRYPTO]: {
    templates: [
      {
        templateId: `crypto-token-bin`,
        marketType: YES_NO,
        question: `Will the price of [0] close on or above [1] [2] on [3] on [4]`,
        example: `Will the price of ETH close on or above $200 USD on Coinmarketcap on December 31, 2019`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Coin/Token`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Value #`,
            validationType: ValidationType.NUMBER,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 3,
            type: TemplateInputType.TEXT,
            placeholder: `Exchange`,
          },
          {
            id: 4,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        templateId: `crypto-between-bin`,
        marketType: YES_NO,
        question: `Will the price of [0], exceed [1] [2], on [3] anytime between the start of [4] (00:00 UTC-0) and end of [5] (23:59 UTC-0)`,
        example: `Will the price of REP exceed $40 USD on Poloniex anytime between the start of September 1, 2019 (00:00 UTC-0) and end of December 31, 2019 (23:59 UTC-0)`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Coin/Token`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Value #`,
            validationType: ValidationType.NUMBER,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 3,
            type: TemplateInputType.TEXT,
            placeholder: `Exchange`,
          },
          {
            id: 4,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Start Day of Year`,
          },
          {
            id: 5,
            type: TemplateInputType.DATEYEAR,
            placeholder: `End Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        templateId: `crypto-close-scalar`,
        marketType: SCALAR,
        question: `What price will [0] close at in [1] on [2] on [3] at (23:59 UTC-0)`,
        example: `What price will BTC close at in USD on Coinbase pro on December 31, 2019 at (23:59 UTC-0)`,
        denomination: '[Denomination]',
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Coin/Token`,
          },
          {
            id: 1,
            type: TemplateInputType.DENOMINATION_DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 2,
            type: TemplateInputType.TEXT,
            placeholder: `Exchange`,
          },
          {
            id: 3,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
    ],
  },
  [FINANCE]: {
    templates: [
      {
        templateId: `fin-stock-bin`,
        marketType: YES_NO,
        question: `Will the price of [0] close on or above [1] [2] on the [3] on [4]`,
        example: `Will the price of AAPL close on or above $200 USD on the Nasdaq on September 1, 2020`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Stock`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Value #`,
            validationType: ValidationType.NUMBER,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 3,
            type: TemplateInputType.TEXT,
            placeholder: `Exchange`,
          },
          {
            id: 4,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        templateId: `fin-stock-exceed-bin`,
        marketType: YES_NO,
        question: `Will the price of [0], exceed [1] [2] on the [3], anytime between the opening on [4] and the close on [5]`,
        example: `Will the price of AAPL exceed $250 USD on the Nasdaq anytime between the opening on June 1, 2020 and the close on September 1, 2020`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Stock`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Value #`,
            validationType: ValidationType.NUMBER,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 3,
            type: TemplateInputType.TEXT,
            placeholder: `Exchange`,
          },
          {
            id: 4,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Start Day of Year`,
          },
          {
            id: 5,
            type: TemplateInputType.DATEYEAR,
            placeholder: `End Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        templateId: `fin-index-close-bin`,
        marketType: YES_NO,
        question: `Will the [0] close on or above [1] [2] on [3]`,
        example: `Will the Dow Jones Industrial Average close on or above $27,100.00 USD on September 20, 2019`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Index`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Value #`,
            validationType: ValidationType.NUMBER,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 3,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        templateId: `fin-price-scalar`,
        marketType: SCALAR,
        question: `What price will [0] close at in [1] on the [2] on [3]`,
        example: `What price will AAPL close at in USD on the Nasdaq on December 31, 2019`,
        denomination: '[Denomination]',
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Stock`,
          },
          {
            id: 1,
            type: TemplateInputType.DENOMINATION_DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 2,
            type: TemplateInputType.TEXT,
            placeholder: `Exchange`,
          },
          {
            id: 3,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        templateId: `fin-price-close-scalar`,
        marketType: SCALAR,
        question: `What price will the [0] close at in [1] on [2]`,
        example: `What Price will the S&P 500 close at in USD on December 31, 2019`,
        denomination: '[Denomination]',
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Index`,
          },
          {
            id: 1,
            type: TemplateInputType.DENOMINATION_DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 2,
            type: TemplateInputType.DATEYEAR,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
    ],
  },
  [ENTERTAINMENT]: {
    templates: [
      {
        templateId: `ent-host-event`,
        marketType: YES_NO,
        question: `Will [0] host the [1] [2]`,
        example: `Will Billy Crystal host the 2019 Academy Awards`,
        inputs: [],
        inputsType: TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN,
        resolutionRules: {},
      },
      {
        templateId: `ent-host-event2`,
        marketType: YES_NO,
        question: `Will [0] win an award for [1] at the [2] [3]`,
        example: `Will Leonardo DiCaprio win an award for Best Actor at the 2016 Academy Awards`,
        inputs: [],
        inputsType: TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN_2,
        resolutionRules: {},
      },
      {
        templateId: `ent-host-event3`,
        marketType: YES_NO,
        question: `Will [0] win an award for [1] at the [2] [3]`,
        example: `Will Spotlight win an award for Best Picture at the 2016 Academy Awards`,
        inputs: [],
        inputsType: TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN_3,
        resolutionRules: {},
      },
      {
        templateId: `ent-host-gross`,
        marketType: YES_NO,
        question: `Will [0] gross [1] [2] or more, in it's opening weekend [3]`,
        example: `Will Avangers: Endgame gross $350 million USD or more in it's opening weekend in the US`,
        inputs: [],
        inputsType: TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN_4,
        resolutionRules: {},
      },
      {
        templateId: `ent-host-cat`,
        marketType: CATEGORICAL,
        question: `Who will host the [0] [1]`,
        example: `Who wll host the 2020 Emmy Awards`,
        inputs: [],
        inputsType: TemplateInputTypeNames.ENTERTAINMNET_AWARDS_CAT,
        resolutionRules: {},
      },
      {
        templateId: `ent-win-award-cat`,
        marketType: CATEGORICAL,
        question: `Who will win for [0] in the [1] [2]`,
        example: `Who will win for Best Pop Vocal Album in the 2020 Grammy Awards`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Award`,
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Year`,
            values: LIST_VALUES.YEARS,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Event`,
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
          },
        ],
        resolutionRules: {},
      },
    ],
  },
  [SPORTS]: {
    templates: [],
    children: {
      [GOLF]: {
        templates: [
          {
            templateId: `gf-win`,
            marketType: YES_NO,
            question: `Will [0] win the [1] [2]`,
            example: `Will Tiger Woods win the 2020 PGA Championship`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Player`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.GOLF_EVENT,
              },
            ],
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                },
              ],
            },
          },
          {
            templateId: `gf-cut`,
            marketType: YES_NO,
            question: `Will [0] make the cut at [1] [2]`,
            example: `Will Tiger Woods make the cut at 2020 PGA Championship`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Player`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.GOLF_EVENT,
              },
            ],
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                },
              ],
            },
          },
          {
            templateId: `gf-win-cat`,
            marketType: CATEGORICAL,
            question: `Which golfer will win the [0] [1]`,
            example: `Which golfer will win the 2020 PGA Championship`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.GOLF_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
        ]
      },
      [HOCKEY]: {
        templates: [
          {
            templateId: `hk-teamVsteam`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1], Estimated schedule start time: [2]`,
            example: `Will the St Louis Blues win vs the Dallas Stars, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_BIN,
            resolutionRules: {},
          },
          {
            templateId: `hk-teamVsteam`,
            marketType: YES_NO,
            question: `Will the [0] & [1] score [2] or more combined goals, Estimated schedule start time: [3]`,
            example: `Will the NY Rangers & Dallas Stars score 5 or more combined goals, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: {},
          },
          {
            templateId: `hk-championship`,
            marketType: YES_NO,
            question: `Will the [0] win the [1] Stanley Cup?`,
            example: `Will the Montreal Canadiens win the 2019-2020 Stanley Cup`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `hk-teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]`,
            example: `Which Team will win: NY Rangers vs NJ Devils, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `hk-overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]`,
            example: `St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.OVER_UNDER,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `hk-year-event-cat`,
            marketType: CATEGORICAL,
            question: `Which NHL team will win the [0] Stanley Cup`,
            example: `Which NHL team will win the 2019-2020 Stanley Cup`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `hk-award`,
            marketType: CATEGORICAL,
            question: `Which NHL player will win the [0] [1] award`,
            example: `Which NHL player will win the 2019-2020 Calder Trophy`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                values: LIST_VALUES.HOCKEY_AWARD,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `hk-point-year`,
            marketType: SCALAR,
            question: `Total number of wins the [0] will finish [1] regular season with`,
            example: `Total number of wins the LA Kings will finish 2019-2020 regular season with`,
            denomination: 'wins',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                },
              ],
            },
          },
        ],
      },
      [HORSE_RACING]: {
        templates: [
          {
            templateId: `hr-win-year-event`,
            marketType: YES_NO,
            question: `Will [0] win the [1] [2]`,
            example: `Will American Pharoah win the 2020 Triple Crown`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Horse`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.HORSE_RACING_EVENT,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `hr-win-cat`,
            marketType: CATEGORICAL,
            question: `Which horse will win the [0] [1]`,
            example: `Which horse will win the 2020 Kentucky Derby`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.HORSE_RACING_EVENT,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [TENNIS]: {
        templates: [
          {
            templateId: `ten-playout-year-event`,
            marketType: YES_NO,
            question: `Will [0] win the [1] [2]`,
            example: `Will Roger Federer win the 2020 Wimbledon`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Player`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.TENNIS_EVENT,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `ten-win-cat`,
            marketType: CATEGORICAL,
            question: `Which tennis player will win the [0] [1]`,
            example: `Which tennis player will win the 2020 Australian Open`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.TENNIS_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `ten-win-cat`,
            marketType: CATEGORICAL,
            question: `[0] [1] Match play winner: [2] vs [3]`,
            example: `2020 Wimbledon Match play winner between Roger Federer vs Rafael Nadal`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.TENNIS_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Player A`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Player B`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
            ],
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner.`,
                },
                {
                  text: `If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as "No Winner".`,
                },
                {
                  text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
        ],
      },
      [SOCCER]: {
        templates: [
          {
            templateId: `soccer-teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]`,
            example: `Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: {
              [CHOICE]: [
                {
                  text:
                    'Include Regulation and any added injury or stoppage time',
                },
                {
                  text:
                    'Include Regulation, any added injury or stoppage time and any Overtime or Penalty shoot-out',
                },
              ],
              [OPTIONAL]: [
                {
                  text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `soccer-overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]`,
            example: `Real Madrid vs Manchester United: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.OVER_UNDER,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
        ],
      },
      [BASKETBALL]: {
        templates: [
          {
            templateId: `bb-team-event`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1], Estimated schedule start time: [2]`,
            example: `Will the Las Angeles Lakers win vs the Golden State Warriors, Estimated schedule start time: Sept 19, 2019 9:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_BIN,
            resolutionRules: {
              [OPTIONAL]: [{ text: `Include Regulation and Overtime` }],
            },
          },
          {
            templateId: `bb-teamVsteam-point-year`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]`,
            example: `Will the Las Angeles Lakers win vs the Golden State Warriors by 5 or more points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: {
              [OPTIONAL]: [{ text: `Include Regulation and Overtime` }],
            },
          },
          {
            templateId: `bb-teamVsteam-point-comb`,
            marketType: YES_NO,
            question: `Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]`,
            example: `Will the Las Angeles Lakers & the Golden State Warriors score 172 or more combined points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: {
              [OPTIONAL]: [
                { text: `Include Regulation and Overtime` },
                {
                  text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                },
              ],
            },
          },
          {
            templateId: `bb-teamVsteam-point-year`,
            marketType: YES_NO,
            question: `Will the [0] have [1] or more regular season wins in [2]`,
            example: `Will the NY Knicks have 50 or more regular season wins in 2019-2020`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                },
              ],
            },
          },
          {
            templateId: `bb-championship`,
            marketType: YES_NO,
            question: `Will the [0] win the [1] NBA Championship?`,
            example: `Will the Golden State Warriors win the 2019-20 NBA Championship`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `bb-year-event`,
            marketType: YES_NO,
            question: `Will [0] win the [1] [2]`,
            example: `Will Steph Curry win the 2019-2020 NBA Most Valuable Player award`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Name`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                values: LIST_VALUES.BASKETBALL_AWARD,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `bb-teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]`,
            example: `Which Team will win: Brooklyn Nets vs NY Knicks, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `bb-overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total Points scored; Over/Under [2].5, Estimated schedule start time: [3]`,
            example: `Brooklyn Nets vs NY Knicks: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.OVER_UNDER,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `bb-year-event-cat`,
            marketType: CATEGORICAL,
            question: `Which NBA team will win the [0] [1]`,
            example: `Which NBA team will win the 2019-2020 Western Conference Finals`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                values: LIST_VALUES.BASKETBALL_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `bb-year-coll-cat`,
            marketType: CATEGORICAL,
            question: `Which college basketball team will win the [0] [1] [2] tournament`,
            example: `Which college basketball team will win the men's 2020 ACC tournament`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Men's/Women's`,
                values: LIST_VALUES.MENS_WOMENS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Conference`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `winner will be determined by the team that wins their conference tournament championship game`,
                },
              ],
            },
          },
          {
            templateId: `bb-leg-coll-cat`,
            marketType: CATEGORICAL,
            question: `Which [0] player will win the [1] [2] award`,
            example: `Which NBA player will win the 2019-2020 Most Valuable Player award`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `League`,
                values: LIST_VALUES.BASKETBALL_LEAGUE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                values: LIST_VALUES.BASKETBALL_AWARD,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `bb-action-cat`,
            marketType: CATEGORICAL,
            question: `Which Player will have the most [0] at the end of the the [1] regular season`,
            example: `Which Player will have the most Points scored at the end of the the 2019-2020 regular season`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Action`,
                values: LIST_VALUES.BASKETBALL_ACTION,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `bb-total-wins`,
            marketType: SCALAR,
            question: `Total number of wins [0] will finish [1] regular season with`,
            example: `Total number of wins NY Knicks will finish 2019-20 regular season with`,
            denomination: 'wins',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [BASEBALL]: {
        templates: [
          {
            templateId: `baseball-team-event`,
            marketType: YES_NO,
            question: `Will the [0] win the [1] [2]`,
            example: `Will the NY Yankees win the 2020 World Series`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_WINS_EVENT_YEAR,
            resolutionRules: {},
          },
          {
            templateId: `baseball-teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]`,
            example: `Which Team will win: Yankees vs Red Sox, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `baseball-year-event`,
            marketType: CATEGORICAL,
            question: `Which MLB team will win the [0] [1]`,
            example: `Which MLB team will win the 2020 World Series`,
            inputs: [],
            inputsType: TemplateInputTypeNames.BASEBALL_YEAR_EVENT,
            resolutionRules: {},
          },
          {
            templateId: `baseball-overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total Runs scored; Over/Under [2].5, Estimated schedule start time: [3]`,
            example: `NY Yankees vs Boston Red Sox: Total Runs scored; Over/Under 9.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.OVER_UNDER,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `baseball-year-event2`,
            marketType: CATEGORICAL,
            question: `Which player will win the [0] [1]`,
            example: `Which Player will win the 2019 American League Cy Young award`,
            inputs: [],
            inputsType: TemplateInputTypeNames.BASEBALL_YEAR_EVENT,
            resolutionRules: {},
          },
          {
            templateId: `baseball-total-wins`,
            marketType: SCALAR,
            question: `Total number of wins [0] will finish [1] regular season with`,
            example: `Total number of wins the LA Dodgers will finish 2019 regular season with`,
            denomination: 'wins',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [AMERICAN_FOOTBALL]: {
        templates: [
          {
            templateId: `fb-teamVsteam`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1], Estimated schedule start time: [2]`,
            example: `Will the NY Giants win vs. the New England Patriots, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_BIN,
            resolutionRules: {
              [OPTIONAL]: [
                { text: `Include Regulation and Overtime` },
                {
                  text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                },
              ],
            },
          },
          {
            templateId: `fb-teamVsteam-point`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]`,
            example: `Will the NY Giants win vs. the New England Patriots by 3 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: {
              [OPTIONAL]: [
                { text: `Include Regulation and Overtime` },
                {
                  text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                },
              ],
            },
          },
          {
            templateId: `fb-teamVsteam-point-comb`,
            marketType: YES_NO,
            question: `Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]`,
            example: `Will the NY Giants & the New England Patriots score 44 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: {
              [OPTIONAL]: [
                { text: `Include Regulation and Overtime` },
                {
                  text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                },
              ],
            },
          },
          {
            templateId: `fb-teamVsteam-point-year`,
            marketType: YES_NO,
            question: `Will the [0] have [1] or more regular season wins in [2]`,
            example: `Will the Dallas Cowboys have 9 or more regular season wins in 2019`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_WINS_BIN_YEAR,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                },
              ],
            },
          },
          {
            templateId: `fb-team-event`,
            marketType: YES_NO,
            question: `Will the [0] win SuperBowl [1]`,
            example: `Will the NY Giants win Superbowl LIV`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_WINS_EVENT,
            resolutionRules: {},
          },
          {
            templateId: `fb-player-award`,
            marketType: YES_NO,
            question: `Will [0] win the [1] [2] award`,
            example: `Will Patrick Mahones win the 2019-20 MVP award?`,
            inputs: [],
            inputsType: TemplateInputTypeNames.PLAYER_AWARD,
            resolutionRules: {},
          },
          {
            templateId: `fb-teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]`,
            example: `Which NFL Team will win: NY GIants vs New England Patriots Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: {
              [OPTIONAL]: [
                { text: `Include Regulation and Overtime` },
                {
                  text: `If the game is not played or is NOT completed for any reason, or ends in a tie, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `fb-teamVsteam-coll`,
            marketType: CATEGORICAL,
            question: `Which College Football Team will win: [0] vs [1], Estimated schedule start time [2]`,
            example: `Which College Football Team will win: Alabama vs Michigan Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: {
              [OPTIONAL]: [
                { text: `Include Regulation and Overtime` },
                {
                  text: `If the game is not played or is NOT completed for any reason, or ends in a tie, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `fb-overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]`,
            example: `Alabama vs Michigan: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.OVER_UNDER,
            resolutionRules: {
              [OPTIONAL]: [
                {
                  text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
                },
              ],
            },
          },
          {
            templateId: `fb-year-event`,
            marketType: CATEGORICAL,
            question: `Which NFL team will win the [0] [1]`,
            example: `Which NFL team will win the 2020 AFC Championship game`,
            inputs: [],
            inputsType: TemplateInputTypeNames.YEAR_EVENT,
            resolutionRules: {},
          },
          {
            templateId: `fb-year-event-coll`,
            marketType: CATEGORICAL,
            question: `Which college football player will win the [0] Heisman Trophy`,
            example: `Which college football player will win the 2020 Heisman Trophy`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
          {
            templateId: `fb-total-wins`,
            marketType: SCALAR,
            question: `Total number of wins [0] will finish [1] regular season with`,
            example: `Total number of wins NY Giants will finish 2019 regular season with`,
            denomination: 'wins',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
    },
  },
};

const INPUTS = {
  [TemplateInputTypeNames.ENTERTAINMNET_AWARDS_CAT]: [
    {
      id: 0,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 1,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.ENTERTAINMENT_EVENT,
    },
  ],
  [TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN_4]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Movie Name`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Amount`,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Currency`,
      values: LIST_VALUES.CURRENCY,
    },
    {
      id: 3,
      type: TemplateInputType.DROPDOWN,
      placeholder: `US / Worldwide`,
      values: LIST_VALUES.REGION,
    },
  ],
  [TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN_3]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Movie Name`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Award`,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 3,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.ENTERTAINMENT_EVENT,
    },
  ],
  [TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN_2]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Person Name`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Award`,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 3,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.ENTERTAINMENT_EVENT,
    },
  ],
  [TemplateInputTypeNames.ENTERTAINMNET_AWARDS_BIN]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Person Name`,
    },
    {
      id: 1,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.ENTERTAINMENT_EVENT,
    },
  ],
  [TemplateInputTypeNames.YEAR_EVENT]: [
    {
      id: 0,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 1,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.FOOTBALL_EVENT,
    },
  ],
  [TemplateInputTypeNames.BASEBALL_YEAR_EVENT]: [
    {
      id: 0,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 1,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.BASEBALL_EVENT,
    },
  ],
  [TemplateInputTypeNames.PLAYER_AWARD]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Player`,
    },
    {
      id: 1,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Years`,
      values: LIST_VALUES.YEAR_RANGE,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Award`,
      values: LIST_VALUES.FOOTBALL_AWARDS,
    },
  ],
  [TemplateInputTypeNames.TEAM_WINS_EVENT]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Team`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Roman Num`,
    },
  ],
  [TemplateInputTypeNames.TEAM_WINS_BIN_YEAR]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Team`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      validationType: ValidationType.WHOLE_NUMBER,
      placeholder: `Whole #`,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
  ],
  [TemplateInputTypeNames.TEAM_WINS_EVENT_YEAR]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Team`,
    },
    {
      id: 1,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Year`,
      values: LIST_VALUES.YEARS,
    },
    {
      id: 2,
      type: TemplateInputType.DROPDOWN,
      placeholder: `Event`,
      values: LIST_VALUES.BASEBALL_EVENT,
    },
  ],
  [TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Team A`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Team B`,
    },
    {
      id: 2,
      type: TemplateInputType.TEXT,
      validationType: ValidationType.WHOLE_NUMBER,
      placeholder: `Whole #`,
    },
    {
      id: 3,
      type: TemplateInputType.DATETIME,
      placeholder: `Date time`,
    },
  ],
  [TemplateInputTypeNames.TEAM_VS_TEAM_BIN]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Team A`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Team B`,
    },
    {
      id: 2,
      type: TemplateInputType.DATETIME,
      placeholder: `Date time`,
    },
  ],
  [TemplateInputTypeNames.TEAM_VS_TEAM_CAT]: [
    {
      id: 0,
      type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
      placeholder: `Team A`,
    },
    {
      id: 1,
      type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
      placeholder: `Team B`,
    },
    {
      id: 2,
      type: TemplateInputType.DATETIME,
      placeholder: `Date time`,
    },
    {
      id: 3,
      type: TemplateInputType.ADDED_OUTCOME,
      placeholder: `Draw/No Winner`,
    },
  ],
  [TemplateInputTypeNames.OVER_UNDER]: [
    {
      id: 0,
      type: TemplateInputType.TEXT,
      placeholder: `Team A`,
    },
    {
      id: 1,
      type: TemplateInputType.TEXT,
      placeholder: `Team B`,
    },
    {
      id: 2,
      type: TemplateInputType.TEXT,
      validationType: ValidationType.WHOLE_NUMBER,
      placeholder: `Whole #`,
    },
    {
      id: 3,
      type: TemplateInputType.DATETIME,
      placeholder: `Date time`,
    },
    {
      id: 4,
      type: TemplateInputType.ADDED_OUTCOME,
      placeholder: `No Winner`,
    },
    {
      id: 5,
      type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
      placeholder: `Over [2].5`,
    },
    {
      id: 6,
      type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
      placeholder: `Under [2].5`,
    },
  ],
};
