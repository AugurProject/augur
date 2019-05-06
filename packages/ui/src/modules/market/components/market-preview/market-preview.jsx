import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketBasics from "modules/market/containers/market-basics";
import MarketProperties from "modules/market/containers/market-properties";
import OutstandingReturns from "modules/market/components/market-outstanding-returns/market-outstanding-returns";
import MarketLiquidity from "modules/market/containers/market-liquidity";

import CommonStyles from "modules/market/components/common/market-common.styles";
import Styles from "modules/market/components/market-preview/market-preview.styles";
import MarketAdditonalDetails from "modules/market/components/market-additional-details/market-additional-details";
import { isEmpty } from "lodash";
import ToggleHeightStyles from "utils/toggle-height.styles";

export default class MarketPreview extends Component {
  static propTypes = {
    testid: PropTypes.string,
    id: PropTypes.string.isRequired,
    isLogged: PropTypes.bool.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    className: PropTypes.string,
    description: PropTypes.string.isRequired,
    outcomes: PropTypes.array,
    isOpen: PropTypes.bool,
    isFavorite: PropTypes.bool,
    endTime: PropTypes.object.isRequired,
    settlementFeePercent: PropTypes.object,
    volume: PropTypes.object,
    tags: PropTypes.array,
    cardStyle: PropTypes.string,
    hideReportEndingIndicator: PropTypes.bool,
    linkType: PropTypes.string,
    collectMarketCreatorFees: PropTypes.func.isRequired,
    showOutstandingReturns: PropTypes.bool,
    unclaimedCreatorFees: PropTypes.object,
    pendingLiquidityOrders: PropTypes.object,
    showAdditionalDetailsToggle: PropTypes.bool
  };

  static defaultProps = {
    isOpen: false,
    isFavorite: false,
    hideReportEndingIndicator: false,
    tags: [],
    volume: null,
    cardStyle: null,
    linkType: null,
    className: null,
    testid: null,
    outcomes: [],
    settlementFeePercent: null,
    showOutstandingReturns: false,
    unclaimedCreatorFees: { value: 0 },
    pendingLiquidityOrders: {},
    showAdditionalDetailsToggle: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showingDetails: true
    };
  }

  render() {
    const {
      testid,
      showOutstandingReturns,
      cardStyle,
      unclaimedCreatorFees,
      collectMarketCreatorFees,
      id,
      pendingLiquidityOrders,
      showAdditionalDetailsToggle
    } = this.props;
    const { showingDetails } = this.state;

    return (
      <div>
        <article
          className={classNames(CommonStyles.MarketCommon__container, {
            [`${CommonStyles["single-card"]}`]: cardStyle === "single-card"
          })}
          id={"id-" + id}
          data-testid={testid + "-" + id}
        >
          <MarketBasics {...this.props} />
          <div
            className={classNames(Styles.footer, {
              [`${Styles["single-card"]}`]: cardStyle === "single-card"
            })}
          >
            <MarketProperties
              {...this.props}
              showingDetails={showingDetails}
              toggleDetails={() =>
                this.setState({ showingDetails: !showingDetails })
              }
            />
          </div>
          {unclaimedCreatorFees.value > 0 &&
            showOutstandingReturns && (
              <div
                className={classNames(Styles.returns, {
                  [`${Styles["single-card"]}`]: cardStyle === "single-card"
                })}
              >
                <OutstandingReturns
                  id={id}
                  unclaimedCreatorFees={unclaimedCreatorFees}
                  collectMarketCreatorFees={collectMarketCreatorFees}
                />
              </div>
            )}
          <MarketLiquidity
            marketId={id}
            market={this.props}
            pendingLiquidityOrders={pendingLiquidityOrders}
          />
        </article>
        {!isEmpty(this.props) &&
          showAdditionalDetailsToggle && (
            <div
              ref={additionalDetails => {
                this.additionalDetails = additionalDetails;
              }}
              className={classNames(ToggleHeightStyles.target, {
                [ToggleHeightStyles.open]: showingDetails
              })}
            >
              <MarketAdditonalDetails {...this.props} />
            </div>
          )}
      </div>
    );
  }
}
