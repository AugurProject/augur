import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CategoryTagTrail, MarketTypeLabel, MarketStatusLabel } from "modules/common/labels";
import { OutcomeGroup } from "modules/market-cards/common";
import toggleTag from "modules/routes/helpers/toggle-tag";
import toggleCategory from "modules/routes/helpers/toggle-category";
import { MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import MarketLink from "modules/market/components/market-link/market-link";
import { CATEGORICAL } from 'modules/common/constants';

import Styles from "modules/market-cards/market-card.styles";

interface MarketCardProps {
  market: Object;
}

interface MarketCardState {
  expanded: Boolean;
}

export default class MarketCard extends React.Component<
  MarketCardProps,
  MarketCardState
> {
  state: FormDetailsState = {
    expanded: false,
  };

  expand = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {
      market,
      location,
      history
    } = this.props;

    const s = this.state;

    const {
      description,
      outcomesFormatted,
      marketType,
      scalarDenomination,
      minPrice,
      maxPrice,
      categories,
      id,
      marketStatus
    } = market;

    const path =
    location.pathname === makePath(MARKETS)
      ? location
      : { pathname: makePath(MARKETS) };

    const process = (...arr) =>
      arr.filter(Boolean).map(label => ({
        label,
        onClick: toggleCategory(label, path, history)
      }));

    const categoriesWithClick = process(categories[0]);
    const tagsWithClick = [categories[1], categories[2]].filter(Boolean).map(tag => ({
      label: tag,
      onClick: toggleTag(tag, path, history)
    }));

    return (
      <div 
        className={Styles.MarketCard}
      >
        <div>
        </div>
        <div>
          <div>
            <MarketStatusLabel
              marketStatus={marketStatus}
              alternate
              mini
            />
            <MarketTypeLabel marketType={marketType} />
            <CategoryTagTrail
              categories={categoriesWithClick}
              tags={tagsWithClick}
            />
          </div>
          <MarketLink id={id}>
            {description}
          </MarketLink>
          <OutcomeGroup 
            outcomes={outcomesFormatted} 
            marketType={marketType}
            scalarDenomination={scalarDenomination}
            min={minPrice}
            max={maxPrice}
            lastPrice={0}
            expanded={s.expanded}
          />
          {marketType === CATEGORICAL && outcomesFormatted.length > 3 && 
            <button onClick={this.expand}>
              {s.expanded ? "show less" : "view all outcomes"}
            </button>
          }
        </div>
      </div>
    );
  }
}
