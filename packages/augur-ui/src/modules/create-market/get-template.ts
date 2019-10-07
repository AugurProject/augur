import { CATEGORICAL } from 'modules/common/constants';

export enum TemplateInputType {
  TEXT = 'TEXT',
  DATEYEAR = 'DATEYEAR',
  DATETIME = 'DATETIME',
  DROPDOWN = 'DROPDOWN',
  ADDED_OUTCOME = 'ADDED_OUTCOME',
  USER_OUTCOME = 'USER_OUTCOME',
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

interface CategoryTemplate {
  templates: Template[];
  children: CategoryTemplate[];
}
export interface Template {
  templateid: string;
  categories: Categories;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
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
  tertiary: string;
}

export const getTemplates = (
  categories: Categories,
  marketType: string
): Template[] => {
  if (!marketType) return [];
  let categoryTemplates = templates[categories.primary];

  if (!categoryTemplates) return [];
  if (!categories.secondary)
    return getTemplatesByMarketType(categoryTemplates.templates, marketType);

  categoryTemplates = categoryTemplates[categories.secondary];
  if (!categoryTemplates) return [];
  if (!categories.tertiary)
    return getTemplatesByMarketType(categoryTemplates.templates, marketType);

  categoryTemplates = categoryTemplates[categories.tertiary];
  return getTemplatesByMarketType(categoryTemplates.templates, marketType);
};

const getTemplatesByMarketType = (
  categoryTemplates: Template[],
  marketType
) => {
  return categoryTemplates.filter(c => c.marketType === marketType);
};

const templates = {
  sports: {
    templates: [],
    children: {
      soccer: {
        templates: [
          {
            templateid: `teamVsteam`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], [2]`,
            example: `Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_OUTCOME,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.USER_OUTCOME,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
                placeholder: `Estimated scheduled start time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other`,
                tooltip: `A team not listed as an outcome wins the event`,
              },
            ],
            resolutionRules: [
              ` If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
            ],
          },
          {
            templateid: `overUnder`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5`,
            example: `Real Madrid vs Manchester United: Total goals scored Over/Under 4.5`,
            inputs: [
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Team A`,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Team B`,
              },
              {
                id: 3,
                type: TemplateInputType.TEXT,
                placeholder: `Whole #`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Over ({[2] + .5})`,
              },
              {
                id: 6,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Under ({[2] - .5})`,
              },
            ],
            resolutionRules: [
              `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
            ],
          },
        ],
      },
    },
  },
};
