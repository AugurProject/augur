import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketBasics from "modules/market/containers/market-basics";
import MarketProperties from "modules/market/containers/market-properties";
import OutstandingReturns from "modules/market/components/market-outstanding-returns/market-outstanding-returns";
import MarketLiquidity from "modules/market/containers/market-liquidity";
import toggleHeight from "utils/toggle-height/toggle-height";

import CommonStyles from "modules/market/components/common/market-common.styles";
import Styles from "modules/market/components/market-preview/market-preview.styles";
import MarketAdditonalDetails from "modules/market/components/market-additional-details/market-additional-details";
import { isEmpty } from "lodash";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

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
    isPendingReport: PropTypes.bool,
    endTime: PropTypes.object.isRequired,
    settlementFeePercent: PropTypes.object,
    volume: PropTypes.object,
    tags: PropTypes.array,
    cardStyle: PropTypes.string,
    hideReportEndingIndicator: PropTypes.bool,
    linkType: PropTypes.string,
    collectMarketCreatorFees: PropTypes.func.isRequired,
    hideOutstandingReturns: PropTypes.bool
  };

  static defaultProps = {
    isOpen: false,
    isFavorite: false,
    isPendingReport: false,
    hideReportEndingIndicator: false,
    tags: [],
    volume: null,
    cardStyle: null,
    linkType: null,
    className: null,
    testid: null,
    outcomes: [],
    settlementFeePercent: null,
    hideOutstandingReturns: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showingDetails: true
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    toggleHeight(this.additionalDetails, this.state.showingDetails, () => {
      this.setState({ showingDetails: !this.state.showingDetails });
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <div>
        <article
          className={classNames(CommonStyles.MarketCommon__container, {
            [`${CommonStyles["single-card"]}`]: p.cardStyle === "single-card"
          })}
          id={"id-" + p.id}
          data-testid={p.testid + "-" + p.id}
        >
          <MarketBasics {...p} />
          <div
            className={classNames(Styles.MarketPreview__footer, {
              [`${Styles["single-card"]}`]: p.cardStyle === "single-card"
            })}
          >
            <MarketProperties
              {...p}
              showingDetails={s.showingDetails}
              toggleDetails={this.toggleDetails}
            />
          </div>
          {p.unclaimedCreatorFees.value > 0 &&
            !p.hideOutstandingReturns && (
              <div
                className={classNames(Styles.MarketPreview__returns, {
                  [`${Styles["single-card"]}`]: p.cardStyle === "single-card"
                })}
              >
                <OutstandingReturns
                  id={p.id}
                  unclaimedCreatorFees={p.unclaimedCreatorFees}
                  collectMarketCreatorFees={p.collectMarketCreatorFees}
                />
              </div>
            )}
          <MarketLiquidity
            marketId={p.id}
            market={p}
            pendingLiquidityOrders={p.pendingLiquidityOrders}
          />
        </article>
        {!isEmpty(p) &&
          p.showAdditionalDetailsToggle && (
            <div
              ref={additionalDetails => {
                this.additionalDetails = additionalDetails;
              }}
              className={classNames(
                ToggleHeightStyles["toggle-height-target"],
                ToggleHeightStyles["start-open"]
              )}
            >
              <MarketAdditonalDetails {...p} />
            </div>
          )}
      </div>
    );
  }
}
