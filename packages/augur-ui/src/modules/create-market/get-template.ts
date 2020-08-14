import type { Getters } from '@augurproject/sdk';
import {
  CATEGORICAL,
  SCALAR,
  SCALAR_OUTCOMES,
  YES_NO,
  YES_NO_OUTCOMES,
  INVALID_OUTCOME_LABEL
} from 'modules/common/constants';
import {
  CategoricalMarketIcon,
  ScalarMarketIcon,
  YesNoMarketIcon,
} from 'modules/common/icons';
import {
  TEMPLATES,
  TEMPLATE_VALIDATIONS,
  RETIRED_TEMPLATES,
  TemplateInputType,
  getExchangeClosingWithBufferGivenDay,
} from '@augurproject/templates';
import {
  REQUIRED,
  CHOICE,
  CRYPTO,
} from '@augurproject/sdk-lite'
import { NameValuePair } from 'modules/common/selection';
import {
  MARKET_SUB_TEMPLATES,
  MARKET_TEMPLATES,
  MARKET_TYPE_TEMPLATES,
  MarketCardTemplate,
} from 'modules/create-market/constants';
import { DateTimeComponents, OutcomeFormatted } from 'modules/types';
import deepClone from 'utils/deep-clone';
import { timestampComponents } from 'utils/format-date';
import { formatDaiPrice, formatDai, formatEther } from 'utils/format-number';

const MarketTypeIcons = {
  [YES_NO]: YesNoMarketIcon,
  [CATEGORICAL]: CategoricalMarketIcon,
  [SCALAR]: ScalarMarketIcon,
};

const NO_SORT_CATEGORIES = [CRYPTO];

export const getTemplateRadioCardsMarketTypes = (categories: Categories) => {
  if (!categories || !categories.primary) return MARKET_TYPE_TEMPLATES;
  const templates = getTemplatesPerSubcategory(categories, false);
  if (!templates) return [];
  //const icon = MarketTypeIcons[t.marketType];
  const marketTypes = templates.reduce((p, t) => [...p, t.marketType], []);
  return [...new Set(marketTypes)].map(m =>
    MARKET_TYPE_TEMPLATES.find(t => t.value === m)
  )
  .map(i => ({...i, icon: MarketTypeIcons[i.value]}));
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
    const vol = formatEther(stats.volume || '0').formatted;
    const mkrLabel = stats.numberOfMarkets === 1 ? 'Market' : 'Markets';
    card.description = `${stats.numberOfMarkets} ${mkrLabel} | $${vol}`;
    card.count = stats.numberOfMarkets;
  } else {
    card.description = `0 Markets | $0.00`;
    card.count = 0;
  }
  return card;
};

