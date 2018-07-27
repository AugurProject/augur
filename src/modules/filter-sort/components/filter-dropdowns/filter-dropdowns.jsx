import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  MARKET_VOLUME,
  MARKET_CREATION_TIME,
  MARKET_END_DATE,
  MARKET_RECENTLY_TRADED,
  MARKET_FEE,
} from 'modules/filter-sort/constants/market-sort-params'
import {
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
} from 'modules/filter-sort/constants/market-states'
import Dropdown from 'modules/common/components/dropdown/dropdown'
import { constants } from 'services/augurjs'
import Styles from 'modules/filter-sort/components/filter-dropdowns/filter-dropdowns.styles'

const { REPORTING_STATE } = constants
// REPORTING_STATE: {
//   PRE_REPORTING: "PRE_REPORTING",
//   DESIGNATED_REPORTING: "DESIGNATED_REPORTING",
//   OPEN_REPORTING: "OPEN_REPORTING",
//   CROWDSOURCING_DISPUTE: "CROWDSOURCING_DISPUTE",
//   AWAITING_NEXT_WINDOW: "AWAITING_NEXT_WINDOW",
//   AWAITING_FINALIZATION: "AWAITING_FINALIZATION",
//   FINALIZED: "FINALIZED",
//   FORKING: "FORKING",
//   AWAITING_NO_REPORT_MIGRATION: "AWAITING_NO_REPORT_MIGRATION",
//   AWAITING_FORK_MIGRATION: "AWAITING_FORK_MIGRATION",
// },
const filterOptions = [
  { value: MARKET_CREATION_TIME, label: 'Creation Time' },
  { value: MARKET_END_DATE, label: 'End Time' },
  { value: MARKET_RECENTLY_TRADED, label: 'Recently Traded' },
  { value: MARKET_VOLUME, label: 'Volume' },
  { value: MARKET_FEE, label: 'Settlement Fee' },
]

const stateOptions = [
  { value: MARKET_OPEN, label: 'Open' },
  { value: MARKET_REPORTING, label: 'In Reporting' },
  { value: MARKET_CLOSED, label: 'Resolved' },
]

export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    searchPlaceholder: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      search: '',
    }
  }

  render() {
    return (
      <div className={Styles.FilterDropdowns}>
        <Dropdown
          default={MARKET_OPEN}
          onChange={e => console.log(e, 'onChange! StateOptions')}
          options={stateOptions}
        />
        <Dropdown
          default={MARKET_RECENTLY_TRADED}
          onChange={e => console.log(e, 'onChange! FilterOptions')}
          options={filterOptions}
        />
      </div>
    )
  }
}
