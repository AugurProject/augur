import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { LocationDisplay } from "modules/common/form";
import FormDetails from "modules/create-market/components/form-details";
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
  state: FormState = {
    pages: ["Event details", "Fees & liquidity", "Review"]
  };

  render() {
    const {
      updateNewMarket,
      newMarket
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.Form}>
        <LocationDisplay currentStep={newMarket.currentStep} pages={s.pages} />
        <span>
          Create a custom market
        </span>
        <div>
          <span>
            A note on choosing a market
          </span>
          <span>
            Create markets that will have an <span>objective outcome</span> by the events end time. 
            Avoid creating markets that have subjective or ambiguous outcomes. 
            If you're not sure that the market's outcome will be known beyond a <span>reasonable doubt</span> by the reporting start time, 
            you should not create the market.
          </span>
          <span>
            A market only covers events that occur <span>after</span> market creation time and on or <span>before</span> reporting start time. 
            If the event occurs outside of these bounds it has a high probability as resolving as invalid. 
          </span>
        </div>
        <FormDetails newMarket={newMarket} updateNewMarket={updateNewMarket} />
      </div>
    );
  }
}
