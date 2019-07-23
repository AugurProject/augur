import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/market-cards/market-card.styles";

interface MarketCardProps {
  market: Object;
}

export default class MarketCard extends React.Component<
  MarketCardProps,
  {}
> {

  render() {
    const {
      market,
    } = this.props;

    return (
      <div 
        className={Styles.MarketCard}
      >
        card
      </div>
    );
  }
}
