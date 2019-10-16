'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useObserver } from 'mobx-react'

function ChannelStatus ({ channel, theme }) {
  const [t] = useTranslation()
  return useObserver(() => {
    const userCount = channel ? channel.userCount : 0
    return (
      <div className='ChannelStatus' style={{ ...theme }}>
        {userCount} {t('channel.status.users', { count: userCount })}
      </div>
    )
  })
}

ChannelStatus.propTypes = {
  channel: PropTypes.object,
  theme: PropTypes.object.isRequired
}

export default ChannelStatus
