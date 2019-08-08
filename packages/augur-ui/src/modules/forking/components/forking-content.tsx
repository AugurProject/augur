import React from "react";
import classNames from "classnames";
import { formatAttoRep } from "utils/format-number";
import { convertUnixToFormattedDate, dateHasPassed } from "utils/format-date";
import TimeProgressBar from "modules/reporting/components/time-progress-bar/time-progress-bar";
import { TYPE_MIGRATE_REP, CONTRACT_INTERVAL } from "modules/common/constants";
import MarketLink from "modules/market/components/market-link/market-link";
import { createBigNumber } from "utils/create-big-number";
import Styles from "modules/forking/components/forking-content.styles.less";

interface ForkingContentProps {
  finalizeMarket: Function;
  forkingMarket: string;
  forkEndTime: string;
  currentTime: number;
  expanded: boolean;
  doesUserHaveRep: boolean;
  forkReputationGoal: string;
  isForkingMarketFinalized?: boolean;
  marginLeft: number;
}

const ForkingContent = ({
  forkingMarket,
  forkEndTime,
  currentTime,
  expanded,
  doesUserHaveRep,
  forkReputationGoal,
  isForkingMarketFinalized = false,
  finalizeMarket,
  marginLeft,
}: ForkingContentProps) => {
  const unixFormattedDate = convertUnixToFormattedDate(Number(forkEndTime));
  const forkWindowActive = !dateHasPassed(
    currentTime * 1000,
    Number(forkEndTime),
  );
  const startTime = createBigNumber(forkEndTime)
    .minus(
      createBigNumber(CONTRACT_INTERVAL.FORK_DURATION_SECONDS),
    )
    .toNumber();
  const threshold = formatAttoRep(forkReputationGoal);

  return (
    <section
      className={classNames(
        Styles.ForkingContent,
        expanded ? Styles.expanded : "",
      )}
    >
      <div
        className={classNames(
          Styles.ForkingContent__container,
          expanded ? Styles.expanded : "",
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
            {unixFormattedDate.formatted} or when at least{" "}
            {threshold.formatted} REP has been migrated to a single child
            universe. Read more about the forking process{" "}
            <a
              href="http://docs.augur.net/#fork-state"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
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
              style={{ textDecoration: "underline" }}
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

export default ForkingContent;
