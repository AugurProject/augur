'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import { getFormattedDateString } from '../utils/format-time'

function MessagesDateSeparator ({ date, locale }) {
  return <div className='dateSeparator'>{getFormattedDateString(date, locale)}</div>
}

MessagesDateSeparator.propTypes = {
  date: PropTypes.object.isRequired,
  locale: PropTypes.string
}

MessagesDateSeparator.defaultProps = {
  locale: 'en'
}

export default MessagesDateSeparator
