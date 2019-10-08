import React from 'react';
import { LargeSubheaders } from 'modules/create-market/components/common';
import { MARKET_SUB_TEMPLATES } from 'modules/create-market/constants';
import { RadioCardGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/template-picker.styles.less';
import { getTemplates } from 'modules/create-market/get-template';
import { YES_NO, SCALAR } from 'modules/common/constants';

export const TemplatePicker = ({ newMarket, updateNewMarket }) => {
  const { categories, marketType } = newMarket;
  const categoriesFormatted = {
    primary: categories[0].toLowerCase(),
    secondary: categories[1].toLowerCase(),
    tertiary: categories[2].toLowerCase(),
  };
  const templates = getTemplates(
    categoriesFormatted,
    marketType
  );

  console.log(categoriesFormatted);
  console.log(templates);

  let subheader = `Popular ${categories[0]} templates with up to 8 possible outcomes.`;
  if (marketType === YES_NO) {
    subheader = `Popular Yes/No ${categories[0]} templates.`;
  } else if (marketType === SCALAR) {
    subheader = `Popular Scalar ${categories[0]} templates.`;
  }

  return (
    <section className={Styles.TemplatePicker}>
      <LargeSubheaders
        header="Choose a template"
        subheader={subheader}
      />
      <section></section>
    </section>
  );
};
