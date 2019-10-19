import React from 'react';
import { LargeSubheaders } from 'modules/create-market/components/common';
import { RadioTwoLineBarGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/template-picker.styles.less';
import {
  getTemplates,
  getTemplateReadableDescription,
  createTemplateOutcomes,
  buildMarketDescription,
} from 'modules/create-market/get-template';
import { YES_NO, SCALAR, CATEGORICAL } from 'modules/common/constants';
import { EMPTY_STATE } from 'modules/create-market/constants';
import deepClone from 'utils/deep-clone';
import { NewMarket } from 'modules/types';

export const TemplatePicker = ({ newMarket, updateNewMarket }) => {
  const { categories, marketType } = newMarket;
  const categoriesFormatted = {
    primary: categories[0],
    secondary: categories[1],
    tertiary: categories[2],
  };
  const templates = getTemplates(categoriesFormatted, marketType);

  let subheader = `Popular ${categories[0]} templates with up to 8 possible outcomes.`;
  if (marketType === YES_NO) {
    subheader = `Popular Yes/No ${categories[0]} templates.`;
  } else if (marketType === SCALAR) {
    subheader = `Popular Scalar ${categories[0]} templates.`;
  }

  const templateOptions = templates.map((template, index) => {
    return {
      header: `${getTemplateReadableDescription(template)}?`,
      description: `Example: ${template.example}?`,
      value: index.toString(),
    };
  });

  return (
    <section className={Styles.TemplatePicker}>
      <LargeSubheaders header="Choose a template" subheader={subheader} />
      <section>
        <RadioTwoLineBarGroup
          radioButtons={templateOptions}
          onChange={value => {
            updateNewMarket({
              ...deepClone<NewMarket>(EMPTY_STATE),
              description: buildMarketDescription(
                templates[value].question,
                templates[value].inputs
              ),
              outcomes:
                newMarket.marketType === CATEGORICAL
                  ? createTemplateOutcomes(templates[value].inputs)
                  : ['', ''],
              currentStep: newMarket.currentStep,
              scalarDenomination:
                newMarket.marketType === SCALAR &&
                templates[value].denomination,
              marketType: newMarket.marketType,
              categories: newMarket.categories,
              template: templates[value],
            });
          }}
        />
      </section>
    </section>
  );
};
