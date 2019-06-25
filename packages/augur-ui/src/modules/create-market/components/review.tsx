import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/create-market/components/review.styles";

interface ReviewProps {
  newMarket: Object;
  updateNewMarket: Function;
  address: String;
}

interface ReviewState {
  selected: number;
}

export default class Review extends React.Component<
  ReviewProps,
  ReviewState
> {
  state: FormState = {
    empty: ""
  };

  render() {
    const {
      newMarket
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.Review}>
        Review
      </div>
    );
  }
}
