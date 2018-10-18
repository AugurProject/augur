import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Helmet } from "react-helmet";

import speedomatic from "speedomatic";
import { formatGasCostToEther } from "utils/format-number";
import MarketPreview from "modules/market/components/market-preview/market-preview";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import MigrateRepForm from "modules/forking/components/migrate-rep-form/migrate-rep-form";
import MigrateRepConfirm from "modules/forking/components/migrate-rep-confirm/migrate-rep-confirm";
import { TYPE_VIEW } from "modules/markets/constants/link-types";
import { isEmpty } from "lodash";
import FormStyles from "modules/common/less/form";
import Styles from "modules/reporting/components/reporting-report/reporting-report.styles";

export default class MigrateRep extends Component {
  static propTypes = {
    accountREP: PropTypes.string.isRequired,
    getForkMigrationTotals: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMarketLoaded: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
    marketId: PropTypes.string.isRequired,
    submitMigrateREP: PropTypes.func.isRequired,
    currentBlockNumber: PropTypes.number.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      isMarketInValid: null,
      selectedOutcome: "",
      selectedOutcomeName: "",
      repAmount: "",
      validations: {
        repAmount: false,
        selectedOutcome: null
      },
      gasEstimate: "0",
      forkMigrationTotals: null
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

  prevPage() {
    this.setState({
      currentStep: this.state.currentStep <= 0 ? 0 : this.state.currentStep - 1
    });
  }

  nextPage() {
    this.setState({
      currentStep: this.state.currentStep >= 1 ? 1 : this.state.currentStep + 1
    });
    // estimate gas, user is moving to confirm
    this.calculateGasEstimates();
  }

  updateState(newState) {
    this.setState(newState);
  }

  calculateGasEstimates() {
    const { submitMigrateREP, market, gasPrice } = this.props;
    if (this.state.repAmount !== "") {
      const amount = speedomatic.fix(this.state.repAmount, "hex");
      submitMigrateREP({
        estimateGas: true,
        marketId: market.id,
        selectedOutcome: this.state.selectedOutcome,
        invalid: this.state.isMarketInValid,
        amount,
        history: null,
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
      accountREP,
      history,
      isLogged,
      location,
      market,
      submitMigrateREP,
      getForkMigrationTotals,
      currentBlockNumber
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
          />
        )}
        {!isEmpty(market) && (
          <article className={FormStyles.Form}>
            {s.currentStep === 0 && (
              <MigrateRepForm
                market={market}
                updateState={this.updateState}
                isMarketInValid={s.isMarketInValid}
                selectedOutcome={s.selectedOutcome}
                selectedOutcomeName={s.selectedOutcomeName}
                forkMigrationTotals={s.forkMigrationTotals}
                validations={s.validations}
                repAmounts={s.repAmount}
                accountREP={accountREP}
                getForkMigrationTotals={getForkMigrationTotals}
                currentBlockNumber={currentBlockNumber}
              />
            )}
            {s.currentStep === 1 && (
              <MigrateRepConfirm
                selectedOutcomeName={s.selectedOutcomeName}
                repAmount={s.repAmount}
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
                    submitMigrateREP({
                      estimateGas: false,
                      marketId: market.id,
                      selectedOutcome: s.selectedOutcome,
                      invalid: s.isMarketInValid,
                      amount: speedomatic.fix(s.repAmount, "hex"),
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
