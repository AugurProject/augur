import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import SingleSlicePieGraph from "src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph";
import { convertUnixToFormattedDate } from "utils/format-date";
import TimeRemainingIndicatorWrapper from "src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator";
import { createBigNumber } from "utils/create-big-number";
import moment from "moment";
import { TYPE_CLAIM_PROCEEDS } from "modules/markets/constants/link-types";
import Styles from "modules/portfolio/components/market-portfolio-card/market-portfolio-card.styles";
import { constants } from "services/constants";
import { formatEther } from "utils/format-number";

const MarketPortfolioCardFooter = ({
  currentTimestamp,
  finalizationTime,
  linkType,
  unclaimedForkEth,
  unclaimedForkRepStaked,
  outstandingReturns,
  marketId,
  buttonAction,
  localButtonText,
  claimClicked,
  disabled
}) => {
  const userHasClaimableForkFees =
    (unclaimedForkEth && unclaimedForkEth.value > 0) ||
    (unclaimedForkRepStaked && unclaimedForkRepStaked.value > 0);

  return (
    <div>
      <section
        className={classNames(
          Styles["MarketCard__tablesection-footer"],
          Styles["MarketCard__tablesection-footer-light"]
        )}
      >
        <div
          className={classNames(
            Styles["MarketCard__headingcontainer-footer"],
            Styles["MarketCard__headingcontainer-footer-light"]
          )}
        >
          {linkType === TYPE_CLAIM_PROCEEDS &&
            userHasClaimableForkFees && (
              <span className={Styles["MarketCard__light-text"]}>
                Outstanding Returns
                <span className={Styles["MarketCard__heavy-text"]}>
                  {unclaimedForkEth.formattedValue} ETH
                </span>
                |
                <span className={Styles["MarketCard__heavy-text"]}>
                  {unclaimedForkRepStaked.formattedValue} REP
                </span>
              </span>
            )}
          {linkType === TYPE_CLAIM_PROCEEDS &&
            !userHasClaimableForkFees && (
              <span className={Styles["MarketCard__light-text"]}>
                Outstanding Returns
                <span className={Styles["MarketCard__heavy-text"]}>
                  {formatEther(outstandingReturns).formattedValue} ETH
                </span>
              </span>
            )}
          <div className={Styles["MarketCard__action-container"]}>
            <button
              data-testid={"claimButton-" + marketId}
              className={classNames(Styles["MarketCard__action-footer-light"])}
              onClick={buttonAction}
              disabled={
                (linkType === TYPE_CLAIM_PROCEEDS &&
                  !userHasClaimableForkFees) ||
                claimClicked ||
                disabled
              }
            >
              {localButtonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

MarketPortfolioCardFooter.propTypes = {
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func.isRequired,
  outstandingReturns: PropTypes.string.isRequired,
  finalizationTime: PropTypes.number,
  currentTimestamp: PropTypes.number.isRequired,
  unclaimedForkEth: PropTypes.object,
  marketId: PropTypes.string.isRequired,
  unclaimedForkRepStaked: PropTypes.object,
  claimClicked: PropTypes.bool,
  disabled: PropTypes.bool
};

MarketPortfolioCardFooter.defaultProps = {
  unclaimedForkEth: null,
  unclaimedForkRepStaked: null,
  finalizationTime: null,
  claimClicked: false,
  disabled: false
};

export default MarketPortfolioCardFooter;
