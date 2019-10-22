import React from 'react';
import {
  LargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { RadioCardGroup, CategorySingleSelect } from 'modules/common/form';
import Styles from 'modules/create-market/components/sub-categories.styles.less';
import {
  getTemplateRadioCards,
  getTemplateCategories,
  getTemplateCategoriesList,
} from 'modules/create-market/get-template';
import { Getters } from '@augurproject/sdk/src';
import { NewMarket } from 'modules/types';

export interface SubCategoriesProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  nextPage: Function;
  categoryStats: Getters.Markets.CategoryStats;
}

export const SubCategories = ({
  newMarket,
  updateNewMarket,
  nextPage,
  categoryStats,
}: SubCategoriesProps) => {
  const { categories } = newMarket;
  const cats = getTemplateRadioCards(
    {
      primary: newMarket.categories[0],
      secondary: '',
      tertiary: '',
    },
    categoryStats
  );
  if (cats.length === 0) nextPage();
  const tertiaryOptions = getTemplateCategoriesList({
    primary: newMarket.categories[0],
    secondary: newMarket.categories[1],
    tertiary: '',
  });
  return (
    <section className={Styles.SubCategories}>
      <LargeSubheaders
        header="Choose a sub-category"
        subheader="Sub-categories help users find your market."
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
          radioButtons={cats}
        >
          <SmallHeaderLink text="Don't see your category?" link ownLine />
        </RadioCardGroup>
      </section>
      <section>
        <LargeSubheaders
          header="Choose a further sub-category"
          subheader="Optionally select another sub-category to help users find your market."
        />
        <CategorySingleSelect
          options={tertiaryOptions}
          disabled={tertiaryOptions.length === 0}
          initialSelected={newMarket.categories[2]}
          initialValue={newMarket.categories[2]}
          staticLabel="Tertiary Category"
          placeholder="Custom Tertiary Category"
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
