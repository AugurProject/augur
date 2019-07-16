import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import { LocationDisplay } from "modules/common/form";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import { LargeHeader, ExplainerBlock, ContentBlock, LargeSubheaders, XLargeSubheaders, SmallHeaderLink } from "modules/create-market/components/common";
import { 
  RadioCardGroup
} from "modules/common/form";

export default class Templates extends Component {
  render() {
    return(
      <section>
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
                  const updatedNewMarket = {...newMarket};
                  updatedNewMarket.categories[1] = value;
                  updateNewMarket(updatedNewMarket);
                }}
                radioButtons={MARKET_TEMPLATES}
              >
                <SmallHeaderLink text="Don't see your category?" link ownLine /> 
              </RadioCardGroup>
            </section>
          </ContentBlock>
      </section>
    );
  }
}