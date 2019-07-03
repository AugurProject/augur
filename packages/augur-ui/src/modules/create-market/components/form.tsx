import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";

import { LocationDisplay } from "modules/common/form";
import { BACK, NEXT, CREATE, CUSTOM_CONTENT_PAGES, REVIEW, FORM_DETAILS, LANDING } from "modules/create-market/constants";
import { PrimaryButton, SecondaryButton } from "modules/common/buttons";
import { createMarket } from "modules/contracts/actions/contractCalls";
import { LargeHeader, ExplainerBlock, ContentBlock } from "modules/create-market/components/common";
import { NewMarket, Drafts } from "modules/types";
import FormDetails from "modules/create-market/containers/form-details";
import Review from "modules/create-market/containers/review";
import makePath from "modules/routes/helpers/make-path";
import {
  CREATE_MARKET
} from "modules/routes/constants/views";
import { SCRATCH } from "modules/create-market/constants";
import { DEFAULT_STATE } from "modules/markets/reducers/new-market";

import Styles from "modules/create-market/components/form.styles";

interface FormProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
  addDraft: Function;
  drafts: Drafts;
  updateDraft: Function;
  clearNewMarket: Function;
  discardModal: Function;
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

  componentDidMount() {
    this.node.scrollIntoView();
  }

  componentWillUnmount() {
    this.unblock();
  }

  unblock = (cb?: Function) => {
    const {
      drafts,
      newMarket,
      discardModal
    } = this.props;

    const savedDraft = drafts[newMarket.uniqueId];
    const disabledSave = savedDraft && JSON.stringify(newMarket) === JSON.stringify(savedDraft);
    const unsaved = !newMarket.uniqueId && JSON.stringify(newMarket) !== JSON.stringify(DEFAULT_STATE);

    if (unsaved || disabledSave === false) {
      discardModal((close: Boolean) => {
        if (!close) {
          this.props.history.push({
            pathname: makePath(CREATE_MARKET, null),
            state: SCRATCH,
          });
          cb && cb(false);
        } else {
          cb && cb(true);
        }
      });
    } else {
      cb && cb(true);
    }
  }

  prevPage = () => {
    const { newMarket, updateNewMarket, updatePage, clearNewMarket } = this.props;

    if (newMarket.currentStep <= 0) {
      this.unblock((goBack: Boolean) => {
        if (goBack) {
          updatePage(LANDING);
          clearNewMarket();
        }
      });
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

  saveDraft = () => {
    const {
      addDraft, 
      currentTimestamp,
      newMarket,
      updateNewMarket,
      drafts,
      updateDraft
    } = this.props;

    if (newMarket.description === DEFAULT_STATE.description) {
      return;
    }

    if (newMarket.uniqueId && drafts[newMarket.uniqueId]) {
      // update draft
      const updatedDate = Date.now(); // should be currentTimestamp
      const draftMarket = {
        ...newMarket,
        updated: updatedDate
      };
      updateDraft(newMarket.uniqueId, draftMarket);
       updateNewMarket({ 
        updated: updatedDate 
      });
    } else {
      // create new draft
      const createdDate = Date.now(); // should be currentTimestamp
      const draftMarket = {
        ...newMarket,
        uniqueId: createdDate,
        created: createdDate,
        updated: createdDate
      }

      addDraft(createdDate, draftMarket);
      updateNewMarket({ 
        uniqueId: createdDate,
        created: createdDate,
        updated: createdDate 
      });
    }
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
      newMarket,
      drafts
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

    const savedDraft = drafts[newMarket.uniqueId];
    const disabledSave = savedDraft && JSON.stringify(newMarket) === JSON.stringify(savedDraft);
    return (
      <div 
        ref={node => {
          this.node = node;
        }}
        className={Styles.Form}
      >
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
              <SecondaryButton text={disabledSave ? "Saved": "Save draft"} disabled={disabledSave} action={this.saveDraft} />
              {secondButton === NEXT &&  <PrimaryButton text="Next" action={this.nextPage} />}
              {secondButton === CREATE && <PrimaryButton text="Create" action={this.submitMarket} />}
            </div>
          </div>
        </ContentBlock>
      </div>
    );
  }
}
