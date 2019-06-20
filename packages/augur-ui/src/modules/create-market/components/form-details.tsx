import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { RadioCardGroup, FormDropdown, RadioBar, TextInput } from "modules/common/form";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import { CUSTOM_PAGES } from "modules/common/constants";

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
    empty: ""
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
        newMarket.currentStep >= CUSTOM_PAGES.length - 1
          ? CUSTOM_PAGES.length - 1
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
        <div>
          <span>Market details</span>
          <div>
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
          </div>
          <div>
            <span>Reporting start date and time</span>
            <span>Choose a date and time that is sufficiently after the end of the event. If reporting starts before the event end time the market will likely be reported as invalid. Make sure to factor in potential delays that can impact the event end time. <a target="blank" href="https://docs.augur.net">Learn more</a></span>
            <FormDropdown
              options={[{
                label: "Test",
                value: 0
              }]}
              defaultValue={0}
              onChange={this.onChange}
            />
          </div>
          <div>
            <span>Market question</span>
            <span>What do you want people to predict? If entering a date and time in the Market Question and/or Additional Details, enter a date and time in the UTC-0 timezone that is sufficiently before the Official Reporting Start Time. <a target="blank" href="https://docs.augur.net">Learn more</a></span>
            <TextInput 
              type="textarea" 
              placeholder="Example: Will [person] win the [year] [event]?"
              onChange={this.onChange}
              rows="3"
            />
          </div>
           <div>
            <span>Market category</span>
            <span>Categories help users to find your market on Augur. </span>
            <FormDropdown
              options={[{
                label: "Test",
                value: 0
              }]}
              defaultValue={0}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div>
          <span>Resolution Information</span>
          <div>
            <span>Resolution source</span>
            <span>Describe what users need to know in order to resolve the market. <a target="blank" href="https://docs.augur.net">Learn more</a></span>
            <RadioBar header={"General knowledge"} onChange={this.onChange} />
            <RadioBar header={"Outcome available on a public website"} onChange={this.onChange} />
          </div>
          <div>
            <span>Resolution details</span>
            <span>Describe what users need to know to determine the outcome of the event. <a target="blank" href="https://docs.augur.net">Learn more</a></span>
            <TextInput 
              type="textarea" 
              placeholder="Describe how the event should be resolved under different scenarios."
              onChange={this.onChange}
              rows="3"
            />
          </div>
          <div>
            <span>Designated reporter</span>
            <span>The person assigned to report the winning outcome of the event (within 24 hours after Reporting Start Time). <a target="blank" href="https://docs.augur.net">Learn more</a></span>
            <RadioBar header={"Myself"} onChange={this.onChange} />
            <RadioBar header={"Someone else"} onChange={this.onChange} />
          </div>
        </div>
        <div>
          <SecondaryButton text="Back" action={this.prevPage} />
          <PrimaryButton text="Next" action={this.nextPage} />
        </div>
      </div>
    );
  }
}