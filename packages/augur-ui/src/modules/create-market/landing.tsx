import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { RadioCardGroup } from "modules/common/form";
import { LargeSubheaders, ContentBlock, XLargeSubheaders, SmallHeaderLink } from "modules/create-market/components/common";
import { SecondaryButton } from "modules/common/buttons";
import { SCRATCH, TEMPLATE, MARKET_TEMPLATES } from "modules/create-market/constants";
import SavedDrafts from "modules/create-market/saved-drafts";

import Styles from "modules/create-market/landing.styles";

interface LandingProps {
  newMarket: Object;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
}

export default class Landing extends React.Component<
  LandingProps,
  {}
> {
  render() {
    const {
      updatePage
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.Landing}>
        <XLargeSubheaders header={"Create a new market"}>
          Augur allows <span>anyone</span>, <span>anywhere</span>, to create a market on <span>anything</span>
        </XLargeSubheaders>

        <div>
          <SavedDrafts />
          <ContentBlock>
            <LargeSubheaders
              link
              underline
              ownLine
              header="Use a market template"
              subheader="Templates simplify the creation of new markets and reduce errors in the market making process. "
            />
            <RadioCardGroup
              onChange={(value: string) => updatePage(TEMPLATE)}
              radioButtons={MARKET_TEMPLATES}
            >
              <SmallHeaderLink text="Don't see your category?" link ownLine /> 
            </RadioCardGroup>
          </ContentBlock>

          <ContentBlock>
            <LargeSubheaders
              link
              header="Start from scratch"
              subheader="Create a completely custom market, only recommended for advanced users."
            />
            <SecondaryButton 
              text="Create a custom market" 
              action={() => updatePage(SCRATCH)}
            />
          </ContentBlock>

          <ContentBlock>
            <LargeSubheaders
              link
              header="Import a market template"
              subheader="Use a market template created by you or the Augur community."
            />
            <SecondaryButton 
              text="Import a template" 
              action={() => updatePage(TEMPLATE)}
            />
          </ContentBlock>
        </div>
      </div>
    );
  }
}
