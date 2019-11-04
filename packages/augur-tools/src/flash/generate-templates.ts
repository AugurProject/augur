import { ethers } from 'ethers';
import * as fs from 'fs';
import {
  Template,
  TemplateInput,
  ValidationTemplateInputType,
  TemplateInputType,
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
  )}`;
  const newValidation = `export const TEMPLATE_VALIDATIONS = ${JSON.stringify(
    validations
  )}`;

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

const addTemplates = (category, validations) => {
  if (category.children) {
    return Object.keys(category.children).map(c =>
      addTemplates(category.children[c], validations)
    );
  }
  if (category.templates) {
    category.templates.map(t => {
      const hash = generateTemplateHash(t);
      t[hash] = hash;
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
      validations[hash] = {
        templateValidation: regexMarketTitle,
      };
    });
  }
};

function generateTemplateHash(template: Template): string {
  if (!template) return null;
  const copyOf = JSON.parse(JSON.stringify(template));
  delete copyOf.example;
  delete copyOf.hash;
  copyOf.inputs.map(i => delete i.values);
  const params = JSON.stringify(copyOf);
  const value = `0x${Buffer.from(params, 'utf8').toString('hex')}`;
  return ethers.utils.sha256(value);
}
