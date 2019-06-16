import React from "react";

import MarketLink from "modules/market/components/market-link/market-link";
import CommonStyles from "modules/market/components/common/market-common.styles.less";
import MarketProperties from "modules/market/containers/market-properties";
import ForkMigrationTotals from "modules/forking/containers/fork-migration-totals";
import MarketReportingPayouts from "modules/reporting/containers/reporting-payouts";
import Styles from "modules/reporting/components/dispute-market-card/dispute-market-card.style.less";

import { MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import toggleTag from "modules/routes/helpers/toggle-tag";
import toggleCategory from "modules/routes/helpers/toggle-category";
import classNames from "classnames";

import { CategoryTagTrail } from "modules/common/labels";
import { MarketData } from "modules/types";

interface DisputeMarketCardProps {
  location: Location;
  history: History;
  market: MarketData;
  isForkingMarket?: boolean;
  isMobile: boolean;
}

const DisputeMarketCard = ({
  history,
  isForkingMarket = false,
  location,
  market,
  ...p
}) => {
  const outcomes = p.outcomes[market.id] || [];
  let potentialFork = false;
  outcomes.forEach((outcome, index) => {
    if (outcome.potentialFork) {
      potentialFork = true;
    }
  });
  if (isForkingMarket) potentialFork = false;
  const showForkTop = potentialFork || isForkingMarket;

  const process = (...arr) =>
    arr.filter(Boolean).map(label => ({
      label,
      onClick: toggleCategory(label, { pathname: makePath(MARKETS) }, history)
    }));

  const categoriesWithClick = process(market.category);
  const tagsWithClick = market.tags.filter(Boolean).map(tag => ({
    label: tag,
    onClick: toggleTag(tag, { pathname: makePath(MARKETS) }, history)
  }));

  return (
    <article
      className={classNames(
        CommonStyles.MarketCommon__container,
        showForkTop ? Styles["DisputeMarket__fork-top"] : ""
      )}
    >
      <div className={CommonStyles.MarketCommon__topcontent}>
        <div className={CommonStyles.MarketCommon__header}>
          <CategoryTagTrail
            categories={categoriesWithClick}
            // @ts-ignore
            tags={tagsWithClick}
          />
          <div className={Styles["DisputeMarket__round-number"]}>
            {potentialFork && (
              <span className={Styles["DisputeMarket__fork-label"]}>
                Potential Fork
              </span>
            )}
            {isForkingMarket && (
              <span className={Styles["DisputeMarket__fork-label"]}>
                Forking
              </span>
            )}
            {!isForkingMarket && (
              <span>
                <span className={Styles["DisptueMarket__round-label"]}>
                  Dispute Round
                </span>
                <span
                  data-testid={"roundNumber-" + market.id}
                  className={Styles["DisptueMarket__round-text"]}
                >
                  {market &&
                    market.disputeInfo &&
                    market.disputeInfo.disputeRound}
                </span>
              </span>
            )}
          </div>
        </div>
        <h1 className={CommonStyles.MarketCommon__description}>
          <MarketLink id={market.id}>{market.description}</MarketLink>
        </h1>
        {isForkingMarket && <ForkMigrationTotals />}
        {!isForkingMarket && (
          <MarketReportingPayouts
            outcomes={outcomes}
            forkThreshold={p.forkThreshold}
            marketId={market.id}
          />
        )}
      </div>
      <div className={CommonStyles.MarketCommon__footer}>
        <MarketProperties {...market} {...p} />
      </div>
    </article>
  );
};

export default DisputeMarketCard;
