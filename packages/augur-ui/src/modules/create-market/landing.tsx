import React from "react";

import { RadioCardGroup } from "modules/common/form";
import { LargeSubheaders, ContentBlock, XLargeSubheaders, SmallHeaderLink } from "modules/create-market/components/common";
import { SecondaryButton } from "modules/common/buttons";
import { SCRATCH, TEMPLATE } from "modules/create-market/constants";
import SavedDrafts from "modules/create-market/containers/saved-drafts";

import Styles from "modules/create-market/landing.styles.less";
import { getTemplateRadioCards } from "./get-template";
import { Getters } from "@augurproject/sdk";
import { NewMarket } from "modules/types";

interface LandingProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
  clearNewMarket: Function;
  categoryStats: Getters.Markets.CategoryStats;
}

export default class Landing extends React.Component<
  LandingProps,
  {}
> {

  componentDidMount() {
    this.node.scrollIntoView();
  }

  render() {
    const {
      updatePage,
      updateNewMarket,
      newMarket,
      clearNewMarket,
      categoryStats
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
              underline
              ownLine
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
                  updateNewMarket(updatedNewMarket);
                  updatePage(TEMPLATE);
                }}
                radioButtons={getTemplateRadioCards({
                  primary: '',
                  secondary: '',
                  tertiary: '',
                }, categoryStats)}
              >
                <SmallHeaderLink text="Don't see your category?" link ownLine />
              </RadioCardGroup>
            </section>
          </ContentBlock>

          <ContentBlock>
            <LargeSubheaders
              link
              header="Start from scratch"
              subheader="Create a completely custom market, only recommended for advanced users."
            />
            <SecondaryButton
              text="Create a custom market"
              action={() => {
                clearNewMarket();
                updatePage(SCRATCH);
              }}
            />
          </ContentBlock>
        </div>
      </div>
    );
  }
}
