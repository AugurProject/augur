import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";

import { RadioCardGroup, FormDropdown, RadioBar, TextInput, DatePicker, TimeSelector } from "modules/common/form";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import { createMarket } from "modules/contracts/actions/contractCalls";
import { Header, Subheaders } from "modules/create-market/components/common";
import { YES_NO, SCALAR, CATEGORICAL, CUSTOM_PAGES } from 'modules/common/constants';

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

  onChange = (name, value) => {
    const { updateNewMarket } = this.props;
    updateNewMarket({ [name]: value });
  }

  prevPage = () => {
    const { newMarket, updateNewMarket } = this.props;
    const newStep = newMarket.currentStep <= 0 ? 0 : newMarket.currentStep - 1;
    updateNewMarket({ currentStep: newStep });
  }

  nextPage = () => {
    const { newMarket, updateNewMarket } = this.props;
   // if (newMarket.isValid) {
      const newStep =
        newMarket.currentStep >= CUSTOM_PAGES.length - 1
          ? CUSTOM_PAGES.length - 1
          : newMarket.currentStep + 1;
      updateNewMarket({ currentStep: newStep });
    //}
  }

  submitMarket = () => {
    const { newMarket } = this.props;

    createMarket({
      isValid: true,
      validations: [],
      currentStep: 0,
      type: YES_NO,
      outcomes: [],
      scalarSmallNum: "",
      scalarBigNum: "",
      scalarDenomination: "",
      description: "bob's market",
      expirySourceType: "",
      expirySource: "",
      designatedReporterType: "",
      designatedReporterAddress: "0x4EB4F1dd4277B31dbDCD91E93a3319D721CAeEbc",
      minPrice: "0", // newMarket.minPrice,
      maxPrice: "1", // newMarket.maxPrice,
      endTime: 1566423456, // newMarket.endTime,
      tickSize: "100", // maxPrice.tickSize,
      hour: "",
      minute: "",
      meridiem: "",
      marketType: YES_NO,
      detailsText: "",
      category: "bobbyBrown",
      tag1: "",
      tag2: "",
      settlementFee: 0,
      affiliateFee: 0,
      orderBook: {},
      orderBookSorted: {},
      orderBookSeries: {},
      initialLiquidityEth: 0,
      initialLiquidityGas: 0,
      creationError: ""
    });
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
          <Header text="Market details" />

          <Subheaders header="Market type" link subheader="Market types vary based on the amount of possible outcomes." />
          <RadioCardGroup
            onChange={(value: string) => this.onChange("type", value)}
            radioButtons={[
              {
                value: YES_NO,
                header: 'Yes / No',
                description: 'There are two possible outcomes: “Yes” or “No”',
              },
              {
                value: CATEGORICAL,
                header: 'Multiple Choice',
                description: 'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
              },
              {
                value: SCALAR,
                header: 'Scalar',
                description: 'A range of numeric outcomes: “USD range” between “1” and “100”.',
              },
            ]}
          />

          <Subheaders header="Reporting start date and time" subheader="Choose a date and time that is sufficiently after the end of the event. If reporting starts before the event end time the market will likely be reported as invalid. Make sure to factor in potential delays that can impact the event end time. " link />
          <span>
            <DatePicker
              date={0}
              placeholder="Date"
              displayFormat="MMM D, YYYY"
              id="cm__input--date"
              onDateChange={date => {

              }}
              isOutsideRange={day =>
                day.isAfter(moment(0).add(6, "M")) ||
                day.isBefore(moment(0))
              }
              focused={false}
              onFocusChange={({ focused }) => {}}
              numberOfMonths={1}
            />
            <TimeSelector
              date={newMarket.endTime}
              placeholder="Date"
              displayFormat="MMM D, YYYY"
            />
            <FormDropdown
              options={[{
                label: "Test",
                value: 0
              }]}
              staticLabel="Timezone"
            />
          </span>

          <Subheaders header="Market question" link subheader="What do you want people to predict? If entering a date and time in the Market Question and/or Additional Details, enter a date and time in the UTC-0 timezone that is sufficiently before the Official Reporting Start Time." />
          <TextInput
            type="textarea"
            placeholder="Example: Will [person] win the [year] [event]?"
            onChange={(value: string) => this.onChange("description", value)}
            rows="3"
          />

          {newMarket.type === SCALAR &&
            <>
              <Subheaders header="Unit of measurement" subheader="Choose a denomination for the range." link />
              <FormDropdown
                options={[{
                  label: "Test",
                  value: 0
                }]}
                staticLabel="Denomination"
                onChange={(value: string) => this.onChange("scalarDenomination", value)}
              />
              <Subheaders header="Numeric range" subheader="Choose the min and max values of the range." link />
<<<<<<< Updated upstream
              <section>
                <TextInput
                  type="number"
                  placeholder="0"
                  onChange={(value: string) => this.onChange("minPrice", value)}
                />
                <span>to</span>
                <TextInput
                  type="number"
                  placeholder="100"
                  onChange={(value: string) => this.onChange("maxPrice", value)}
                  trailingLabel="Denomination"
                />
              </section>
=======
              <TextInput
                type="number"
                placeholder="0"
                onChange={(value: string) => this.onChange("minPrice", value)}
              />
              <TextInput
                type="number"
                placeholder="100"
                onChange={(value: string) => this.onChange("maxPrice", value)}
              />
>>>>>>> Stashed changes
              <Subheaders header="Precision" subheader="What is the smallest quantity of the denomination users can choose, e.g: “0.1”, “1”, “10”." link />
              <TextInput
                type="number"
                placeholder="0"
                onChange={(value: string) => this.onChange("tickSize", value)}
<<<<<<< Updated upstream
                trailingLabel="Denomination"
              />
=======
              />
>>>>>>> Stashed changes
            </>
          }

          <Subheaders header="Market category" subheader="Categories help users to find your market on Augur." />
          <FormDropdown
            options={[{
              label: "Test",
              value: 0
            }]}
            staticLabel="Select category"
          />
        </div>
        <div>
          <Header text="Resolution information" />

          <Subheaders header="Resolution source" subheader="Describe what users need to know in order to resolve the market." link/>
          <RadioBar header={"General knowledge"} onChange={this.onChange} />
          <RadioBar header={"Outcome available on a public website"} onChange={this.onChange} />

          <Subheaders header="Resolution details" subheader="Describe what users need to know to determine the outcome of the event." link/>
          <TextInput
            type="textarea"
            placeholder="Describe how the event should be resolved under different scenarios."
            rows="3"
            onChange={(value: string) => this.onChange("detailsText", value)}
          />

          <Subheaders header="Designated reporter" subheader="The person assigned to report the winning outcome of the event (within 24 hours after Reporting Start Time)." link/>
          <RadioBar header={"Myself"} onChange={this.onChange} />
          <RadioBar header={"Someone else"} onChange={this.onChange} />
        </div>
        <div>
          <SecondaryButton text="Back" action={this.prevPage} />
          <PrimaryButton text="Submit" action={this.submitMarket} />
          <PrimaryButton text="Next" action={this.nextPage} />
        </div>
      </div>
    );
  }
}
