import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import SingleSlicePieGraph from "src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph";
import { convertUnixToFormattedDate } from "utils/format-date";
import TimeRemainingIndicatorWrapper from "src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator";
import { createBigNumber } from "utils/create-big-number";
import moment from "moment";
import { TYPE_CLAIM_PROCEEDS } from "modules/common-elements/constants";
import Styles from "modules/portfolio/components/market-portfolio-card/market-portfolio-card.styles";
import { constants } from "services/augurjs";
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
  const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph);
  let canClaim = false;
  let startTime = null;
  let finalTime = null;
  let endTimestamp = null;
  if (finalizationTime) {
    startTime = new Date(finalizationTime * 1000);
    finalTime = moment(startTime)
      .add(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME, "seconds")
      .toDate();
    endTimestamp = createBigNumber(finalizationTime).plus(
      createBigNumber(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME)
    );
    const timeHasPassed = createBigNumber(currentTimestamp).minus(endTimestamp);
    canClaim = linkType === TYPE_CLAIM_PROCEEDS && timeHasPassed.toNumber() > 0;
  }
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
            {linkType === TYPE_CLAIM_PROCEEDS &&
              finalizationTime &&
              !canClaim && (
                <div className={Styles["MarketCard__proceeds-container"]}>
                  <span className={Styles["MarketCard__proceeds-text"]}>
                    Proceeds Available
                  </span>
                  <span className={Styles["MarketCard__proceeds-text-small"]}>
                    {
                      convertUnixToFormattedDate(endTimestamp.toNumber())
                        .formattedLocal
                    }
                  </span>
                  <span className={Styles["MarketCard__proceeds-clock"]}>
                    <WrappedGraph
                      startDate={startTime}
                      endTime={finalTime}
                      currentTimestamp={currentTimestamp * 1000}
                      backgroundColor="transparent"
                    />
                  </span>
                </div>
              )}
            <button
              data-testid={"claimButton-" + marketId}
              className={classNames(Styles["MarketCard__action-footer-light"], {
                [Styles.MarketCard__claim]: linkType === TYPE_CLAIM_PROCEEDS
              })}
              onClick={buttonAction}
              disabled={
                (linkType === TYPE_CLAIM_PROCEEDS &&
                  !canClaim &&
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
  outstandingReturns: PropTypes.string,
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
  disabled: false,
  outstandingReturns: "0"
};

export default MarketPortfolioCardFooter;
