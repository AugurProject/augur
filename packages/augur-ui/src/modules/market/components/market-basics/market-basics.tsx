/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as order remains the same

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketOutcomesBinaryScalar from "modules/market/components/market-outcomes-yes-no-scalar/market-outcomes-yes-no-scalar";
import MarketOutcomesCategorical from "modules/market/components/market-outcomes-categorical/market-outcomes-categorical";
import MarketLink from "modules/market/components/market-link/market-link";

import toggleTag from "modules/routes/helpers/toggle-tag";
import toggleCategory from "modules/routes/helpers/toggle-category";
import getValue from "utils/get-value";
import { YES_NO, SCALAR, CATEGORICAL } from "modules/common/constants";

import CommonStyles from "modules/market/components/common/market-common.styles.less";
import Styles from "modules/market/components/market-basics/market-basics.styles.less";
import SingleSlicePieGraph from "modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph";
import TimeRemainingIndicatorWrapper from "modules/market/components/common/time-remaining-indicator/time-remaining-indicator";
import { REPORTING_STATE, CONTRACT_INTERVAL } from "modules/common/constants";
import moment from "moment";
import { CategoryTagTrail } from "modules/common/labels";
import { MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";

const MarketBasics = ({
  category,
  tags = [],
  location,
  history,
  marketType,
  ...p
}) => {
  let ReportEndingIndicator: any = () => null;
  if (
    p.reportingState === REPORTING_STATE.DESIGNATED_REPORTING &&
    !p.hideReportEndingIndicator
  ) {
    const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph);
    const endTime = moment(p.endTimeFormatted.value)
      .add(
        CONTRACT_INTERVAL.DESIGNATED_REPORTING_DURATION_SECONDS,
        "seconds"
      )
      .toDate();
    const displayDate = p.endTimeFormatted;

    ReportEndingIndicator = () => (
      <div className={Styles.ReportingEnds}>
        <div>
          {p.isMobile
            ? `In Reporting`
            : `Reporting Ends ${displayDate.formattedLocalShortTime}`}
        </div>
        <WrappedGraph
          startDate={p.endTimeFormatted.value}
          endTime={endTime}
          currentTimestamp={p.currentTimestamp}
          backgroundColor="transparent"
        />
      </div>
    );
  }

  const path =
    location.pathname === makePath(MARKETS)
      ? location
      : { pathname: makePath(MARKETS) };

  const process = (...arr) =>
    arr.filter(Boolean).map(label => ({
      label,
      onClick: toggleCategory(label, path, history)
    }));

  const categoriesWithClick = process(category);
  const tagsWithClick = tags.filter(Boolean).map(tag => ({
    label: tag,
    onClick: toggleTag(tag, path, history)
  }));

  return (
    <div
      className={classNames(CommonStyles.MarketCommon__topcontent, {
        [`${CommonStyles["single-card"]}`]: p.cardStyle === "single-card"
      })}
    >
      <div className={Styles.Header}>
        <CategoryTagTrail
          categories={categoriesWithClick}
          tags={tagsWithClick}
        />
        {p.showDisputeRound && (
          <div className={Styles.RoundNumber}>
            <span>Dispute Round</span>
            <span>{getValue(p, "disputeInfo.disputeRound")}</span>
          </div>
        )}
        <ReportEndingIndicator />
      </div>
      <h1 className={CommonStyles.MarketCommon__description}>
        <MarketLink id={p.id} className="market-link">
          {p.description}
        </MarketLink>
      </h1>

      {(marketType === YES_NO || marketType === SCALAR) && (
        <MarketOutcomesBinaryScalar
          outcomes={p.outcomesFormatted}
          min={p.minPriceBigNumber}
          max={p.maxPriceBigNumber}
          type={marketType}
          scalarDenomination={p.isMobile ? "" : p.scalarDenomination || "N/A"}
        />
      )}

      {marketType === CATEGORICAL && (
        <MarketOutcomesCategorical
          outcomesFormatted={p.outcomesFormatted}
          isMobileSmall={p.isMobileSmall}
        />
      )}
    </div>
  );
};

MarketBasics.propTypes = {
  category: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  currentTimestamp: PropTypes.number.isRequired,
  marketType: PropTypes.string,
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  minPriceBigNumber: PropTypes.object,
  maxPriceBigNumber: PropTypes.object,
  reportingState: PropTypes.string,
  scalarDenomination: PropTypes.string,
  endTimeFormatted: PropTypes.object.isRequired,
  outcomes: PropTypes.array.isRequired,
  disputeInfo: PropTypes.object,
  cardStyle: PropTypes.string,
  hideReportEndingIndicator: PropTypes.bool,
  showDisputeRound: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
  isMobileSmall: PropTypes.bool
};

MarketBasics.defaultProps = {
  hideReportEndingIndicator: false,
  showDisputeRound: false,
  tags: [],
  disputeInfo: null,
  cardStyle: null,
  reportingState: null,
  scalarDenomination: null,
  isMobileSmall: false,
  minPrice: null,
  maxPrice: null,
  marketType: null,
  category: null
};

export default MarketBasics;
