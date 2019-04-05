import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import { createBigNumber } from "utils/create-big-number";
import { augur } from "services/augurjs";
import {
  formatEtherEstimate,
  formatGasCostToEther,
  formatRep,
  formatAttoEth
} from "utils/format-number";
import { ZERO } from "modules/trades/constants/numbers";
import MarketPreview from "modules/market/containers/market-preview";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import ReportingReportForm from "modules/reporting/components/reporting-report-form/reporting-report-form";
import ReportingReportConfirm from "modules/reporting/components/reporting-report-confirm/reporting-report-confirm";
import { TYPE_VIEW } from "modules/markets/constants/link-types";
import { isEmpty } from "lodash";
import FormStyles from "modules/common/less/form";
import InvalidMessage from "modules/reporting/components/common/invalid-message";
import Styles from "modules/reporting/components/reporting-report/reporting-report.styles";

export default class ReportingReport extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMarketLoaded: PropTypes.bool.isRequired,
    isOpenReporting: PropTypes.bool.isRequired,
    isDesignatedReporter: PropTypes.bool.isRequired,
    isDRMarketCreator: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
    marketId: PropTypes.string.isRequired,
    submitInitialReport: PropTypes.func.isRequired,
    universe: PropTypes.string.isRequired,
    availableRep: PropTypes.string.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      isMarketInValid: null,
      selectedOutcome: "",
      selectedOutcomeName: "",
      // need to get value from augur-node for
      // designated reporter or initial reporter (open reporting)
      stake: formatRep("0"),
      validations: {
        selectedOutcome: null
      },
      designatedReportNoShowReputationBond: formatEtherEstimate(
        props.market.designatedReportStake
      ),
      gasEstimate: "0"
    };

    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentWillMount() {
    const { isConnected, isMarketLoaded, loadFullMarket } = this.props;
    // needed for both DR and open reporting
    this.calculateMarketCreationCosts();
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

  calculateMarketCreationCosts() {
    const {
      universe,
      market,
      isDRMarketCreator,
      isDesignatedReporter
    } = this.props;
    augur.api.Universe.getOrCacheDesignatedReportStake(
      { tx: { to: universe, send: false } },
      (err, initialReporterStake) => {
        if (err) return console.error(err);

        const { designatedReportStake } = market;
        const initialStake = formatAttoEth(initialReporterStake || 0);
        const neededStake = isDRMarketCreator
          ? createBigNumber(initialStake.fullPrecision).minus(
              designatedReportStake
            )
          : initialStake.fullPrecision;

        const repAmount = formatEtherEstimate(neededStake);

        this.setState({
          stake: isDesignatedReporter ? repAmount : formatRep("0")
        });
      }
    );
  }

  calculateGasEstimates(gasPrice) {
    const { submitInitialReport, market } = this.props;
    const { selectedOutcome, isMarketInValid } = this.state;
    submitInitialReport({
      estimateGas: true,
      marketId: market.id,
      selectedOutcome,
      invalid: isMarketInValid,
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

  render() {
    const {
      history,
      isLogged,
      isOpenReporting,
      location,
      market,
      submitInitialReport,
      availableRep,
      isDesignatedReporter
    } = this.props;
    const s = this.state;

    const BNstake = createBigNumber(s.stake.fullPrecision);
    const insufficientRep = !isOpenReporting
      ? createBigNumber(availableRep).lt(BNstake)
      : false;
    const disableReview =
      !Object.keys(s.validations).every(key => s.validations[key] === true) ||
      insufficientRep ||
      (!isDesignatedReporter && !isOpenReporting);
    let stakeLabel = "Required Stake";
    let stakeValue = s.stake.formatted;
    if (createBigNumber(s.stake.fullPrecision).lt(ZERO)) {
      stakeLabel = "REP STAKE RETURNS";
      stakeValue = formatRep(createBigNumber(s.stake.fullPrecision).abs())
        .formatted;
    }
    return (
      <section>
        <Helmet>
          <title>Submit Report</title>
        </Helmet>
        {!isEmpty(market) && (
          <MarketPreview
            {...market}
            isLogged={isLogged}
            location={location}
            history={history}
            cardStyle="single-card"
            hideReportEndingIndicator
            linkType={TYPE_VIEW}
            buttonText="View"
            showAdditionalDetailsToggle
          />
        )}
        {!isEmpty(market) && (
          <article className={FormStyles.Form}>
            {s.currentStep === 0 && (
              <div className={Styles.ReportingReport_form_message}>
                <div>
                  <InvalidMessage />
                  <ReportingReportForm
                    market={market}
                    updateState={this.updateState}
                    isMarketInValid={s.isMarketInValid}
                    selectedOutcome={s.selectedOutcome}
                    stake={stakeValue}
                    stakeLabel={stakeLabel}
                    validations={s.validations}
                    isOpenReporting={isOpenReporting}
                    insufficientRep={insufficientRep}
                    isDesignatedReporter={isDesignatedReporter}
                  />
                  <InvalidMessage />
                </div>
              </div>
            )}
            {s.currentStep === 1 && (
              <ReportingReportConfirm
                market={market}
                isMarketInValid={s.isMarketInValid}
                selectedOutcome={s.selectedOutcomeName}
                stake={stakeValue}
                stakeLabel={stakeLabel}
                designatedReportNoShowReputationBond={
                  s.designatedReportNoShowReputationBond
                }
                isDesignatedReporter={isDesignatedReporter}
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
                disabled={disableReview}
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
                    submitInitialReport({
                      estimateGas: false,
                      marketId: market.id,
                      selectedOutcome: s.selectedOutcome,
                      invalid: s.isMarketInValid,
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
