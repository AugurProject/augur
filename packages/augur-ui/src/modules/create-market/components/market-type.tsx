import React from 'react';
import {  LargeSubheaders } from 'modules/create-market/components/common';
import { RadioCardGroup } from 'modules/common/form';
import {
  CATEGORICAL,
  YES_NO,
  SCALAR,
} from 'modules/common/constants';
import { Popcorn } from 'modules/common/icons';

interface MarketTypeProps {
  marketType: string;
  updateNewMarket: Function;
}

export const MarketType = (props: MarketTypeProps) => (
  <section>
    <LargeSubheaders
      link
      underline
      header='Choose a market type'
      subheader='Market types vary based on the amount of possible outcomes.'
    />

    <RadioCardGroup
      onChange={value => props.updateNewMarket({ marketType: value })}
      defaultSelected={props.marketType}
      radioButtons={[
        {
          value: YES_NO,
          header: 'Yes / No',
          description: 'There are two possible outcomes: “Yes” or “No”',
          icon: Popcorn,
          useIconColors: true,
        },
        {
          value: CATEGORICAL,
          header: 'Multiple Choice',
          description:
            'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
          icon: Popcorn,
          useIconColors: true,
        },
        {
          value: SCALAR,
          header: 'Scalar',
          description:
            'A range of numeric outcomes: “USD range” between “1” and “100”.',
          icon: Popcorn,
          useIconColors: true,
        },
      ]}
    />
  </section>
);
