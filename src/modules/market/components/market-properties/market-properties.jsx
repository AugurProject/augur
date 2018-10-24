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

const MarketProperties = ({
  marketType,
  openInterest,
  volume,
  isForking,
  loginAccount,
  reportingState,
  settlementFeePercent,
  currentTimestamp,
  endTime,
  resolutionSource,
  id,
  isLogged,
  isMobile,
  toggleFavorite,
  isFavorite,
  finalizeMarket,
  isForkingMarketFinalized,
  forkingMarket,
  updateModal,
  description,
  showAdditionalDetailsToggle,
  showingDetails,
  finalizationTime,
  toggleDetails,
  ...p
}) => {
  const isScalar = marketType === SCALAR;
  let consensus = getValue(
    p,
    isScalar ? "consensus.winningOutcome" : "consensus.outcomeName"
  );
  const linkType =
    isForking && p.linkType === TYPE_DISPUTE ? TYPE_VIEW : p.linkType;
  const disableDispute =
    loginAccount.rep === "0" && p.linkType === TYPE_DISPUTE;
  if (getValue(p, "consensus.isInvalid")) {
    consensus = "Invalid";
  }
  const showResolution = ShowResolutionStates.indexOf(reportingState) !== -1;

  return (
    <article>
      <section className={Styles.MarketProperties}>
        <ul className={Styles.MarketProperties__meta}>
          <li>
            <span>Volume</span>
            <ValueDenomination
              valueClassname="volume"
              formatted={volume.full}
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
            <ValueDenomination valueClassname="fee" {...settlementFeePercent} />
          </li>
          <li>
            <span>
              {endTime && dateHasPassed(currentTimestamp, endTime.timestamp)
                ? "Expired"
                : "Expires"}
            </span>
            <span className="value_expires">
              {isMobile
                ? endTime.formattedLocalShort
                : endTime.formattedLocalShortTime}
            </span>
          </li>
          {showResolution && (
            <li className={Styles.MarketProperties__resolutionSource}>
              <span>Resolution Source</span>
              <span className={Styles.MarketProperties__resolutionSource}>
                {resolutionSource || "General knowledge"}
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
          {isLogged &&
            toggleFavorite && (
              <button
                className={classNames(Styles.MarketProperties__favorite, {
                  [Styles.favorite]: isFavorite
                })}
                onClick={() => toggleFavorite(id)}
              >
                {isFavorite ? (
                  <i className="fa fa-star" />
                ) : (
                  <i className="fa fa-star-o" />
                )}
              </button>
            )}
          {(!linkType ||
            (linkType &&
              linkType !== TYPE_FINALIZE_MARKET &&
              linkType !== TYPE_CLAIM_PROCEEDS)) && (
            <MarketLink
              className={classNames(Styles.MarketProperties__trade, {
                [Styles.disabled]: disableDispute
              })}
              id={id}
              linkType={linkType}
            >
              {linkType || "view"}
            </MarketLink>
          )}
          {linkType &&
            linkType === TYPE_FINALIZE_MARKET &&
            !finalizationTime && (
              <button
                className={Styles.MarketProperties__trade}
                onClick={e => finalizeMarket(id)}
              >
                Finalize
              </button>
            )}
          {linkType &&
            linkType !== TYPE_VIEW &&
            linkType !== TYPE_TRADE &&
            finalizationTime && (
              <MarketLink
                className={classNames(Styles.MarketProperties__trade, {
                  [Styles.disabled]: disableDispute
                })}
                id={id}
                linkType={TYPE_VIEW}
              >
                {TYPE_VIEW}
              </MarketLink>
            )}
          {isForking &&
            isForkingMarketFinalized &&
            forkingMarket !== id &&
            !finalizationTime && (
              <button
                className={Styles.MarketProperties__migrate}
                onClick={() =>
                  updateModal({
                    type: MODAL_MIGRATE_MARKET,
                    marketId: id,
                    marketDescription: description
                  })
                }
              >
                Migrate
              </button>
            )}
        </div>
      </section>
      {showAdditionalDetailsToggle && (
        <button
          className={Styles[`MarketProperties__additional-details`]}
          onClick={() => toggleDetails()}
        >
          Additional Details
          <span
            className={Styles["MarketProperties__additional-details-chevron"]}
          >
            <ChevronFlip pointDown={showingDetails} />
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
  showAdditionalDetailsToggle: PropTypes.bool,
  showingDetails: PropTypes.bool,
  toggleDetails: PropTypes.func,
  isForking: PropTypes.bool,
  isForkingMarketFinalized: PropTypes.bool,
  forkingMarket: PropTypes.string,
  resolutionSource: PropTypes.string,
  marketType: PropTypes.string,
  openInterest: PropTypes.string,
  volume: PropTypes.object,
  loginAccount: PropTypes.object,
  reportingState: PropTypes.string,
  settlementFeePercent: PropTypes.object,
  endTime: PropTypes.object,
  id: PropTypes.string,
  isLogged: PropTypes.bool,
  isMobile: PropTypes.bool,
  toggleFavorite: PropTypes.func,
  isFavorite: PropTypes.bool,
  finalizeMarket: PropTypes.func,
  description: PropTypes.string
};

MarketProperties.defaultProps = {
  linkType: null,
  finalizationTime: null,
  showAdditionalDetailsToggle: false,
  showingDetails: false,
  isForking: false,
  isForkingMarketFinalized: false,
  forkingMarket: null,
  toggleDetails: () => {},
  resolutionSource: "General Knowledge",
  marketType: null,
  openInterest: null,
  volume: null,
  loginAccount: null,
  reportingState: null,
  settlementFeePercent: null,
  endTime: null,
  id: null,
  isLogged: false,
  isMobile: false,
  toggleFavorite: () => {},
  isFavorite: false,
  finalizeMarket: () => {},
  description: null
};

export default MarketProperties;
