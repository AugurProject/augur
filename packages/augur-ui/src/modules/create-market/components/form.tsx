import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import FormDetails from "modules/create-market/components/form-details";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import Styles from "modules/create-market/components/form.styles";

interface FormProps {
  updateNewMarket: Function;
  newMarket: Object;
}

interface FormState {
  selected: number;
}

export default class Form extends React.Component<
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
   // if (newMarket.isValid) {
      const newStep =
        newMarket.currentStep >= this.state.pages.length - 1
          ? this.state.pages.length - 1
          : newMarket.currentStep + 1;
      updateNewMarket({ currentStep: newStep });
    //}
  }

  render() {
    const {
      addOrderToNewMarket,
      newMarket
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.Form}>
        <div>
          {s.pages[newMarket.currentStep]}
        </div>
        <span>
          Create a custom market
        </span>
        <div>
          <span>
            A note on choosing a market
          </span>
          <span>
            Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.
          </span>
          <span>
            A market only covers events that occur after market creation time and on or before reporting start time. If the event occurs outside of these bounds it has a high probability as resolving as invalid. 
          </span>
        </div>
        <FormDetails />
        <SecondaryButton text="Back" action={this.prevPage} />
        <PrimaryButton text="Next" action={this.nextPage} />
      </div>
    );
  }
}
