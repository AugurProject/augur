/* eslint jsx-a11y/no-static-element-interactions: 0 */  // Needed to address cross-browser handling of on-click events + resultant sizing

import React from 'react'
import PropTypes from 'prop-types'

import Datetime from 'react-datetime'

import { formatDate } from 'utils/format-date'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_END_DATE } from 'modules/create-market/constants/new-market-creation-steps'

const CreateMarketFormEndDate = (p) => {
  if (p.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE) && Object.keys(p.endDate).length && !p.isValid) p.updateValidity(true)

  const yesterday = Datetime.moment().subtract(1, 'day')
  const valid = current => current.isAfter(yesterday)
  const defaultValue = Object.keys(p.endDate).length ? p.endDate : ''

  return (
    <article className={`create-market-form-part create-market-form-part-end-date ${p.className || ''}`}>
      <div className="create-market-form-part-content">
        <div className="create-market-form-part-input">
          <aside>
            <h3>End Date</h3>
            <span>What is the <strong>local</strong> date & time at which your event will resolve?</span>
          </aside>
          <div className="vertical-form-divider" />
          <form
            onClick={p.updateFormHeight}
            onSubmit={e => e.preventDefault()}
          >
            <Datetime
              open
              isValidDate={valid}
              dateFormat="YYYY/MM/DD"
              timeFormat="hh:mm:ss a"
              defaultValue={defaultValue}
              inputProps={{ placeholder: 'YYYY/MM/DD hh:mm:ss a' }}
              onChange={(date) => {
                p.updateNewMarket({ endDate: formatDate(new Date(date)) })
                p.updateValidity(true)
              }}
            />
          </form>
        </div>
      </div>
    </article>
  )
}

CreateMarketFormEndDate.propTypes = {
  currentStep: PropTypes.number.isRequired,
  isValid: PropTypes.bool.isRequired,
  endDate: PropTypes.object.isRequired,
  updateFormHeight: PropTypes.func.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
}

export default CreateMarketFormEndDate
