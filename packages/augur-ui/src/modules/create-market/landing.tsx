import React from 'react';

import { RadioCardGroup } from 'modules/common/form';
import {
  LargeSubheaders,
  ContentBlock,
  XLargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { SecondaryButton } from 'modules/common/buttons';
import { SCRATCH, TEMPLATE, MARKET_COPY_LIST } from 'modules/create-market/constants';
import SavedDrafts from 'modules/create-market/containers/saved-drafts';

import Styles from 'modules/create-market/landing.styles.less';
import { getTemplateRadioCards } from './get-template';
import { Getters } from '@augurproject/sdk';
import { NewMarket } from 'modules/types';

interface LandingProps {
  newMarket: NewMarket;
  updateNewMarket: (newMarketData: NewMarket) => void;
  address: String;
  updatePage: Function;
  clearNewMarket: Function;
  categoryStats: Getters.Markets.CategoryStats;
  marketCreationStarted: Function;
}

export default class Landing extends React.Component<LandingProps> {
  componentDidMount() {
    this.node && this.node.scrollIntoView();
  }

  render() {
    const {
      updatePage,
      updateNewMarket,
      newMarket,
      clearNewMarket,
      categoryStats,
      marketCreationStarted,
    } = this.props;

    return (
      <div
        ref={node => {
          this.node = node;
        }}
        className={Styles.Landing}
      >
        <XLargeSubheaders header={'Create a new market'}>
          Augur allows <span>anyone</span>, <span>anywhere</span>, to create a
          market on <span>anything</span>
        </XLargeSubheaders>

        <div>
          <SavedDrafts updatePage={updatePage} />

          <ContentBlock>
            <LargeSubheaders
              link
              copyType={MARKET_COPY_LIST.USE_A_TEMPLATE}
              header="Use a market template"
              subheader="Templates simplify the creation of new markets and reduce errors in the market making process. "
            />
            <section>
              <RadioCardGroup
                onChange={(value: string) => {
                  const updatedNewMarket = { ...newMarket };
                  updatedNewMarket.categories[0] = value;
                  updatedNewMarket.categories[1] = '';
                  updatedNewMarket.categories[2] = '';
                  updatedNewMarket.currentStep = 1;
                  updatedNewMarket.marketType = '';
                  updateNewMarket(updatedNewMarket);
                  updatePage(TEMPLATE);
                }}
                radioButtons={getTemplateRadioCards(
                  {
                    primary: '',
                    secondary: '',
                    tertiary: '',
                  },
                  categoryStats
                )}
              >
                <SmallHeaderLink copyType={MARKET_COPY_LIST.DONT_SEE_CAT} text="Don't see your category?" link ownLine />
              </RadioCardGroup>
            </section>
          </ContentBlock>

          <ContentBlock>
            <LargeSubheaders
              link
              copyType={MARKET_COPY_LIST.FROM_SCRATCH}
              header="Start from scratch"
              subheader="Create a completely custom market, only recommended for advanced users."
            />
            <SecondaryButton
              text="Create a custom market"
              action={() => {
                clearNewMarket();
                marketCreationStarted('', false);
                updatePage(SCRATCH);
              }}
            />
          </ContentBlock>
        </div>
      </div>
    );
  }
}
