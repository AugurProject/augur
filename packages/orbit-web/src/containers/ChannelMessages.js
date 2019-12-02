'use strict'

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react-lite'
import classNames from 'classnames'

import getMousePosition from '../utils/mouse-position'

import RootContext from '../context/RootContext'

import MessageList from '../components/MessageList'

function ChannelMessages ({ channel }) {
  const { sessionStore, uiStore } = useContext(RootContext)

  function onMessageUserClick (evt, profile, identity) {
    evt.persist()
    evt.stopPropagation()
    uiStore.openUserProfilePanel({ identity, profile }, getMousePosition(evt))
  }

  return useObserver(() => (
    <div
      className={classNames('Messages', {
        'size-normal': !uiStore.useLargeMessage,
        'size-large': uiStore.useLargeMessage,
        'font-normal': !uiStore.useMonospaceFont,
        'font-monospace': uiStore.useMonospaceFont
      })}
    >
      <MessageList
        key={channel.channelName}
        messages={channel.messages}
        channelName={channel.channelName}
        loading={channel.loading || channel.replicating}
        hasUnreadMessages={channel.hasUnreadMessages}
        entryCount={channel.entryCount}
        maxEntryCount={channel.maxEntryCount}
        loadMore={channel.increaseMessageOffset}
        resetOffset={channel.resetMessageOffset}
        highlightWords={[sessionStore.username]}
        loadFile={channel.loadFile}
        useLargeMessage={uiStore.useLargeMessage}
        useMonospaceFont={uiStore.useMonospaceFont}
        colorifyUsernames={uiStore.colorifyUsernames}
        language={uiStore.language}
        useEmojis={uiStore.useEmojis}
        emojiSet={uiStore.emojiSet}
        markMessageRead={channel.markEntryAsReadWithHash}
        onMessageUserClick={onMessageUserClick}
      />
    </div>
  ))
}

ChannelMessages.propTypes = {
  channel: PropTypes.object.isRequired
}

export default ChannelMessages
