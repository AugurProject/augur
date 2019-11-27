import { ethers } from 'ethers';
import * as fs from 'fs';
import {
  Template,
  TemplateInput,
  ValidationTemplateInputType,
  TemplateInputType,
  CategoryTemplate,
  TemplateValidation,
  generateResolutionRulesHash,
  DropdownDependencies,
} from '../templates-template';
import { TEMPLATES } from '../templates-source';

const templateString = '//##TEMPLATES##';
const templateValidationString = '//##TEMPLATE_VALIDATIONS##';
const templateArtifactsFile = '../augur-artifacts/src/templates.ts';
const templateTemplateFile = './src/templates-template.ts';

export const generateTemplateValidations = async () => {
  const validations = {
    templateValidation: null,
    templateValidationResRules: null,
    requiredOutcomes: null,
    outcomeDependencies: null,
    substituteDependencies: null,
    marketQuestionDependencies: null,
  };
  let newTemplates = JSON.parse(JSON.stringify(TEMPLATES));
  const topCategories = Object.keys(newTemplates);
  topCategories.map(c => addTemplates(newTemplates[c], validations));
  const newTemplateValue = `export const TEMPLATES = ${JSON.stringify(newTemplates)};`;
  const newValidation = `TEMPLATE_VALIDATIONS = ${JSON.stringify(validations)};`;

  if (!fs.existsSync(templateTemplateFile)) return console.error(templateTemplateFile, 'does not exist');

  const contents = fs.readFileSync(templateTemplateFile, 'utf8');

  const setNewTemplatesValues = contents.replace(templateString, newTemplateValue);
  const setNewTemplateValidations = setNewTemplatesValues.replace(templateValidationString, newValidation);

  fs.writeFileSync(templateArtifactsFile, setNewTemplateValidations, 'utf8');
};

const addTemplates = (category: CategoryTemplate, validations: TemplateValidation) => {
  if (category.children) {
    return Object.keys(category.children).map(c => addTemplates(category.children[c], validations));
  }
  if (category.templates) {
    category.templates.map(t => {
      const hashValue = generateTemplateHash(t);
      t.hash = hashValue;
      const question = t.question;
      let regexMarketTitle = `^${escapeSpecialCharacters(question)}$`;
      t.inputs.map((i: TemplateInput) => {
        if (question.indexOf(`[${i.id}]`) > -1) {
          const reg = getValidationValues(i);
          regexMarketTitle = regexMarketTitle.replace(`[${i.id}]`, reg);
        }
      });
      validations[hashValue] = {
        templateValidation: regexMarketTitle,
        templateValidationResRules: generateResolutionRulesHash(t.resolutionRules),
        requiredOutcomes: getRequiredOutcomes(t.inputs),
        outcomeDependencies: getDropdownDependencies(t.inputs),
        substituteDependencies: getSubstituteOutcomeDependencies(t.inputs),
        marketQuestionDependencies: getMarketQuestionDependencies(t.inputs),
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

function getRequiredOutcomes(inputs: TemplateInput[]) {
  return inputs.filter(i => i.type === TemplateInputType.ADDED_OUTCOME).map(i => i.placeholder);
}

function listToRegEx(values: object[], property: string) {
  return `(${values.map(v => escapeSpecialCharacters(v[property])).join('|')})`;
}

function getDropdownDependencies(inputs: TemplateInput[]): DropdownDependencies {
  let listValues = null;
  const hasDepend = inputs.find(i => i.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP);
  if (hasDepend) {
    listValues = listValues = getDependencies(hasDepend, hasDepend.values);
  }
  return listValues;
}

function getMarketQuestionDependencies(inputs: TemplateInput[]): DropdownDependencies {
  let listValues = null;
  const hasDepend = inputs.find(i => i.type === TemplateInputType.DROPDOWN_QUESTION_DEP);
  if (hasDepend) {
    listValues = getDependencies(hasDepend, hasDepend.inputDestValues);
  }
  return listValues;
}

function getDependencies(input: TemplateInput, sourceValues: object): DropdownDependencies {
  return {
    inputSourceId: input.inputSourceId || input.id,
    inputDestId: input.inputDestId,
    values: Object.keys(sourceValues).reduce((p, key) => {
      p[key] = sourceValues[key].map(i => i.value);
      return p;
    }, {})
  }
}

function getSubstituteOutcomeDependencies(inputs: TemplateInput[]): string[] {
  return inputs
    .filter(i => i.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME)
    .map(i => i.placeholder);
}

function getValidationValues(input: TemplateInput) {
  const { type } = input;
  switch (type) {
    case TemplateInputType.TEXT:
      let reg = ValidationTemplateInputType[type];
      if (input.validationType) {
        reg = ValidationTemplateInputType[input.validationType];
      }
      return reg;
    case TemplateInputType.DENOMINATION_DROPDOWN:
    case TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME:
    case TemplateInputType.DROPDOWN_QUESTION_DEP:
    case TemplateInputType.DROPDOWN:
      let validations = listToRegEx(input.values, 'label');
      if (input.defaultLabel) {
        // list of values is unknown at this point, treat as text
        validations = ValidationTemplateInputType[TemplateInputType.TEXT]
      }
      return validations;
    default:
      return ValidationTemplateInputType[type];
  }
}

interface SearchReplace {
  find: RegExp;
  rep: string;
}

const specialCharacters: SearchReplace[] = [
  {
    find: /\(/g,
    rep: `\\(`,
  },
  {
    find: /\)/g,
    rep: `\\)`,
  },
  {
    find: /\?/g,
    rep: `\\?`,
  },
];

function escapeSpecialCharacters(value: string) {
  let replacementValue = value;
  let i: SearchReplace = null;
  specialCharacters.forEach(i => {
    replacementValue = replacementValue.replace(i.find, i.rep);
  });
  return replacementValue;
}
