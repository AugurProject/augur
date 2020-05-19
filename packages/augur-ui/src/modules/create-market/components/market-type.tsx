import React from 'react';
import { LargeSubheaders } from 'modules/create-market/components/common';
import { RadioCardGroup } from 'modules/common/form';
import { getTemplateRadioCardsMarketTypes } from 'modules/create-market/get-template';
import { MARKET_COPY_LIST } from 'modules/create-market/constants';

interface MarketTypeProps {
  categories: string[];
  marketType: string;
  updateNewMarket: Function;
}

export const MarketType = ({
  updateNewMarket,
  categories,
  marketType,
}: MarketTypeProps) => (
  <section>
    <LargeSubheaders
      link
      underline
      copyType={MARKET_COPY_LIST.MARKET_TYPE}
      header="Choose a market type"
      subheader="Market types vary based on the amount of possible outcomes."
    />

    <RadioCardGroup
      onChange={value => updateNewMarket({ marketType: value })}
      defaultSelected={marketType}
      radioButtons={getTemplateRadioCardsMarketTypes({
        primary: categories[0],
        secondary: categories[1],
        tertiary: categories[2],
      })}
    />
  </section>
);
