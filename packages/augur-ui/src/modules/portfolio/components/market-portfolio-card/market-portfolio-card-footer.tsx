import React from "react";
import classNames from "classnames";

import SingleSlicePieGraph from "modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph";
import { convertUnixToFormattedDate } from "utils/format-date";
import TimeRemainingIndicatorWrapper from "modules/market/components/common/time-remaining-indicator/time-remaining-indicator";
import { createBigNumber } from "utils/create-big-number";
import moment from "moment";
import { CONTRACT_INTERVAL, TYPE_CLAIM_PROCEEDS } from "modules/common/constants";
import Styles from "modules/portfolio/components/market-portfolio-card/market-portfolio-card.styles.less";
import { formatEther } from "utils/format-number";
import { FormattedNumber } from "modules/types";

interface MarketPortfolioCardFooterProps {
  linkType: string;
  localButtonText: string;
  buttonAction: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
  outstandingReturns: string;
  finalizationTime: number;
  currentTimestamp: number;
  unclaimedForkEth: FormattedNumber;
  marketId: string;
  unclaimedForkRepStaked: FormattedNumber;
  claimClicked: boolean;
  disabled: boolean;
}

const MarketPortfolioCardFooter = ({
  currentTimestamp,
  finalizationTime,
  linkType,
  unclaimedForkEth,
  unclaimedForkRepStaked,
  outstandingReturns = "0",
  marketId,
  buttonAction,
  localButtonText,
  claimClicked = false,
  disabled = false,
}: MarketPortfolioCardFooterProps) => {
  const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph);
  let canClaim = false;
  let startTime: Date | null = null;
  let finalTime: Date | null = null;
  let endTimestamp: BigNumber| null = null;
  if (finalizationTime) {
    startTime = new Date(finalizationTime * 1000);
    finalTime = moment(startTime)
      .add(CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME, "seconds")
      .toDate();
    endTimestamp = createBigNumber(finalizationTime).plus(
      createBigNumber(CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME),
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
            Styles["MarketCard__headingcontainer-footer-light"],
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
                    { endTimestamp &&
                      convertUnixToFormattedDate(endTimestamp.toNumber())
                        .formatted
                    }
                  </span>
                  <span className={Styles["MarketCard__proceeds-clock"]}>
                    { startTime && finalTime &&
                      <WrappedGraph
                        startDate={startTime}
                        endTime={finalTime}
                        currentTimestamp={currentTimestamp * 1000}
                      /> }
                  </span>
                </div>
              )}
            <button
              data-testid={"claimButton-" + marketId}
              className={classNames(Styles["MarketCard__action-footer-light"], {
                [Styles.MarketCard__claim]: linkType === TYPE_CLAIM_PROCEEDS,
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

export default MarketPortfolioCardFooter;
