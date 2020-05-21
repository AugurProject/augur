import React, { useRef, useEffect } from 'react';

import { RadioCardGroup } from 'modules/common/form';
import {
  LargeSubheaders,
  ContentBlock,
  XLargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { SecondaryButton } from 'modules/common/buttons';
import {
  SCRATCH,
  TEMPLATE,
  MARKET_COPY_LIST,
  EMPTY_STATE,
} from 'modules/create-market/constants';
import SavedDrafts from 'modules/create-market/saved-drafts';

import Styles from 'modules/create-market/landing.styles.less';
import { getTemplateRadioCards } from './get-template';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { marketCreationStarted } from 'services/analytics/helpers';

interface LandingProps {
  updatePage: Function;
}

const Landing = ({
  updatePage,
}: LandingProps) => {
  const {
    newMarket,
    categoryStats,
    actions: { updateNewMarket, clearNewMarket },
  } = useAppStatusStore();
  const node = useRef(null);
  useEffect(() => {
    node.current.scrollIntoView();
  }, [true]);
  return (
    <div ref={node} className={Styles.Landing}>
      <XLargeSubheaders header='Create a new market'>
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
                updatedNewMarket.navCategories[0] = value;
                updatedNewMarket.navCategories[1] = '';
                updatedNewMarket.navCategories[2] = '';
                updatedNewMarket.currentStep = 1;
                updatedNewMarket.marketType = '';
                updatedNewMarket.validations = EMPTY_STATE.validations;
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
              <SmallHeaderLink
                copyType={MARKET_COPY_LIST.DONT_SEE_CAT}
                text="Don't see your category?"
                link
              />
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
};
export default Landing;
