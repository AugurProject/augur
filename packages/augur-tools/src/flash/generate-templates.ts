import { ethers } from 'ethers';
import * as fs from 'fs';
import {
  Template,
  TemplateInput,
  ValidationTemplateInputType,
  TemplateInputType,
  CategoryTemplate,
  TemplateValidation,
} from '../templates-template';
import { TEMPLATES } from '../templates-source';

const templateString = '//##TEMPLATES##';
const templateValidationString = '//##TEMPLATE_VALIDATIONS##';
const templateArtifactsFile = '../augur-artifacts/src/templates.ts';
const templateTemplateFile = './src/templates-template.ts';

export const generateTemplateValidations = async () => {
  let validations = {};
  let newTemplates = JSON.parse(JSON.stringify(TEMPLATES));
  const topCategories = Object.keys(newTemplates);
  topCategories.map(c => addTemplates(newTemplates[c], validations));
  const newTemplateValue = `export const TEMPLATES = ${JSON.stringify(
    newTemplates
  )};`;
  const newValidation = `TEMPLATE_VALIDATIONS = ${JSON.stringify(
    validations
  )};`;

  if (!fs.existsSync(templateTemplateFile))
    return console.error(templateTemplateFile, 'does not exist');

  const contents = fs.readFileSync(templateTemplateFile, 'utf8');

  const setNewTemplatesValues = contents.replace(
    templateString,
    newTemplateValue
  );
  const setNewTemplateValidations = setNewTemplatesValues.replace(
    templateValidationString,
    newValidation
  );

  fs.writeFileSync(templateArtifactsFile, setNewTemplateValidations, 'utf8');
};

const addTemplates = (category: CategoryTemplate, validations: TemplateValidation) => {
  if (category.children) {
    return Object.keys(category.children).map(c =>
      addTemplates(category.children[c], validations)
    );
  }
  if (category.templates) {
    category.templates.map(t => {
      const hashValue = generateTemplateHash(t);
      t.hash = hashValue;
      const question = t.question;
      let regexMarketTitle = t.question;
      t.inputs.map((i: TemplateInput) => {
        if (question.indexOf(`[${i.id}]`) > -1) {
          let reg = ValidationTemplateInputType[i.type];
          if (!reg && i.type === TemplateInputType.DROPDOWN) {
            reg = `(${i.values.map(o => o.label).join('|')})`;
          }
          if (reg) {
            regexMarketTitle = regexMarketTitle.replace(`[${i.id}]`, reg);
          }
        }
      });
      validations[hashValue] = {
        templateValidation: regexMarketTitle,
      };
    });
  }
};

/**
 * generates a hash based on the template object
 */
function generateTemplateHash(template: Template): string {
  const params = JSON.stringify(template);
  const value = `0x${Buffer.from(params, 'utf8').toString('hex')}`;
  return ethers.utils.sha256(value);
}
