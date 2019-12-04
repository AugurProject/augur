import { TEMPLATES, CategoryTemplate } from '@augurproject/artifacts';

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
