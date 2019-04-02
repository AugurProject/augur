import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Helmet } from "react-helmet";

import speedomatic from "speedomatic";
import { createBigNumber } from "utils/create-big-number";
import { ZERO } from "modules/trades/constants/numbers";
import { formatGasCostToEther } from "utils/format-number";
import MarketPreview from "modules/market/containers/market-preview";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import ReportingDisputeForm from "modules/reporting/containers/reporting-dispute-form";
import ReportingDisputeConfirm from "modules/reporting/components/reporting-dispute-confirm/reporting-dispute-confirm";
import { TYPE_VIEW } from "modules/markets/constants/link-types";
import { isEmpty } from "lodash";
import FormStyles from "modules/common/less/form";
import Styles from "modules/reporting/components/reporting-report/reporting-report.styles";
import InvalidMessage from "modules/reporting/components/common/invalid-message";

export default class ReportingDispute extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMarketLoaded: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
    marketId: PropTypes.string.isRequired,
    submitMarketContribute: PropTypes.func.isRequired,
    universe: PropTypes.string.isRequired,
    availableRep: PropTypes.string.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      gasEstimate: "0",
      isMarketInValid: null,
      selectedOutcome: "",
      selectedOutcomeName: "",
      stakeInfo: { displayValue: 0, repValue: "0" },
      validations: {
        stake: false,
        selectedOutcome: null
      }
    };

    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentWillMount() {
    const { isConnected, isMarketLoaded, loadFullMarket } = this.props;
    if (isConnected && !isMarketLoaded) {
      loadFullMarket();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.gasPrice !== nextProps.gasPrice &&
      this.state.currentStep === 1
    ) {
      this.calculateGasEstimates(nextProps.gasPrice);
    }
  }

  prevPage() {
    this.setState({
      currentStep: this.state.currentStep <= 0 ? 0 : this.state.currentStep - 1
    });
  }

  nextPage() {
    this.setState({
      currentStep: this.state.currentStep >= 1 ? 1 : this.state.currentStep + 1
    });
    this.calculateGasEstimates(this.props.gasPrice);
  }

  updateState(newState) {
    this.setState(newState);
  }

  calculateGasEstimates(gasPrice) {
    const { submitMarketContribute, market } = this.props;
    const { selectedOutcome, isMarketInValid, stakeInfo } = this.state;
    if (createBigNumber(stakeInfo.repValue).gt(ZERO)) {
      const amount = speedomatic.fix(stakeInfo.repValue, "hex");
      submitMarketContribute({
        estimateGas: true,
        marketId: market.id,
        selectedOutcome,
        invalid: isMarketInValid,
        amount,
        history: null,
        returnPath: null,
        callback: (err, gasEstimateValue) => {
          if (err) return console.error(err);

          this.setState({
            gasEstimate: formatGasCostToEther(
              gasEstimateValue,
              { decimalsRounded: 4 },
              gasPrice
            )
          });
        }
      });
    }
  }

  render() {
    const {
      history,
      isLogged,
      location,
      market,
      submitMarketContribute,
      availableRep
    } = this.props;
    const s = this.state;

    return (
      <section>
        <Helmet>
          <title>Submit Dispute</title>
        </Helmet>
        {!isEmpty(market) && (
          <MarketPreview
            {...market}
            isLogged={isLogged}
            location={location}
            history={history}
            cardStyle="single-card"
            linkType={TYPE_VIEW}
            buttonText="View"
            showAdditionalDetailsToggle
            showDisputeRound
          />
        )}
        {!isEmpty(market) && (
          <article className={FormStyles.Form}>
            {s.currentStep === 0 && (
              <div className={Styles.ReportingReport_form_message}>
                <div>
                  <InvalidMessage />
                  <ReportingDisputeForm
                    market={market}
                    updateState={this.updateState}
                    stakeInfo={s.stakeInfo}
                    availableRep={availableRep}
                  />
                  <InvalidMessage />
                </div>
              </div>
            )}
            {s.currentStep === 1 && (
              <ReportingDisputeConfirm
                isMarketInValid={s.isMarketInValid}
                selectedOutcome={s.selectedOutcomeName}
                stakeInfo={s.stakeInfo}
                gasEstimate={s.gasEstimate}
              />
            )}
            <div className={FormStyles.Form__navigation}>
              <button
                className={classNames(FormStyles.Form__prev, {
                  [`${FormStyles["hide-button"]}`]: s.currentStep === 0
                })}
                onClick={this.prevPage}
              >
                Previous
              </button>
              <button
                className={classNames(FormStyles.Form__next, {
                  [`${FormStyles["hide-button"]}`]: s.currentStep === 1
                })}
                disabled={
                  !Object.keys(s.validations).every(
                    key => s.validations[key] === true
                  )
                }
                onClick={
                  Object.keys(s.validations).every(
                    key => s.validations[key] === true
                  )
                    ? this.nextPage
                    : undefined
                }
              >
                Review
              </button>
              {s.currentStep === 1 && (
                <button
                  className={FormStyles.Form__submit}
                  onClick={() =>
                    submitMarketContribute({
                      estimateGas: false,
                      marketId: market.id,
                      selectedOutcome: s.selectedOutcome,
                      invalid: s.isMarketInValid,
                      amount: speedomatic.fix(s.stakeInfo.repValue, "hex"),
                      history
                    })
                  }
                >
                  Submit
                </button>
              )}
            </div>
          </article>
        )}
        {isEmpty(market) && (
          <div className={Styles.NullState}>
            <NullStateMessage
              message="Market not found"
              className={Styles.NullState}
            />
          </div>
        )}
      </section>
    );
  }
}
