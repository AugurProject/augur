import React from 'react';
import {
  LargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { RadioCardGroup, CategorySingleSelect } from 'modules/common/form';
import Styles from 'modules/create-market/components/sub-categories.styles.less';
import {
  getTemplateRadioCards
} from 'modules/create-market/get-template';
import { Getters } from '@augurproject/sdk/src';
import { NewMarket } from 'modules/types';

export interface SubCategoriesProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  categoryStats: Getters.Markets.CategoryStats;
}

export const SubCategories = ({
  newMarket,
  updateNewMarket,
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
    </section>
  );
};
