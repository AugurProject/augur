import React from 'react'
import PropTypes from 'prop-types'

import { FirstMessage, LoadingMessages } from '.'

function LoadingOrFirstMessage ({ loading, channelName }) {
  return loading ? <LoadingMessages /> : <FirstMessage channelName={channelName} />
}

LoadingOrFirstMessage.propTypes = {
  loading: PropTypes.bool.isRequired,
  channelName: PropTypes.string.isRequired
}

export default LoadingOrFirstMessage
