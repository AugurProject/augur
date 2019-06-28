import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";

import { LocationDisplay } from "modules/common/form";
import { BACK, NEXT, CREATE, CUSTOM_CONTENT_PAGES, REVIEW, FORM_DETAILS, LANDING } from "modules/create-market/constants";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import { createMarket } from "modules/contracts/actions/contractCalls";
import { LargeHeader, ExplainerBlock, ContentBlock } from "modules/create-market/components/common";

import FormDetails from "modules/create-market/containers/form-details";
import Review from "modules/create-market/containers/review";

import Styles from "modules/create-market/components/form.styles";

interface FormProps {
  newMarket: Object;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
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
    const { newMarket, updateNewMarket, updatePage } = this.props;

    if (newMarket.currentStep <= 0) {
      updatePage(LANDING);
    }

    const newStep = newMarket.currentStep <= 0 ? 0 : newMarket.currentStep - 1;
    updateNewMarket({ currentStep: newStep });
  }

  nextPage = () => {
    const { newMarket, updateNewMarket } = this.props;
   // if (newMarket.isValid) {
      const newStep =
        newMarket.currentStep >= CUSTOM_CONTENT_PAGES.length - 1
          ? CUSTOM_CONTENT_PAGES.length - 1
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

    const { 
      mainContent, 
      explainerBlockTitle, 
      firstButton, 
      secondButton, 
      explainerBlockSubtexts, 
      largeHeader
    } = CUSTOM_CONTENT_PAGES[newMarket.currentStep];

    return (
      <div className={Styles.Form}>
        <LocationDisplay currentStep={newMarket.currentStep} pages={CUSTOM_CONTENT_PAGES} />
        <LargeHeader text={largeHeader} />
        {explainerBlockTitle && explainerBlockSubtexts && 
          <ExplainerBlock
            title={explainerBlockTitle}
            subtexts={explainerBlockSubtexts}
          />
        }
        <ContentBlock>
          {mainContent === FORM_DETAILS && <FormDetails />}
          {mainContent === REVIEW && <Review />}
          <div>
            {firstButton === BACK && <SecondaryButton text="Back" action={this.prevPage} />}
            <div>
              <SecondaryButton text="Save draft" action={this.nextPage} />
              {secondButton === NEXT &&  <PrimaryButton text="Next" action={this.nextPage} />}
              {secondButton === CREATE && <PrimaryButton text="Create" action={this.submitMarket} />}
            </div>
          </div>
        </ContentBlock>
      </div>
    );
  }
}
