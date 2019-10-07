import { CATEGORICAL } from 'modules/common/constants';

export enum TemplateInputType {
  TEXT = 'TEXT',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  DROPDOWN = 'DROPDOWN',
  ADDED_OUTCOME = 'ADDED_OUTCOME',
  USER_OUTCOME = 'USER_OUTCOME',
  SUBSTITUTE_USER_OUTCOME = 'SUBSTITUTE_USER_OUTCOME',
}
interface CategoryTemplate {
  templates: Template[];
  children: CategoryTemplate[];
}
export interface Template {
  categories: Categories;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
  resolutionRules: string[];
}

export interface TemplateInput {
  type: TemplateInputType;
  placeholder: string;
  tooltip?: string;
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
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], [2]`,
            example: `Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [
              {
                type: TemplateInputType.USER_OUTCOME,
                placeholder: `Team A`,
              },
              {
                type: TemplateInputType.USER_OUTCOME,
                placeholder: `Team B`,
              },
              {
                type: TemplateInputType.DATETIME,
                placeholder: `Estimated scheduled start time`,
              },
              {
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
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5`,
            example: `Real Madrid vs Manchester United: Total goals scored Over/Under 4.5`,
            inputs: [
              {
                type: TemplateInputType.TEXT,
                placeholder: `Team A`,
              },
              {
                type: TemplateInputType.TEXT,
                placeholder: `Team B`,
              },
              {
                type: TemplateInputType.TEXT,
                placeholder: `Whole #`,
              },
              {
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
              {
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Over ({[2] + .5})`,
              },
              {
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
