import React, { useState } from 'react';
import { LargeSubheaders } from 'modules/create-market/components/common';
import { RadioTwoLineBarGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/template-picker.styles.less';
import {
  getTemplates,
  getTemplateReadableDescription,
  createTemplateOutcomes,
  buildMarketDescription,
  getTemplateCategoriesList,
} from 'modules/create-market/get-template';
import { YES_NO, SCALAR, CATEGORICAL } from 'modules/common/constants';
import {
  EMPTY_STATE,
  DEFAULT_TICK_SIZE,
} from 'modules/create-market/constants';
import deepClone from 'utils/deep-clone';
import { NewMarket } from 'modules/types';
import classNames from 'classnames';

export const TemplatePicker = ({ newMarket, updateNewMarket }) => {
  const { categories, marketType } = newMarket;
  const tertiaryOptions = newMarket.categories[1]
    ? getTemplateCategoriesList(
        {
          primary: newMarket.categories[0],
          secondary: newMarket.categories[1],
          tertiary: '',
        },
        marketType
      )
    : [];
  const [tertiary, setTertiary] = useState(
    tertiaryOptions.length === 0 ? { value: '', label: '' } : tertiaryOptions[0]
  );
  const [defaultValue, setDefaultValue] = useState(null);
  const categoriesFormatted = {
    primary: categories[0],
    secondary: categories[1],
    tertiary: tertiary.value,
  };
  const templates = getTemplates(categoriesFormatted, marketType);
  const catLabels = Object.values(categoriesFormatted).filter(c => c).join(' / ');
  let subheader = `Popular ${catLabels} templates with up to 8 possible outcomes.`;
  if (marketType === YES_NO) {
    subheader = `Popular Yes/No ${catLabels} templates.`;
  } else if (marketType === SCALAR) {
    subheader = `Popular Scalar ${catLabels} templates.`;
  }

  const templateOptions = templates.map((template, index) => {
    return {
      header: `${getTemplateReadableDescription(template)}`,
      description: `Example: ${template.example}`,
      value: index.toString(),
      renderMarkdown: true,
    };
  });

  return (
    <section className={Styles.TemplatePicker}>
      <LargeSubheaders header="Choose a template" subheader={subheader} />
      {tertiaryOptions.length > 0 && (
        <div>
          {tertiaryOptions.map((option, index) => (
            <button
              key={index}
              className={classNames({
                [Styles.Selected]: option.value === tertiary.value,
              })}
              onClick={() => {
                setTertiary(option);
                setDefaultValue(null);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      <section>
        <RadioTwoLineBarGroup
          defaultSelected={defaultValue}
          radioButtons={templateOptions}
          onChange={value => {
            setDefaultValue(value);
            if (!value) return;
            const template = templates[value];
            updateNewMarket({
              ...deepClone<NewMarket>(EMPTY_STATE),
              description: buildMarketDescription(
                template.question,
                template.inputs
              ),
              outcomes:
                newMarket.marketType === CATEGORICAL
                  ? createTemplateOutcomes(template.inputs)
                  : ['', ''],
              currentStep: newMarket.currentStep,
              tickSize:
                newMarket.marketType === SCALAR && template.tickSize
                  ? template.tickSize
                  : DEFAULT_TICK_SIZE,
              scalarDenomination:
                newMarket.marketType === SCALAR &&
                template.denomination,
              minPrice:
                newMarket.marketType === SCALAR && template.minPrice
                  ? template.minPrice
                  : newMarket.minPrice,
              maxPrice:
                newMarket.marketType === SCALAR && template.maxPrice
                  ? template.maxPrice
                  : newMarket.maxPrice,
              marketType: newMarket.marketType,
              categories: [
                newMarket.categories[0],
                newMarket.categories[1],
                tertiary.label,
              ],
              template: template,
            });
          }}
        />
      </section>
    </section>
  );
};
