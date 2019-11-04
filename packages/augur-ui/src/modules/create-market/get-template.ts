import {
  MARKET_TEMPLATES,
  MARKET_SUB_TEMPLATES,
  MARKET_TYPE_TEMPLATES,
  MarketCardTemplate,
  TemplateInputType,
  CHOICE,
  REQUIRED,
} from 'modules/create-market/constants';
import deepClone from 'utils/deep-clone';
import { Getters } from '@augurproject/sdk';
import { formatDai } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { NameValuePair } from 'modules/portfolio/types';
import {
  TEMPLATES,
  TEMPLATE_VALIDATIONS,
  Categories,
  Template,
  TemplateInput,
  ResolutionRules,
  CategoryTemplate,
} from '@augurproject/artifacts';

export const getTemplateRadioCardsMarketTypes = (categories: Categories) => {
  if (!categories || !categories.primary) return MARKET_TYPE_TEMPLATES;
  const templates = getTemplatesPerSubcategory(categories, false);
  if (!templates) return [];
  const marketTypes = templates.reduce((p, t) => [...p, t.marketType], []);
  return [...new Set(marketTypes)].map(m =>
    MARKET_TYPE_TEMPLATES.find(t => t.value === m)
  );
};

export const getTemplatesByTertiaryMarketTypes = (categories: Categories) => {
  if (!categories || !categories.primary) return MARKET_TYPE_TEMPLATES;
  const templates = getTemplatesPerSubcategory(categories, true);
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
    stats = catStats && catStats.categories[cardValue];
  }
  if (categories && categories.primary && categories.secondary) {
    let catStats = categoryStats[categories.primary.toLowerCase()];
    catStats = catStats[categories.secondary.toLowerCase()];
    stats = catStats && catStats.categories[cardValue];
  }
  if (stats) {
    const vol = formatDai(stats.volume || '0').formatted;
    const mkrLabel = stats.numberOfMarkets === 1 ? 'Market' : 'Markets';
    card.description = `${stats.numberOfMarkets} ${mkrLabel} | $${vol}`;
  }
  return card;
};

export const getTemplateCategories = (categories: Categories): string[] => {
  let emptyCats = [];
  if (!categories || !categories.primary) return Object.keys(TEMPLATES).sort();
  const primaryCat = TEMPLATES[categories.primary];
  if (!primaryCat) return emptyCats;
  if (!categories.secondary)
    return primaryCat.children ? Object.keys(primaryCat.children).sort() : [];
  const secondaryCat = primaryCat.children
    ? primaryCat.children[categories.secondary]
    : emptyCats;
  if (!secondaryCat) return emptyCats;
  return secondaryCat.children ? Object.keys(secondaryCat.children).sort() : [];
};

export const getTemplateCategoriesByMarketType = (
  categories: Categories,
  marketType: string
): string[] => {
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
  if (secondaryCat.children) {
    let children = [];
    Object.keys(secondaryCat.children).map(tertiary => {
      const marketTypes = getTemplatesByTertiaryMarketTypes({
        ...categories,
        tertiary: tertiary,
      });
      if (marketTypes.find(type => type.value === marketType)) {
        children = children.concat(tertiary);
      }
    });
    return children;
  } else {
    return [];
  }
};

export const getTemplateCategoriesList = (
  categories: Categories,
  marketType: string
): NameValuePair[] => {
  const results = getTemplateCategoriesByMarketType(categories, marketType);
  if (!results || results.length === 0) return [];
  const mapped = results.map(v => ({ label: v, value: v }));
  return mapped as NameValuePair[];
};

export const getTemplatesPerSubcategory = (
  categories: Categories,
  filterByTertiary: boolean
): Template[] => {
  const primary: CategoryTemplate = TEMPLATES[categories.primary];
  if (!primary.children) return primary.templates;
  const secondary = primary.children[categories.secondary];
  if (secondary.children) {
    let allSubCategoryTemplates = [];
    Object.keys(secondary.children).forEach(key => {
      const child = secondary.children[key];
      if (
        (filterByTertiary && key === categories.tertiary) ||
        !filterByTertiary
      )
        allSubCategoryTemplates = allSubCategoryTemplates.concat(
          child.templates
        );
    });
    return allSubCategoryTemplates;
  } else {
    return secondary.templates;
  }
};

export const getTemplates = (
  categories: Categories,
  marketType: string
): Template[] => {
  if (categories.tertiary) {
    const primary: CategoryTemplate = TEMPLATES[categories.primary];
    const secondary = primary.children[categories.secondary];
    const tertiary = secondary.children[categories.tertiary];
    return marketType
      ? getTemplatesByMarketType(tertiary.templates, marketType)
      : tertiary.templates;
  }
  if (categories.secondary) {
    const primary: CategoryTemplate = TEMPLATES[categories.primary];
    const secondary = primary.children[categories.secondary];
    return marketType
      ? getTemplatesByMarketType(secondary.templates, marketType)
      : secondary.templates;
  }
  if (categories.primary) {
    const primary: CategoryTemplate = TEMPLATES[categories.primary];
    return marketType
      ? getTemplatesByMarketType(primary.templates, marketType)
      : primary.templates;
  }
  const categoryTemplates: CategoryTemplate = TEMPLATES[categories.primary];
  if (!categoryTemplates) return [];
  return marketType
    ? getTemplatesByMarketType(categoryTemplates.templates, marketType)
    : categoryTemplates.templates;
};

const getTemplatesByMarketType = (
  categoryTemplates: Template[],
  marketType
) => {
  const values = categoryTemplates.filter(t => t.marketType === marketType);
  return deepClone<Template[]>(values);
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
        ? convertUnixToFormattedDate(Number(input.userInput))
            .formattedSimpleData
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
        input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME
    ).length > 0
  );
};

export const createTemplateOutcomes = (inputs: TemplateInput[]) => {
  return inputs
    .filter(
      input =>
        input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME ||
        input.type === TemplateInputType.ADDED_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME
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
  Object.keys(resolutionRules).forEach(
    type =>
      type &&
      resolutionRules[type].forEach(rule => {
        if ((type === CHOICE && rule.isSelected) || type === REQUIRED) {
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

export const hasNoTemplateCategoryTertiaryChildren = (
  category,
  subcategory
) => {
  if (!category || !subcategory) return false;
  if (TEMPLATES[category].children[subcategory].children) return false;
  return true;
};

export const isValidTemplateMarket = (hash: string, marketTitle: string) => {
  const validation = TEMPLATE_VALIDATIONS[hash];
  if (!validation || !validation.templateValidation) return false;
  return !!marketTitle.match(validation.templateValidation);
};
