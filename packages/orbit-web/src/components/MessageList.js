'use strict'

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import debounce from 'lodash.debounce'

import MessageRow from './MessageRow'
import MessagesDateSeparator from './MessagesDateSeparator'
import { FirstMessage, LoadingMessages, LoadMore } from './MessageTypes'
import DelayRender from './DelayRender'

import { useVisibility, useRefCallback } from '../utils/hooks'

function MessageList ({
  messages,
  channelName,
  loading,
  hasUnreadMessages,
  entryCount,
  maxEntryCount,
  loadMore,
  resetOffset,
  theme,
  ...messageRowProps
}) {
  const [listRef, setListRef] = useRefCallback()

  const [atBottom, setAtBottom] = useState(true)

  const botMargin = 20

  function checkBoundaries () {
    if (!listRef) return

    const el = listRef
    const botVisible = el.scrollTop + el.clientHeight >= el.scrollHeight - botMargin

    setAtBottom(botVisible)
  }

  function stayAtBottom () {
    if (!listRef) return
    if (atBottom) listRef.scrollTop = listRef.scrollHeight
  }

  useEffect(() => () => resetOffset(), [])
  useLayoutEffect(checkBoundaries, [listRef])
  useLayoutEffect(stayAtBottom, [listRef, entryCount])

  const checkBoundariesDebounced = useCallback(debounce(checkBoundaries, 40, { loading: true }), [
    listRef
  ])

  const onLoadMore = useCallback(() => {
    if (!listRef) return
    const el = listRef
    const scrollFromBot = el.scrollHeight - el.clientHeight - el.scrollTop
    loadMore()
    el.scrollTop = el.scrollHeight - el.clientHeight - scrollFromBot
  }, [listRef])

  return (
    <>
      <div
        ref={setListRef}
        onScroll={checkBoundariesDebounced}
        className={classNames('MessageList')}
      >
        {messages.length < entryCount ? (
          <LoadMore parentElement={listRef} onActivate={onLoadMore} />
        ) : loading ? (
          <LoadingMessages />
        ) : (
          <FirstMessage
            channelName={channelName}
            filtering={entryCount >= maxEntryCount}
            showing={maxEntryCount}
          />
        )}
        {messages.map((m, index) => (
          <MessageListRow
            key={`message-${m.hash}`}
            parentElement={listRef}
            message={m}
            prevMessage={messages[index - 1]}
            {...messageRowProps}
          />
        ))}
      </div>
      {!atBottom && hasUnreadMessages ? <div className='unreadIndicator' style={theme} /> : null}
      <DelayRender visible={loading}>
        <div className='progressBar' style={theme} />
      </DelayRender>
    </>
  )
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  channelName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  hasUnreadMessages: PropTypes.bool.isRequired,
  entryCount: PropTypes.number.isRequired,
  maxEntryCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  resetOffset: PropTypes.func.isRequired
}

function MessageListRow ({
  parentElement,
  message,
  prevMessage,
  language,
  markMessageRead,
  ...rest
}) {
  const [ref, setRef] = useRefCallback()
  const isVisible = useVisibility(ref, parentElement)

  useEffect(() => {
    if (isVisible && message.unread) markMessageRead(message.hash)
  }, [isVisible, message])

  // Parse dates so we know if we must add a date separator
  const prevDate = prevMessage && new Date(prevMessage.meta.ts)
  const date = new Date(message.meta.ts)
  // Add separator when this is the first message or the dates between messages differ
  const addDateSepator = date && (!prevDate || (prevDate && date.getDate() !== prevDate.getDate()))

  return (
    <div ref={setRef}>
      {addDateSepator && <MessagesDateSeparator date={date} locale={language} />}
      <MessageRow message={message} {...rest} />
    </div>
  )
}

MessageListRow.propTypes = {
  parentElement: PropTypes.instanceOf(Element),
  message: PropTypes.object.isRequired,
  prevMessage: PropTypes.object,
  language: PropTypes.string,
  markMessageRead: PropTypes.func.isRequired,
  theme: PropTypes.object
}

export default MessageList
