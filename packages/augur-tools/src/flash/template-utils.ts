import { TEMPLATES, CategoryTemplate, isTemplateMarket, ExtraInfoTemplate } from '@augurproject/artifacts';
import { stringTo32ByteHex } from '@augurproject/sdk';

export const showTemplateByHash = (hash: string): string => {
  console.log("show template by hash");
  const templates = Object.keys(TEMPLATES).map(c =>
    findTemplate(TEMPLATES[c], hash)
  );
  return templates.length > 0 ? templates[0] : undefined;
};

const findTemplate = (category: CategoryTemplate, hash: string): string => {
  let template = undefined;
  if (category.children) {
    const templates = Object.keys(category.children)
      .map(c => findTemplate(category.children[c], hash))
      .filter(t => t);
    return templates.length > 0 ? templates[0] : undefined;
  }
  template = category.templates.find(t => t.hash === hash);
  return template;
};

export const validateMarketTemplate = (title: string, templateInfo: string, outcomesString: string, longDescription: string): string => {
  const extraInfoTemplate = JSON.parse(templateInfo) as ExtraInfoTemplate;
  let outcomes = [];
  if (outcomesString) {
    outcomes = outcomesString.split(',').map(s => stringTo32ByteHex(s));
  }
  const errors = [];
  const result = isTemplateMarket(title, extraInfoTemplate, outcomes, longDescription, errors);

  if (result) return 'Yes, this is a templated market';
  const error = errors[0];
  return `No, not a templated market, error: ${error}`;

}

