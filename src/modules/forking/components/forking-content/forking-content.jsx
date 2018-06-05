import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatAttoRep } from 'utils/format-number'
import { convertUnixToFormattedDate, dateHasPassed } from 'utils/format-date'
import ForkingProgressBar from 'modules/forking/components/forking-progress-bar/forking-progress-bar'
import { TYPE_MIGRATE_REP } from 'modules/market/constants/link-types'
import MarketLink from 'modules/market/components/market-link/market-link'

import Styles from 'modules/forking/components/forking-content/forking-content.styles'

const ForkingContent = (p) => {
  const unixFormattedDate = convertUnixToFormattedDate(p.forkEndTime)
  const forkWindowActive = !dateHasPassed(p.currentTime * 1000, Number(p.forkEndTime))

  const threshold = formatAttoRep(p.forkReputationGoal)

  return (
    <section className={classNames(Styles.ForkingContent, p.expanded ? Styles.expanded : '')}>
      <div className={classNames(Styles.ForkingContent__container, p.expanded ? Styles.expanded : '')}>
        <h4>
          Forking window {forkWindowActive ? `ends` : `ended`} {unixFormattedDate.formattedLocal}
        </h4>
        <ForkingProgressBar
          forkEndTime={p.forkEndTime}
          currentTime={p.currentTime}
        />
        {forkWindowActive &&
          <p>
            If you are a REP holder, please collect any outstanding REP on the Portfolio: Reporting page. Then, migrate your REP to your chosen child universe. All REP migrated during the forking period will receive a 5% bonus. The forking period will end on {unixFormattedDate.formattedLocalShort} or when at least {threshold.formatted} REP has been migrated to a single child universe. Read more about the forking process <a href="http://docs.augur.net/#fork-state">here</a>.
          </p>
        }
        {!forkWindowActive &&
          <p>
            If you are a REP holder, please collect any outstanding REP on the Portfolio: Reporting page. Then, migrate to your chosen child universe. The forking period has ended. Read more about the forking process <a href="http://docs.augur.net/#fork-state">here</a>.
          </p>
        }
        <div className={Styles.ForkingContent__buttonBar}>
          { !p.doesUserHaveRep &&
            <button disabled className={Styles.ForkingContent__no_rep_migrate_button}>Migrate REP</button>
          }
          { p.doesUserHaveRep &&
            <MarketLink
              className={Styles.ForkingContent__migrate_rep_button}
              id={p.forkingMarket}
              formattedDescription="Migrate REP"
              linkType={TYPE_MIGRATE_REP}
            >
              Migrate REP
            </MarketLink>
          }
          { !forkWindowActive && !p.isForkingMarketFinalized &&
            <button
              className={Styles.ForkingContent__migrate_rep_button}
              onClick={() => p.finalizeMarket(p.forkingMarket)}
            >
              Finalize
            </button>
          }
        </div>
      </div>
    </section>
  )
}

ForkingContent.propTypes = {
  forkingMarket: PropTypes.string.isRequired,
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
  doesUserHaveRep: PropTypes.bool.isRequired,
  forkReputationGoal: PropTypes.string.isRequired,
  isForkingMarketFinalized: PropTypes.bool,
}

export default ForkingContent
