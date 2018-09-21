import React, { Component } from "react";
import PropTypes from "prop-types";
import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";
import getValue from "src/utils/get-value";
import insufficientFunds from "modules/markets/helpers/insufficient-funds";

import { formatEtherEstimate, formatGasCostToEther } from "utils/format-number";
import {
  EXPIRY_SOURCE_GENERIC,
  DESIGNATED_REPORTER_SELF
} from "modules/markets/constants/new-market-constraints";

import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import Styles from "modules/create-market/components/create-market-form-review/create-market-form-review.styles";
import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";

export default class CreateMarketReview extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
    estimateSubmitNewMarket: PropTypes.func.isRequired,
    meta: PropTypes.object,
    availableEth: PropTypes.string.isRequired,
    availableRep: PropTypes.string.isRequired,
    updateStateValue: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const gasPrice = augur.rpc.getGasPrice();

    this.state = {
      gasPrice,
      gasCost: null,
      validityBond: null,
      designatedReportNoShowReputationBond: null,
      insufficientFundsString: "",
      // initialLiquidity: {
      // gas: null,
      // },
      formattedInitialLiquidityEth: formatEtherEstimate(
        this.props.newMarket.initialLiquidityEth
      ),
      formattedInitialLiquidityGas: formatEtherEstimate(
        formatGasCostToEther(
          this.props.newMarket.initialLiquidityGas,
          { decimalsRounded: 4 },
          gasPrice
        )
      )
    };

    this.calculateMarketCreationCosts = this.calculateMarketCreationCosts.bind(
      this
    );
    this.getFundsString = this.getFundsString.bind(this);
    this.updateFunds = this.updateFunds.bind(this);
  }

  componentWillMount() {
    this.calculateMarketCreationCosts();
  }

  componentWillReceiveProps(nextProps) {
    const { newMarket } = this.props;
    if (
      newMarket.initialLiquidityEth !== nextProps.newMarket.initialLiquidityEth
    )
      this.setState({
        formattedInitialLiquidityEth: formatEtherEstimate(
          nextProps.newMarket.initialLiquidityEth
        )
      });
    if (
      newMarket.initialLiquidityGas !== nextProps.newMarket.initialLiquidityGas
    )
      this.setState({
        formattedInitialLiquidityGas: formatEtherEstimate(
          formatGasCostToEther(
            nextProps.newMarket.initialLiquidityGas,
            { decimalsRounded: 4 },
            this.state.gasPrice
          )
        )
      });
  }

  getFundsString() {
    const { availableEth, availableRep } = this.props;
    const s = this.state;
    let insufficientFundsString = "";

    if (s.validityBond) {
      const validityBond = getValue(s, "validityBond.formattedValue");
      const gasCost = getValue(s, "gasCost.formattedValue");
      const designatedReportNoShowReputationBond = getValue(
        s,
        "designatedReportNoShowReputationBond.formattedValue"
      );
      insufficientFundsString = insufficientFunds(
        validityBond,
        gasCost,
        designatedReportNoShowReputationBond,
        createBigNumber(availableEth, 10),
        createBigNumber(availableRep, 10)
      );
    }

    return insufficientFundsString;
  }

  updateFunds(insufficientFundsString) {
    const { updateStateValue } = this.props;
    updateStateValue("insufficientFunds", insufficientFundsString !== "");
    this.setState({ insufficientFundsString });
  }

  calculateMarketCreationCosts() {
    const { meta, universe, newMarket } = this.props;
    this.props.estimateSubmitNewMarket(newMarket, (err, gasEstimateValue) => {
      if (err) console.error(err);
      augur.createMarket.getMarketCreationCostBreakdown(
        { universe: universe.id, meta },
        (err, marketCreationCostBreakdown) => {
          if (err) return console.error(err);
          // TODO add designatedReportNoShowReputationBond to state / display
          const gasPrice = augur.rpc.getGasPrice();
          this.setState(
            {
              gasPrice,
              gasCost: formatEtherEstimate(
                formatGasCostToEther(
                  gasEstimateValue || "0",
                  { decimalsRounded: 4 },
                  gasPrice
                )
              ),
              designatedReportNoShowReputationBond: formatEtherEstimate(
                marketCreationCostBreakdown.designatedReportNoShowReputationBond
              ),
              validityBond: formatEtherEstimate(
                marketCreationCostBreakdown.validityBond
              )
            },
            this.updateFunds(this.getFundsString())
          );
        }
      );
    });
  }

  render() {
    const { newMarket } = this.props;
    const s = this.state;

    if (s.validityBond) {
      const insufficientFundsString = this.getFundsString();
      if (s.insufficientFundsString !== insufficientFundsString) {
        this.updateFunds(insufficientFundsString);
      }
    }
    if (this.additionalDetails && this.additionalDetails.scrollHeight) {
      this.additionalDetails.style.height = `${
        this.additionalDetails.scrollHeight
      }px`;
    }
    return (
      <article className={StylesForm.CreateMarketForm__fields}>
        <div className={Styles.CreateMarketReview}>
          <h2 className={Styles.CreateMarketReview__heading}>Confirm Market</h2>
          <div className={Styles.CreateMarketReview__wrapper}>
            <div className={Styles.CreateMarketReview__creation}>
              <h3 className={Styles.CreateMarketReview__subheading}>
                Market Creation
              </h3>
              <ul className={Styles.CreateMarketReview__list}>
                <li>
                  <span>Validity Bond</span>
                  <span>{s.validityBond && s.validityBond.rounded} ETH</span>
                </li>
                <li>
                  <span>No-Show Bond</span>
                  <span>
                    {s.designatedReportNoShowReputationBond &&
                      s.designatedReportNoShowReputationBond.rounded}{" "}
                    REP
                  </span>
                </li>
                <li>
                  <span>Est. Gas</span>
                  <span>{s.gasCost && s.gasCost.rounded} ETH</span>
                </li>
              </ul>
            </div>
            <div className={Styles.CreateMarketReview__liquidity}>
              <h3 className={Styles.CreateMarketReview__subheading}>
                Market Liquidity
              </h3>
              <ul className={Styles.CreateMarketReview__list}>
                <li>
                  <span>Ether</span>
                  <span>{s.formattedInitialLiquidityEth.rounded} ETH</span>
                </li>
                <li>
                  <span>Est. Gas</span>
                  <span>{s.formattedInitialLiquidityGas.rounded} ETH</span>
                </li>
              </ul>
            </div>
          </div>
          {s.insufficientFundsString !== "" && (
            <span
              className={
                StylesForm["CreateMarketForm__error--insufficient-funds"]
              }
            >
              {InputErrorIcon}
              You have insufficient {s.insufficientFundsString} to create this
              market.
            </span>
          )}
          <div className={Styles.CreateMarketReview__resolution}>
            <h4 className={Styles.CreateMarketReview__smallheading}>
              Resolution Source
            </h4>
            <p className={Styles.CreateMarketReview__smallparagraph}>
              {newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC
                ? "General knowledge"
                : `Outcome will be detailed on public website: ${
                    newMarket.expirySource
                  }`}
            </p>
          </div>
          <div className={Styles.CreateMarketReview_spacer} />
          <div className={Styles.CreateMarketReview__designated_report}>
            <h4 className={Styles.CreateMarketReview__smallheading}>
              Designated Reporter
            </h4>
            <p className={Styles.CreateMarketReview__smallparagraph}>
              {newMarket.designatedReporterType === DESIGNATED_REPORTER_SELF
                ? "Myself"
                : `Someone Else: ${newMarket.designatedReporterAddress}`}
            </p>
          </div>
          <div className={Styles.CreateMarketReview__addedDetails}>
            <h4 className={Styles.CreateMarketReview__smallheading}>
              Additional Details
            </h4>
            <textarea
              ref={additionalDetails => {
                this.additionalDetails = additionalDetails;
              }}
              className={Styles["CreateMarketReview__AdditionalDetails-text"]}
              disabled
              readOnly
              value={newMarket.detailsText || "None"}
            />
          </div>
        </div>
      </article>
    );
  }
}
