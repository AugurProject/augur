import React from "react";
import PropTypes from "prop-types";
import { augur } from "services/augurjs";
import classNames from "classnames";
import { formatAttoRep } from "utils/format-number";
import { convertUnixToFormattedDate, dateHasPassed } from "utils/format-date";
import TimeProgressBar from "modules/reporting/components/time-progress-bar/time-progress-bar";
import { TYPE_MIGRATE_REP } from "modules/markets/constants/link-types";
import MarketLink from "modules/market/components/market-link/market-link";
import { createBigNumber } from "utils/create-big-number";
import Styles from "modules/forking/components/forking-content/forking-content.styles";

const ForkingContent = ({
  forkingMarket,
  forkEndTime,
  currentTime,
  expanded,
  doesUserHaveRep,
  forkReputationGoal,
  isForkingMarketFinalized,
  finalizeMarket,
  marginLeft
}) => {
  const unixFormattedDate = convertUnixToFormattedDate(forkEndTime);
  const forkWindowActive = !dateHasPassed(
    currentTime * 1000,
    Number(forkEndTime)
  );
  const startTime = createBigNumber(forkEndTime)
    .minus(
      createBigNumber(augur.constants.CONTRACT_INTERVAL.FORK_DURATION_SECONDS)
    )
    .toNumber();
  const threshold = formatAttoRep(forkReputationGoal);

  return (
    <section
      className={classNames(
        Styles.ForkingContent,
        expanded ? Styles.expanded : ""
      )}
    >
      <div
        className={classNames(
          Styles.ForkingContent__container,
          expanded ? Styles.expanded : ""
        )}
        style={{ paddingLeft: marginLeft }}
      >
        <TimeProgressBar
          endTime={parseInt(forkEndTime, 10)}
          currentTime={currentTime}
          startTime={startTime}
          timePeriodLabel="Fork Window"
          forking
        />
        {forkWindowActive && (
          <p>
            If you are a REP holder, please collect any outstanding REP on the
            Portfolio: Reporting page. Then, migrate your REP to your chosen
            child universe. All REP migrated during the forking period will
            receive a 5% bonus. The forking period will end on{" "}
            {unixFormattedDate.formattedLocalShort} or when at least{" "}
            {threshold.formatted} REP has been migrated to a single child
            universe. Read more about the forking process{" "}
            <a
              href="http://docs.augur.net/#fork-state"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
        )}
        {!forkWindowActive && (
          <p>
            If you are a REP holder, please collect any outstanding REP on the
            Portfolio: Reporting page. Then, migrate to your chosen child
            universe. The forking period has ended. Read more about the forking
            process{" "}
            <a
              href="http://docs.augur.net/#fork-state"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
        )}
        <div className={Styles.ForkingContent__buttonBar}>
          {!doesUserHaveRep && (
            <button
              disabled
              className={Styles.ForkingContent__no_rep_migrate_button}
            >
              Migrate REP
            </button>
          )}
          {doesUserHaveRep && (
            <MarketLink
              className={Styles.ForkingContent__migrate_rep_button}
              id={forkingMarket}
              formattedDescription="Migrate REP"
              linkType={TYPE_MIGRATE_REP}
            >
              Migrate REP
            </MarketLink>
          )}
          {!forkWindowActive &&
            !isForkingMarketFinalized && (
              <button
                className={Styles.ForkingContent__migrate_rep_button}
                onClick={() => finalizeMarket(forkingMarket)}
              >
                Finalize
              </button>
            )}
        </div>
      </div>
    </section>
  );
};

ForkingContent.propTypes = {
  finalizeMarket: PropTypes.func.isRequired,
  forkingMarket: PropTypes.string.isRequired,
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
  doesUserHaveRep: PropTypes.bool.isRequired,
  forkReputationGoal: PropTypes.string.isRequired,
  isForkingMarketFinalized: PropTypes.bool,
  marginLeft: PropTypes.number.isRequired
};

ForkingContent.defaultProps = {
  isForkingMarketFinalized: false
};

export default ForkingContent;
