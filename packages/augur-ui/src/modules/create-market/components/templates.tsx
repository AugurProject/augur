import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { setCategories } from 'modules/categories/set-categories';
import {
  LocationDisplay,
  CategorySingleSelect,
  createGroups,
  determineVisible,
} from 'modules/common/form';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import {
  LargeHeader,
  ExplainerBlock,
  ContentBlock,
  LargeSubheaders,
  XLargeSubheaders,
  SmallHeaderLink,
} from 'modules/create-market/components/common';
import { MARKET_SUB_TEMPLATES, TEMPLATE_CONTENT_PAGES } from 'modules/create-market/constants';
import { RadioCardGroup } from 'modules/common/form';
import Styles from "modules/create-market/components/templates.styles";

export default class Templates extends Component {
  render() {
    const { newMarket, updateNewMarket } = this.props;
    const { categories } = newMarket;
    const {
      tertiaryOptions,
      tertiaryAutoComplete,
    } = createGroups(setCategories, categories, categories);

    return (
      <section className={Styles.Templates}>
        <LocationDisplay currentStep={2} pages={TEMPLATE_CONTENT_PAGES} />
        <ContentBlock>
          <LargeSubheaders
            header="Choose a sub-category"
            subheader="Sub-categories help users find your market."
          />
          <section>
            <RadioCardGroup
              onChange={(value: string) => {
                const updatedNewMarket = { ...newMarket };
                updatedNewMarket.categories[1] = value;
                updateNewMarket(updatedNewMarket);
              }}
              radioButtons={MARKET_SUB_TEMPLATES[newMarket.categories[0]]}
            >
              <SmallHeaderLink text="Don't see your category?" link ownLine />
            </RadioCardGroup>
          </section>
          <section>
            <LargeSubheaders
              header="Choose a further sub-category"
              subheader="Optionally select another sub-category to help users find your market."
            />
            <CategorySingleSelect
              options={tertiaryOptions}
              autoCompleteList={tertiaryAutoComplete}
              initialSelected={categories[2]}
              initialValue={categories[2]}
              staticLabel="Tertiary Category (optional)"
              placeholder="Custom Tertiary Category"
              updateSelection={(value: string) => {
                const updatedNewMarket = { ...newMarket };
                updatedNewMarket.categories[2] = value;
                updateNewMarket(updatedNewMarket);
              }}
            />
          </section>
        </ContentBlock>
      </section>
    );
  }
}
