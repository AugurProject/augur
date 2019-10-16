'use strict'

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react'

import Logger from '../utils/logger'

import RootContext from '../context/RootContext'

import FileUploadButton from '../components/FileUploadButton'

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

  async function sendFiles (files) {
    try {
      await channel.sendFiles(files)
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
        theme={uiStore.theme}
        useEmojis={uiStore.useEmojis}
        emojiSet={uiStore.emojiSet}
        disabled={disabled}
      />
      <FileUploadButton onSelectFiles={sendFiles} theme={uiStore.theme} disabled={disabled} />
      <ChannelStatus channel={channel} theme={uiStore.theme} />
    </div>
  ))
}

ChannelControls.propTypes = {
  channel: PropTypes.object,
  disabled: PropTypes.bool
}

export default ChannelControls
