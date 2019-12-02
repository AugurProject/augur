'use strict'

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react'

import Logger from '../utils/logger'

import RootContext from '../context/RootContext'

import ChannelStatus from './ChannelStatus'
import SendMessage from './SendMessage'

const logger = new Logger()

function ChannelControls ({ channel, disabled }) {
  const { uiStore } = useContext(RootContext)

  async function sendMessage (text) {
    try {
      await channel.sendMessage(text)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  return useObserver(() => (
    <div className='Controls'>
      <SendMessage
        channelName={channel ? channel.channelName : ''}
        onSendMessage={sendMessage}
        useEmojis={uiStore.useEmojis}
        emojiSet={uiStore.emojiSet}
        disabled={disabled}
      />
      <ChannelStatus channel={channel} theme={uiStore.theme} />
    </div>
  ))
}

ChannelControls.propTypes = {
  channel: PropTypes.object,
  disabled: PropTypes.bool
}

export default ChannelControls
