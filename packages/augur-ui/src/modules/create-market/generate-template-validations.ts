import { TEMPLATES } from "./templates";
import { generateTemplateHash } from "utils/generate-template-hash";
import { ValidationTemplateInputType } from "./constants";


export const generateTemplateValidations = () => {
  let validations = {};
  const topCategories = Object.keys(TEMPLATES);
  topCategories.map(c => addTemplates(TEMPLATES[c], validations));
}

const addTemplates = (category, validations) => {
  if (category.children) {
    return Object.keys(category.children).map(c => addTemplates(category.children[c], validations));
  }
  if(category.templates) {
    category.templates.map(t => {
      const hash = generateTemplateHash(t)
      const question = t.question;
      t.inputs.map((i) => {
        if (question.find(`[${i.id}]`)) {
          const reg = ValidationTemplateInputType[i.type];
          if (reg) {

          }
        }
      })
    })
  }
}
