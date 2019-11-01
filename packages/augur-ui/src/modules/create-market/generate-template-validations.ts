import { TEMPLATES } from "modules/create-market/templates";
import { generateTemplateHash } from "utils/generate-template-hash";
import { ValidationTemplateInputType, TemplateInputType } from "modules/create-market/constants";
import { TemplateInput } from "modules/types";

export const generateTemplateValidations = () => {
  let validations = {};
  const topCategories = Object.keys(TEMPLATES);
  topCategories.map(c => addTemplates(TEMPLATES[c], validations));
  console.log(`export const TEMPLATE_VALIDATIONS=`, JSON.stringify(validations));
}

const addTemplates = (category, validations) => {
  if (category.children) {
    return Object.keys(category.children).map(c => addTemplates(category.children[c], validations));
  }
  if(category.templates) {
    category.templates.map(t => {
      const hash = generateTemplateHash(t)
      const question = t.question;
      let regexMarketTitle = t.question;
      t.inputs.map((i: TemplateInput) => {
        if (question.indexOf(`[${i.id}]`) > -1) {
          let reg = ValidationTemplateInputType[i.type];
          if (!reg && i.type === TemplateInputType.DROPDOWN) {
            reg = `(${i.values.map(o => o.label).join('|')})`
          }
          if (reg) {
            regexMarketTitle = regexMarketTitle.replace(`[${i.id}]`, reg)
          }
        }
      })
      validations[hash] = {
        templateValidation: regexMarketTitle
      }
      console.log(hash);
      console.log(regexMarketTitle);
    })
  }
}
