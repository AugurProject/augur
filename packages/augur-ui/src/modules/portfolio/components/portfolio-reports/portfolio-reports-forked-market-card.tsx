import React from "react";
import classNames from "classnames";
import { compact } from "lodash";
import PropTypes from "prop-types";

import MarketLink from "modules/market/components/market-link/market-link";
import CommonStyles from "modules/market/components/common/market-common.styles";
import DisputeMarketCardStyles from "modules/reporting/components/dispute-market-card/dispute-market-card.style";
import Styles from "modules/portfolio/components/market-portfolio-card/market-portfolio-card.styles";
import MarketPortfolioCardFooter from "modules/portfolio/components/market-portfolio-card/market-portfolio-card-footer";
import MarketProperties from "modules/market/containers/market-properties";
import ForkMigrationTotals from "modules/forking/containers/fork-migration-totals";
import { CategoryTagTrail } from "modules/common/components/category-tag-trail/category-tag-trail";
import { MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import toggleTag from "modules/routes/helpers/toggle-tag";
import toggleCategory from "modules/routes/helpers/toggle-category";

const PortfolioReportsForkedMarketCard = ({
  buttonAction,
  currentTimestamp,
  linkType,
  market,
  unclaimedForkEth,
  unclaimedForkRepStaked
}) => {
  const process = (...arr) =>
    compact(arr).map(label => ({
      label,
      onClick: toggleCategory(label, { pathname: makePath(MARKETS) }, history)
    }));
  const categoriesWithClick = process(market.category);
  const tagsWithClick = compact(market.tags).map(tag => ({
    label: tag,
    onClick: toggleTag(tag, { pathname: makePath(MARKETS) }, history)
  }));

  const localButtonText = "Claim Proceeds";

  return (
    <article
      className={classNames(
        CommonStyles.MarketCommon__container,
        DisputeMarketCardStyles["DisputeMarket__fork-top"]
      )}
    >
      <section
        className={classNames(
          CommonStyles.MarketCommon__topcontent,
          DisputeMarketCardStyles.MarketCard__topcontent
        )}
      >
        <div className={CommonStyles.MarketCommon__header}>
          <CategoryTagTrail
            categories={categoriesWithClick}
            tags={tagsWithClick}
          />
          <div
            className={DisputeMarketCardStyles["DisputeMarket__round-number"]}
          >
            <span
              className={DisputeMarketCardStyles["DisputeMarket__fork-label"]}
            >
              Forking
            </span>
          </div>
        </div>

        <h1 className={CommonStyles.MarketCommon__description}>
          <MarketLink id={market.id}>{market.description}</MarketLink>
        </h1>

        <ForkMigrationTotals />
      </section>
      <section className={Styles.MarketCommon__footer}>
        <MarketProperties linkType={linkType} {...market} />
      </section>
      <MarketPortfolioCardFooter
        linkType={linkType}
        localButtonText={localButtonText}
        buttonAction={buttonAction}
        outstandingReturns={market.outstandingReturns}
        finalizationTime={market.finalizationTime}
        currentTimestamp={currentTimestamp}
        unclaimedForkEth={unclaimedForkEth}
        unclaimedForkRepStaked={unclaimedForkRepStaked}
        marketId={market.id}
      />
    </article>
  );
};

PortfolioReportsForkedMarketCard.propTypes = {
  buttonAction: PropTypes.func.isRequired,
  currentTimestamp: PropTypes.number.isRequired,
  linkType: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired,
  unclaimedForkEth: PropTypes.object.isRequired,
  unclaimedForkRepStaked: PropTypes.object.isRequired
};

export default PortfolioReportsForkedMarketCard;
