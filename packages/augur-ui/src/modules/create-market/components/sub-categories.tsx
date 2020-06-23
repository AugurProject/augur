import React from 'react';
import {
  LargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { RadioCardGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/sub-categories.styles.less';
import {
  getTemplateRadioCards
} from 'modules/create-market/get-template';
import type { Getters } from '@augurproject/sdk';
import { NewMarket } from 'modules/types';
import { MARKET_COPY_LIST } from 'modules/create-market/constants';

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
  const { navCategories } = newMarket;
  const cats = getTemplateRadioCards(
    {
      primary: newMarket.navCategories[0],
      secondary: '',
      tertiary: '',
    },
    categoryStats
  );
  if (cats.length === 0) nextPage();
  return (
    <section className={Styles.SubCategories}>
      <LargeSubheaders
        header="Choose a sub-category"
        subheader="Sub-categories help users find your market."
      />
      <section>
        <RadioCardGroup
          defaultSelected={navCategories[1] ? navCategories[1] : null}
          onChange={(value: string) => {
            const updatedNewMarket = { ...newMarket };
            updatedNewMarket.navCategories[1] = value;
            updatedNewMarket.navCategories[2] = '';
            updateNewMarket(updatedNewMarket);
          }}
          radioButtons={cats}
        />
      </section>
    </section>
  );
};
