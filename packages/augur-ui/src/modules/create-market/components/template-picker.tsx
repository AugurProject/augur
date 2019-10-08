import React from 'react';
import { LargeSubheaders } from 'modules/create-market/components/common';
import { MARKET_SUB_TEMPLATES } from 'modules/create-market/constants';
import { RadioCardGroup, RadioTwoLineBarGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/template-picker.styles.less';
import { getTemplates, getTemplateReadableDescription } from 'modules/create-market/get-template';
import { YES_NO, SCALAR } from 'modules/common/constants';

export const TemplatePicker = ({ newMarket, updateNewMarket }) => {
  const { categories, marketType } = newMarket;
  const categoriesFormatted = {
    primary: categories[0].toLowerCase(),
    secondary: categories[1].toLowerCase(),
    tertiary: categories[2].toLowerCase(),
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
  })

  return (
    <section className={Styles.TemplatePicker}>
      <LargeSubheaders header="Choose a template" subheader={subheader} />
      <section>
        <RadioTwoLineBarGroup
          radioButtons={templateOptions}
          onChange={value => {
            //setSelectedOption(() => value && value.toString());
          }}
        />
      </section>
    </section>
  );
};
