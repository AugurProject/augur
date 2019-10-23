import React from 'react';
import { LargeSubheaders } from 'modules/create-market/components/common';
import { RadioCardGroup } from 'modules/common/form';
import { getTemplateRadioCardsMarketTypes } from '../get-template';

interface MarketTypeProps {
  categories: string[];
  marketType: string;
  updateNewMarket: Function;
}

export const MarketType = (props: MarketTypeProps) => (
  <section>
    <LargeSubheaders
      link
      underline
      header="Choose a market type"
      subheader="Market types vary based on the amount of possible outcomes."
    />

    <RadioCardGroup
      onChange={value => {
          props.updateNewMarket({ marketType: value })
        }
      }
      defaultSelected={props.marketType}
      radioButtons={getTemplateRadioCardsMarketTypes({
        primary: props.categories[0],
        secondary: props.categories[1],
        tertiary: props.categories[2],
      })}
    />
  </section>
);
