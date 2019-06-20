import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { RadioCardGroup } from "modules/common/form";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";

import Styles from "modules/create-market/components/form-details.styles";

interface FormDetailsProps {
  updateNewMarket: Function;
  newMarket: Object;
}

interface FormDetailsState {
  selected: number;
}

export default class FormDetails extends React.Component<
  FormDetailsProps,
  FormDetailsState
> {
  state: FormDetailsState = {
    pages: ["Event details", "Fees & liquidity", "Review"]
  };

  onChange = (value) => {
    console.log(value);
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
      <div className={Styles.FormDetails}>
        <span>Market Details</span>
        <span>Market type</span>
        <span>Market types vary based on the amount of possible outcomes. <a target="blank" href="https://docs.augur.net">Learn more</a></span>
        <RadioCardGroup 
          radioButtons={[
            {
              value: 'YesNo',
              header: 'Yes / No',
              description: 'There are two possible outcomes: “Yes” or “No”',
              onChange: this.onChange,
            },
            {
              value: 'MultipleChoice',
              header: 'Multiple Choice',
              description: 'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
              onChange: this.onChange,
            },
            {
              value: 'Scalar',
              header: 'Scalar',
              description: 'A range of numeric outcomes: “USD range” between “1” and “100”.',
              onChange: this.onChange,
            },
          ]}
        />
        <SecondaryButton text="Back" action={this.prevPage} />
        <PrimaryButton text="Next" action={this.nextPage} />
      </div>
    );
  }
}