export const getTemplateCategories = (categories: Categories): string[] => {
  let emptyCats = [];
  let noSort = NO_SORT_CATEGORIES.includes(categories.primary);
  if (!categories || !categories.primary) return Object.keys(TEMPLATES).sort();
  const primaryCat = TEMPLATES[categories.primary];
  if (!primaryCat) return emptyCats;
  if (!categories.secondary)
    return primaryCat.children ? noSort ? Object.keys(primaryCat.children) : Object.keys(primaryCat.children).sort() : [];
  noSort = NO_SORT_CATEGORIES.includes(categories.secondary);
  const secondaryCat = primaryCat.children
    ? primaryCat.children[categories.secondary]
    : emptyCats;
  if (!secondaryCat) return emptyCats;
  return secondaryCat.children ? noSort ? Object.keys(secondaryCat.children) : Object.keys(secondaryCat.children).sort() : [];
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
  const viewable = values.reduce(
    (p, v) => (RETIRED_TEMPLATES.find(r => r.hash === v.hash) ? p : [...p, v]),
    []
  );
  return deepClone<Template[]>(viewable);
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

export const buildMarketDescription = (question: string, inputs: TemplateInput[]) => {
  inputs.forEach((input: TemplateInput) => {
    let value = (input.userInput && String(input.userInput).trim()) || `[${String(input?.placeholder)?.trim()}]`;
    question = question.replace(`[${input.id}]`, `${value}`);
  });

  return question;
};

export const createTemplateOutcomes = (inputs: TemplateInput[]) => {
  const requiredOutcomes = inputs.filter(
    i => i.type === TemplateInputType.ADDED_OUTCOME
  );
  const otherOutcomes = inputs.filter(
    i => i.type !== TemplateInputType.ADDED_OUTCOME
  );
  return [...otherOutcomes, ...requiredOutcomes]
    .filter(
      input =>
        input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME ||
        input.type === TemplateInputType.ADDED_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP
    )
    .map((input: TemplateInput) => {
      if (input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME) {
        return substituteUserOutcome(input, inputs);
      }
      return input.userInput || input.placeholder;
    });
};

export const getFormattedOutcomes = (
  marketType: string,
  outcomes: string[],
  scalarDenomination: string
): OutcomeFormatted[] => {
  let outcomesFormatted: OutcomeFormatted[] = deepClone<OutcomeFormatted[]>(
    YES_NO_OUTCOMES
  );
  if (marketType === CATEGORICAL) {
    outcomesFormatted = outcomes.map((outcome, index) => ({
      description: outcome,
      id: index + 1,
      isTradeable: true,
    }));
    outcomesFormatted.unshift({
      id: 0,
      description: INVALID_OUTCOME_LABEL,
      isTradeable: true,
    });
  } else if (marketType === SCALAR) {
    outcomesFormatted = deepClone<OutcomeFormatted[]>(SCALAR_OUTCOMES);
    if (scalarDenomination)
      outcomesFormatted[1].description = scalarDenomination;
  }

  return outcomesFormatted;
};

export const substituteUserOutcome = (
  input: TemplateInput,
  inputs: TemplateInput[]
) => {
  return buildMarketDescription(input.placeholder, inputs);
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

// return false if template has category children
// return true if template doesn't have category children
export const hasNoTemplateCategoryChildren = category => {
  if (!category) return false;
  if (!TEMPLATES[category]) return true;
  if (TEMPLATES[category].children) return false;
  return true;
};

export const hasNoTemplateCategoryTertiaryChildren = (category, subcategory) => {
  if (!category || !subcategory || !TEMPLATES[category] || !TEMPLATES[category].children) return true;
  if (!TEMPLATES[category].children[subcategory] || !TEMPLATES[category].children[subcategory].children) return true;
  if (TEMPLATES[category].children[subcategory] || TEMPLATES[category].children[subcategory].children) return false;
  return true;
};

export const hasAutoFillCategory = (inputs: TemplateInput[], categoryIndex: number) => {
  if (inputs.length === 0) return false;
  const autoFillCategoryInput = inputs.find(i => i.categoryDestId);
  return autoFillCategoryInput && autoFillCategoryInput.categoryDestId === categoryIndex;
};


export const isValidTemplateMarket = (hash: string, marketTitle: string) => {
  const validation = TEMPLATE_VALIDATIONS[hash];
  if (!validation || !validation.templateValidation) return false;
  return !!marketTitle.match(validation.templateValidation);
};

export function createTemplateValueList(values: string[]): NameValuePair[] {
  return values.map(v => ({ value: v, label: v }));
}

export function getEventExpirationForExchangeDayInQuestion(
  inputs
): Partial<DateTimeComponents> {
  const closing = inputs.find(
    i => i.type === TemplateInputType.DATEYEAR_CLOSING
  );
  if (!closing) return null;
  const dateYearSource = inputs.find(i => i.id === closing.inputDateYearId);
  const timeOffset = closing.userInputObject as TimeOffset;
  if (dateYearSource && dateYearSource.userInput && timeOffset) {
    const closingDateTime = getExchangeClosingWithBufferGivenDay(
      dateYearSource.userInput,
      timeOffset.hour,
      timeOffset.minutes,
      timeOffset.offset
    );
    // offset has already been applied but needs to be passed out
    return {
      ...timestampComponents(closingDateTime, timeOffset.offset, timeOffset.timezone),
      offset: timeOffset.offset
    };
  }
  return null;
}
