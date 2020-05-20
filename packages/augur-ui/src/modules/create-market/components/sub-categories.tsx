import React from 'react';
import {
  LargeSubheaders,
} from 'modules/create-market/components/common';
import { RadioCardGroup } from 'modules/common/form';
import Styles from 'modules/create-market/components/sub-categories.styles.less';
import {
  getTemplateRadioCards
} from 'modules/create-market/get-template';
import { useAppStatusStore } from 'modules/app/store/app-status';

export interface SubCategoriesProps {
  nextPage: Function;
}

export const SubCategories = ({ nextPage }: SubCategoriesProps) => {
  const {
    newMarket,
    categoryStats,
    actions: { updateNewMarket },
  } = useAppStatusStore();
  const { navCategories } = newMarket;
  const cats = getTemplateRadioCards(
    {
      primary: navCategories[0],
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

export default SubCategories;