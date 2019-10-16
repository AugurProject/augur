'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

function FirstMessage ({ channelName, filtering, showing, ...rest }) {
  const [t] = useTranslation()

  return (
    <div className='firstMessage' {...rest}>
      {!filtering
        ? t('channel.beginningOf', { channel: channelName })
        : t('channel.showingLast', { channel: channelName, count: showing })}
    </div>
  )
}

FirstMessage.propTypes = {
  channelName: PropTypes.string.isRequired,
  filtering: PropTypes.bool,
  showing: PropTypes.number
}

export default FirstMessage
