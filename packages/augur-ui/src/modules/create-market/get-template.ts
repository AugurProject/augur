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

export const getTemplateCategories = () => {
  const category = Object.keys(templates).map(c => templates[c].children);
};

const getSubCategories = (category: CategoryTemplate) => {
  const categories = Object.keys(category.children);
};

export const getTemplates = (
  categories: Categories,
  marketType: string
): Template[] => {
  if (!marketType) return [];
  let categoryTemplates: CategoryTemplate = templates[categories.primary];

  if (!categoryTemplates) return [];
  if (!categories.secondary)
    return getTemplatesByMarketType(categoryTemplates.templates, marketType);

  categoryTemplates = categoryTemplates.children[categories.secondary];
  if (!categoryTemplates) return [];
  if (!categories.tertiary)
    return getTemplatesByMarketType(categoryTemplates.templates, marketType);

  categoryTemplates = categoryTemplates.children[categories.tertiary];
  return getTemplatesByMarketType(categoryTemplates.templates, marketType);
};

const getTemplatesByMarketType = (
  categoryTemplates: Template[],
  marketType
) => {
  const values = categoryTemplates.filter(t => t.marketType === marketType);
  return values;
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
  sports: {
    templates: [],
    children: {
      soccer: {
        templates: [
          {
            templateId: `soccer-teamVsteam`,
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
            templateId: `soccer-overUnder`,

            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5`,
            example: `Real Madrid vs Manchester United: Total goals scored Over/Under 4.5`,
            inputs: [
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
            resolutionRules: [
              `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
            ],
          },
        ],
      },
    },
  },
};
