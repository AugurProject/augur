import React from 'react'
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
import Styles from 'modules/filter-sort/components/filter-dropdowns/filter-dropdowns.styles'

const sortOptions = [
  { value: MARKET_CREATION_TIME, label: 'Creation Time' },
  { value: MARKET_END_DATE, label: 'End Time' },
  { value: MARKET_RECENTLY_TRADED, label: 'Recently Traded' },
  { value: MARKET_VOLUME, label: 'Volume' },
  { value: MARKET_FEE, label: 'Settlement Fee' },
]

const filterOptions = [
  { value: MARKET_OPEN, label: 'Open' },
  { value: MARKET_REPORTING, label: 'In Reporting' },
  { value: MARKET_CLOSED, label: 'Resolved' },
]

const FilterSearch = (p) => {
  const {
    filter,
    sort,
    updateFilter,
  } = p
  return (
    <div className={Styles.FilterDropdowns}>
      <Dropdown
        default={MARKET_OPEN}
        onChange={e => updateFilter({ filter: e, sort })}
        options={filterOptions}
      />
      <Dropdown
        default={MARKET_RECENTLY_TRADED}
        onChange={e => updateFilter({ filter, sort: e })}
        options={sortOptions}
      />
    </div>
  )
}

export default FilterSearch
