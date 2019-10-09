import { CATEGORICAL, YES_NO } from 'modules/common/constants';
import {
  SOCCER,
  AMERICAN_FOOTBALL,
  SPORTS,
  MARKET_TEMPLATES,
  MARKET_SUB_TEMPLATES,
  MARKET_TYPE_TEMPLATES,
} from 'modules/create-market/constants';

export enum TemplateInputTypeNames {
  TEAM_VS_TEAM_BIN = 'TEAM_VS_TEAM_BIN',
  TEAM_VS_TEAM_CAT = 'TEAM_VS_TEAM_CAT',
  OVER_UNDER = 'OVER_UNDER',
  TEAM_VS_TEAM_POINTS_BIN = 'TEAM_VS_TEAM_POINTS_BIN',
}

export enum TemplateInputType {
  TEXT = 'TEXT',
  DATEYEAR = 'DATEYEAR',
  DATETIME = 'DATETIME',
  DROPDOWN = 'DROPDOWN',
  ADDED_OUTCOME = 'ADDED_OUTCOME',
  USER_OUTCOME = 'USER_OUTCOME',
  USER_DESCRIPTION_OUTCOME = 'USER_DESCRIPTION_TEXT',
  SUBSTITUTE_USER_OUTCOME = 'SUBSTITUTE_USER_OUTCOME',
}

export interface UserInputText {
  value: string;
}

export interface UserInputDateYear extends UserInputText {}
export interface UserInputDateTime {
  year: string;
  day: string;
  minute: string;
  timezone: string;
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
export interface Template {
  templateId: string;
  categories: Categories;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
  inputsType: TemplateInputTypeNames;
  resolutionRules: string[];
}

export interface TemplateInput {
  id: number;
  type: TemplateInputType;
  placeholder: string;
  tooltip?: string;
  userInput?: UserInputtedType;
}

export interface Categories {
  primary: string;
  secondary: string;
  tertiary?: string;
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

export const getTemplateRadioCards = (categories: Categories) => {
  const cats = getTemplateCategories(categories);
  if (cats.length === 0) return [];
  if (!categories.primary) {
    return cats.map(c => MARKET_TEMPLATES.find(t => t.value === c));
  }
  if (categories.primary && !categories.secondary) {
    return cats.map(c =>
      MARKET_SUB_TEMPLATES[categories.primary].find(t => t.value === c)
    );
  }
  if (categories.primary && categories.secondary && !categories.tertiary) {
    return cats.map(c =>
      MARKET_SUB_TEMPLATES[categories.primary].find(t => t.value === c)
    );
  }
  return [];
};

const getTemplateCategories = (categories: Categories): string[] => {
  let emptyCats = [];
  if (!categories || !categories.primary) return Object.keys(templates);
  const primaryCat = templates[categories.primary];
  if (!primaryCat) return emptyCats;
  if (!categories.secondary) return Object.keys(primaryCat.children);
  const secondaryCat = primaryCat.children
    ? primaryCat.children[categories.secondary]
    : emptyCats;
  if (!secondaryCat) return emptyCats;
  if (!categories.tertiary) return Object.keys(secondaryCat.children);
  return secondaryCat.children
    ? Object.keys(secondaryCat.children[categories.tertiary])
    : emptyCats;
};

export const getTemplates = (
  categories: Categories,
  marketType: string,
  filterByMarketType: boolean = true
): Template[] => {
  if (!marketType && filterByMarketType) return [];
  let categoryTemplates: CategoryTemplate = templates[categories.primary];

  if (!categoryTemplates) return [];
  if (!categories.secondary)
    return filterByMarketType
      ? getTemplatesByMarketType(categoryTemplates.templates, marketType)
      : categoryTemplates.templates;

  categoryTemplates = categoryTemplates.children[categories.secondary];
  if (!categoryTemplates) return [];
  if (!categories.tertiary)
    return filterByMarketType
      ? getTemplatesByMarketType(categoryTemplates.templates, marketType)
      : categoryTemplates.templates;

  categoryTemplates = categoryTemplates.children[categories.tertiary];
  return filterByMarketType
    ? getTemplatesByMarketType(categoryTemplates.templates, marketType)
    : categoryTemplates.templates;
};

const getTemplatesByMarketType = (
  categoryTemplates: Template[],
  marketType
) => {
  const values = categoryTemplates.filter(t => t.marketType === marketType);
  return values.map(v => ({ ...v, inputs: getInputsByType(v.inputsType) }));
};

const getInputsByType = (inputName: TemplateInputTypeNames) => {
  return inputs[inputName];
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

const templates = {
  [SPORTS]: {
    templates: [],
    children: {
      [SOCCER]: {
        templates: [
          {
            templateId: `soccer-teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]`,
            example: `Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_CAT,
            resolutionRules: [
              ` If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
            ],
          },
          {
            templateId: `soccer-overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5`,
            example: `Real Madrid vs Manchester United: Total goals scored Over/Under 4.5`,
            inputs: [],
            inputsType: TemplateInputTypeNames.OVER_UNDER,
            resolutionRules: [
              `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
            ],
          },
        ],
      },
      [AMERICAN_FOOTBALL]: {
        templates: [
          {
            templateId: `fb-teamVsteam`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
            example: `Will the NY Giants win vs. the New England Patriots, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_BIN,
            resolutionRules: [
              `Include Regulation and Overtime`,
              `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
            ],
          },
          {
            templateId: `fb-teamVsteam-point`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]`,
            example: `Will the NY Giants win vs. the New England Patriots by 3 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: [
              `Include Regulation and Overtime`,
              `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
            ],
          },
          {
            templateId: `fb-teamVsteam-point-comb`,
            marketType: YES_NO,
            question: `Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]`,
            example: `Will the NY Giants & the New England Patriots score 44 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [],
            inputsType: TemplateInputTypeNames.TEAM_VS_TEAM_POINTS_BIN,
            resolutionRules: [
              `Include Regulation and Overtime`,
              `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
            ],
          },
        ],
      },
    },
  },
};

const inputs = {
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
      placeholder: `Other`,
      tooltip: `A team not listed as an outcome wins the event`,
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
      placeholder: `Whole #`,
    },
    {
      id: 3,
      type: TemplateInputType.ADDED_OUTCOME,
      placeholder: `No Winner`,
    },
    {
      id: 4,
      type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
      placeholder: `Over ({[2] + .5})`,
    },
    {
      id: 5,
      type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
      placeholder: `Under ({[2] - .5})`,
    },
  ],
};
