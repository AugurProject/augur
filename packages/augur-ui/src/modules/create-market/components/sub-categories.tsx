import React from 'react';
import {
  CategorySingleSelect,
  createGroups,
} from 'modules/common/form';
import {
  LargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { MARKET_SUB_TEMPLATES } from 'modules/create-market/constants';
import { RadioCardGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/sub-categories.styles.less';
import { CUSTOM } from 'modules/common/constants';
import { setCategories } from 'modules/create-market/set-categories';

export const SubCategories = ({
    newMarket,
    updateNewMarket,
    categoryStats,
  }) => {
  const { categories } = newMarket;
  const {
    tertiaryOptions,
    tertiaryAutoComplete,
  } = createGroups(setCategories, categories, categories);

  const tertiarySelected = categories[2].length > 0;
  const categorySelected = tertiaryOptions.map(options => options.value).includes(categories[2]);
  const isCustomSelected = tertiaryOptions.length === 0 || !categorySelected && tertiaryOptions.length > 0;
  const customOption = { label: CUSTOM, value: CUSTOM };

  const subcategoryTemplates = {};
  for (const categoryName in MARKET_SUB_TEMPLATES) {
    if (MARKET_SUB_TEMPLATES.hasOwnProperty(categoryName)) {
      subcategoryTemplates[categoryName] = MARKET_SUB_TEMPLATES[categoryName].map((subcategoryTemplate) => {
        const categoryKey = categoryName.toLowerCase();
        const subcategoryKey = subcategoryTemplate.value.toLowerCase();
        if (categoryStats[categoryKey] && categoryStats[categoryKey][subcategoryKey]) {
          subcategoryTemplate.description = `${categoryStats[categoryKey][subcategoryKey].numberOfMarkets} Markets  |  $${categoryStats[categoryKey][subcategoryKey].volume}`;
        }
        return subcategoryTemplate;
      });
    }
  };

  return (
    <section className={Styles.SubCategories}>
      <LargeSubheaders
        header='Choose a sub-category'
        subheader='Sub-categories help users find your market.'
      />
      <section>
        <RadioCardGroup
          defaultSelected={categories[1] ? categories[1] : null}
          onChange={(value: string) => {
            const updatedNewMarket = { ...newMarket };
            updatedNewMarket.categories[1] = value;
            updatedNewMarket.categories[2] = '';
            updateNewMarket(updatedNewMarket);
          }}
          radioButtons={subcategoryTemplates[newMarket.categories[0]]}
        >
          <SmallHeaderLink text="Don't see your category?" link ownLine />
        </RadioCardGroup>
      </section>
      <section>
        <LargeSubheaders
          header='Choose a further sub-category'
          subheader='Optionally select another sub-category to help users find your market.'
        />
        <CategorySingleSelect
          options={tertiaryOptions.length > 0 ? tertiaryOptions : [customOption] }
          autoCompleteList={tertiaryAutoComplete}
          initialSelected={isCustomSelected ? CUSTOM : categories[2]}
          initialValue={isCustomSelected ? tertiarySelected ? categories[2] : '' : categories[2]}
          staticLabel='Tertiary Category (optional)'
          placeholder='Custom Tertiary Category'
          updateSelection={(value: string) => {
            const updatedNewMarket = { ...newMarket };
            updatedNewMarket.categories[2] = value;
            updateNewMarket(updatedNewMarket);
          }}
        />
      </section>
    </section>
  );
};
