'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import { getFormattedTimestamp } from '../../utils/format-time'

function MessageTimestamp ({ message }) {
  return <span className='Message__Timestamp'>{getFormattedTimestamp(message.meta.ts)}</span>
}

MessageTimestamp.propTypes = {
  message: PropTypes.object.isRequired
}

export default MessageTimestamp
