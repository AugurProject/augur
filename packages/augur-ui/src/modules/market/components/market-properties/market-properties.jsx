import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketLink from "modules/market/components/market-link/market-link";
import ValueDenomination from "modules/common/components/value-denomination/value-denomination";

import {
  TYPE_FINALIZE_MARKET,
  TYPE_DISPUTE,
  TYPE_VIEW,
  TYPE_CLAIM_PROCEEDS,
  TYPE_TRADE
} from "modules/markets/constants/link-types";
import { SCALAR } from "modules/markets/constants/market-types";

import getValue from "utils/get-value";
import { dateHasPassed } from "utils/format-date";
import Styles from "modules/market/components/market-properties/market-properties.styles";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import { MODAL_MIGRATE_MARKET } from "modules/modal/constants/modal-types";
import { constants } from "services/augurjs";

const {
  DESIGNATED_REPORTING,
  OPEN_REPORTING,
  CROWDSOURCING_DISPUTE,
  AWAITING_NEXT_WINDOW
} = constants.REPORTING_STATE;
const ShowResolutionStates = [
  DESIGNATED_REPORTING,
  OPEN_REPORTING,
  CROWDSOURCING_DISPUTE,
  AWAITING_NEXT_WINDOW
];

const MarketProperties = p => {
  const openInterest = getValue(p, "openInterest");
  const shareVolume = getValue(p, "volume");
  const isScalar = p.marketType === SCALAR;
  let consensus = getValue(
    p,
    isScalar ? "consensus.winningOutcome" : "consensus.outcomeName"
  );
  const linkType =
    p.isForking && p.linkType === TYPE_DISPUTE ? TYPE_VIEW : p.linkType;
  const disableDispute =
    p.loginAccount.rep === "0" && p.linkType === TYPE_DISPUTE;
  if (getValue(p, "consensus.isInvalid")) {
    consensus = "Invalid";
  }
  const showResolution = ShowResolutionStates.indexOf(p.reportingState) !== -1;

  return (
    <article>
      <section className={Styles.MarketProperties}>
        <ul className={Styles.MarketProperties__meta}>
          <li>
            <span>Volume</span>
            <ValueDenomination
              valueClassname="volume"
              formatted={shareVolume.full}
            />
          </li>
          <li>
            <span>Open Interest</span>
            <ValueDenomination
              valueClassname="volume"
              formatted={openInterest}
              denomination="ETH"
            />
          </li>
          <li>
            <span>Fee</span>
            <ValueDenomination
              valueClassname="fee"
              {...p.settlementFeePercent}
            />
          </li>
          <li>
            <span>
              {p.endTime &&
              dateHasPassed(p.currentTimestamp, p.endTime.timestamp)
                ? "Expired"
                : "Expires"}
            </span>
            <span className="value_expires">
              {p.isMobile
                ? p.endTime.formattedLocalShort
                : p.endTime.formattedLocalShortTime}
            </span>
          </li>
          {showResolution && (
            <li className={Styles.MarketProperties__resolutionSource}>
              <span>Resolution Source</span>
              <span className={Styles.MarketProperties__resolutionSource}>
                {p.resolutionSource || "General Knowledge"}
              </span>
            </li>
          )}
          {consensus && (
            <li>
              <span>Winning Outcome</span>
              {consensus}
            </li>
          )}
        </ul>
        <div className={Styles.MarketProperties__actions}>
          {p.isLogged &&
            p.toggleFavorite && (
              <button
                className={classNames(Styles.MarketProperties__favorite, {
                  [Styles.favorite]: p.isFavorite
                })}
                onClick={() => p.toggleFavorite(p.id)}
              >
                {p.isFavorite ? (
                  <i className="fa fa-star" />
                ) : (
                  <i className="fa fa-star-o" />
                )}
              </button>
            )}
          {(linkType === undefined ||
            (linkType &&
              linkType !== TYPE_FINALIZE_MARKET &&
              linkType !== TYPE_CLAIM_PROCEEDS)) && (
            <MarketLink
              className={classNames(Styles.MarketProperties__trade, {
                [Styles.disabled]: disableDispute
              })}
              id={p.id}
              linkType={linkType}
            >
              {linkType || "view"}
            </MarketLink>
          )}
          {linkType &&
            linkType === TYPE_FINALIZE_MARKET &&
            !p.finalizationTime && (
              <button
                className={Styles.MarketProperties__trade}
                onClick={e => p.finalizeMarket(p.id)}
              >
                Finalize
              </button>
            )}
          {linkType &&
            linkType !== TYPE_VIEW &&
            linkType !== TYPE_TRADE &&
            p.finalizationTime && (
              <MarketLink
                className={classNames(Styles.MarketProperties__trade, {
                  [Styles.disabled]: disableDispute
                })}
                id={p.id}
                linkType={TYPE_VIEW}
              >
                {TYPE_VIEW}
              </MarketLink>
            )}
          {p.isForking &&
            p.isForkingMarketFinalized &&
            p.forkingMarket !== p.id &&
            !p.finalizationTime && (
              <button
                className={Styles.MarketProperties__migrate}
                onClick={() =>
                  p.updateModal({
                    type: MODAL_MIGRATE_MARKET,
                    marketId: p.id,
                    marketDescription: p.description
                  })
                }
              >
                Migrate
              </button>
            )}
        </div>
      </section>
      {p.showAdditionalDetailsToggle && (
        <button
          className={Styles[`MarketProperties__additional-details`]}
          onClick={() => p.toggleDetails()}
        >
          Additional Details
          <span
            className={Styles["MarketProperties__additional-details-chevron"]}
          >
            <ChevronFlip pointDown={p.showingDetails} />
          </span>
        </button>
      )}
    </article>
  );
};

MarketProperties.propTypes = {
  currentTimestamp: PropTypes.number.isRequired,
  updateModal: PropTypes.func.isRequired,
  linkType: PropTypes.string,
  finalizationTime: PropTypes.number,
  buttonText: PropTypes.string,
  showAdditionalDetailsToggle: PropTypes.bool,
  showingDetails: PropTypes.bool,
  toggleDetails: PropTypes.func,
  isForking: PropTypes.bool,
  isForkingMarketFinalized: PropTypes.bool,
  forkingMarket: PropTypes.string
};

export default MarketProperties;
