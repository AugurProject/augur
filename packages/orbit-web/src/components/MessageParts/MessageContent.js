'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { FileMessage, TextMessage } from '../MessageTypes'

import { FadeAnimation } from '../../utils/animations'

function MessageContent ({ message, isCommand, loadFile, ...rest }) {
  let content

  switch (message.meta.type) {
    case 'text':
      content = (
        <TextMessage key={message.hash} text={message.content} isCommand={isCommand} {...rest} />
      )
      break
    case 'file':
      content = (
        <FileMessage
          key={message.hash}
          messageHash={message.hash}
          fileHash={message.content}
          meta={message.meta}
          loadFile={loadFile}
          {...rest}
        />
      )
      break
    case 'directory':
      break
    default:
      content = message.content
  }

  return (
    <div
      className={classNames('Message__Content', {
        command: isCommand
      })}
    >
      <FadeAnimation in={!message.unread}>{content}</FadeAnimation>
    </div>
  )
}

MessageContent.propTypes = {
  message: PropTypes.object.isRequired,
  isCommand: PropTypes.bool,
  loadFile: PropTypes.func.isRequired
}

MessageContent.defaultProps = {
  isCommand: false
}

export default MessageContent
