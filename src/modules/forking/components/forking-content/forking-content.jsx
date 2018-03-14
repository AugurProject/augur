import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { convertUnixToFormattedDate } from 'utils/format-date'
import ForkingProgressBar from 'modules/forking/components/forking-progress-bar/forking-progress-bar'

import Styles from 'modules/forking/components/forking-content/forking-content.styles'

class ForkingContent extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.migrateRep = this.migrateRep.bind(this)
  }

  migrateRep() {
    console.log('MIGRATE REP CLICKED: ', this.props.forkEndTime)
    // TODO
  }

  render() {
    const unixFormattedDate = convertUnixToFormattedDate(this.props.forkEndTime)
    const forkWindowActive = Number(this.props.forkEndTime) > this.props.currentTime

    return (
      <section className={classNames(Styles.ForkingContent, this.props.expanded ? Styles.expanded : '')}>
        <div className={classNames(Styles.ForkingContent__container, this.props.expanded ? Styles.expanded : '')}>
          <h4>
            Forking window ends {unixFormattedDate.formattedLocal}
          </h4>
          <ForkingProgressBar
            forkEndTime={this.props.forkEndTime}
            currentTime={this.props.currentTime}
          />
          {forkWindowActive &&
            <p>
              If you are a REP holder, please collect any outstanding REP on the Portfolio: Reporting page. Then, migrate to your chosen child universe. All REP migrated during the forking period will receive a 5% bonus. The forking period will end on {unixFormattedDate.formattedLocalShort} or when more than 50% of all REP has been migrated to a child universe. Read more about the forking process <a href="http://docs.augur.net/#fork-state">here</a>.
            </p>
          }
          {!forkWindowActive &&
            <p>
              If you are a REP holder, please collect any outstanding REP on the Portfolio: Reporting page. Then, migrate to your chosen child universe. The forking period has ended. Read more about the forking process <a href="http://docs.augur.net/#fork-state">here</a>.
            </p>
          }
          <button onClick={this.migrateRep} className={Styles.ForkingContent__migrate_rep_button}>Migrate REP</button>
        </div>
      </section>
    )
  }
}

ForkingContent.propTypes = {
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
}

export default ForkingContent
