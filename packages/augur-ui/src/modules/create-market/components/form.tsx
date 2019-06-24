import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { LocationDisplay } from "modules/common/form";
import { CUSTOM_PAGES } from "modules/common/constants";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";

import FormDetails from "modules/create-market/containers/form-details";
import Review from "modules/create-market/containers/review";

import Styles from "modules/create-market/components/form.styles";

interface FormProps {
  newMarket: Object;
  updateNewMarket: Function;
  address: String;
}

interface FormState {
  selected: number;
}

export default class Form extends React.Component<
  FormProps,
  FormState
> {
  state: FormState = {
    empty: ""
  };


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
    const { newMarket, address } = this.props;

    createMarket({
      isValid: true,
      validations: newMarket.validations,
      currentStep: newMarket.currentStep,
      type: newMarket.type, // this isn't used
      outcomes: [],
      scalarSmallNum: newMarket.minPrice,
      scalarBigNum: newMarket.maxPrice,
      scalarDenomination: newMarket.scalarDenomination,
      description: newMarket.description,
      expirySourceType: newMarket.expirySourceType,
      expirySource: newMarket.expirySource,
      designatedReporterType: newMarket.designatedReporterType,
      designatedReporterAddress: (newMarket.designatedReporterAddress === "") ? address : newMarket.designatedReporterAddress,
      minPrice: newMarket.minPrice,
      maxPrice: newMarket.maxPrice,
      endTime: newMarket.endTime.unix(), // newMarket.endTime, this is a number (timestamp)
      tickSize: newMarket.tickSize, // maxPrice.tickSize, this needs to be a string
      hour: newMarket.hour,
      minute: newMarket.minute,
      meridiem: newMarket.meridiem,
      marketType: newMarket.type,
      detailsText: newMarket.detailsText,
      category: "",
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
      newMarket
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.Form}>
        <LocationDisplay currentStep={newMarket.currentStep} pages={CUSTOM_PAGES} />
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
        <div>
          {newMarket.currentStep === 0 &&
            <FormDetails />
          }
          {newMarket.currentStep === 2 &&
            <Review />
          }
          <div>
            <SecondaryButton text="Back" action={this.prevPage} />
            {newMarket.currentStep !== 2 && <PrimaryButton text="Next" action={this.nextPage} />}
            {newMarket.currentStep === 2 && <PrimaryButton text="Create" action={this.submitMarket} />}
          </div>
        </div>
      </div>
    );
  }
}
