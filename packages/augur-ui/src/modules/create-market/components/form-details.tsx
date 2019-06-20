import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/create-market/components/form-details.styles";

interface FormProps {
  updateNewMarket: Function;
  newMarket: Object;
}

interface FormState {
  selected: number;
}

export default class FormDetails extends React.Component<
  FormProps,
  FormState
> {
  state: OverviewState = {
    pages: ["Event details", "Fees & liquidity", "Review"]
  };

  componentWillReceiveProps = (nextProps) => {
  }

 prevPage = () => {
    const { newMarket, updateNewMarket } = this.props;
    const newStep = newMarket.currentStep <= 0 ? 0 : newMarket.currentStep - 1;
    updateNewMarket({ currentStep: newStep });
  }

  nextPage = () =>  {
    const { newMarket, updateNewMarket } = this.props;
    if (newMarket.isValid) {
      const newStep =
        newMarket.currentStep >= this.state.pages.length - 1
          ? this.state.pages.length - 1
          : newMarket.currentStep + 1;
      updateNewMarket({ currentStep: newStep });
    }
  }

  render() {
    const {
      addOrderToNewMarket,
      newMarket
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.FormDetails}>
        Market Details
      </div>
    );
  }
}
