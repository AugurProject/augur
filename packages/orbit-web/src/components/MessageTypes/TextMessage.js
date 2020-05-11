'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import textProcessor from '../textProcessor'

import '../../styles/TextMessage.scss'

function TextMessage ({ text, emojiSet, highlightWords, useEmojis, isCommand }) {
  text = isCommand ? text.substring(4, text.length) : text

  let tokenized = textProcessor.tokenize(text)

  tokenized = textProcessor.ipfsfy(tokenized, { useAutolink: true })
  tokenized = textProcessor.autolink(tokenized)
  tokenized = textProcessor.highlight(tokenized, { className: 'highlight', highlightWords })
  tokenized = useEmojis ? textProcessor.emojify(tokenized, { set: emojiSet }) : tokenized

  const content = textProcessor.render(tokenized)

  return <div className='TextMessage'>{content}</div>
}

TextMessage.propTypes = {
  text: PropTypes.string.isRequired,
  emojiSet: PropTypes.string.isRequired,
  highlightWords: PropTypes.array,
  useEmojis: PropTypes.bool,
  isCommand: PropTypes.bool
}

TextMessage.defaultProps = {
  highlightWords: [],
  useEmojis: true,
  isCommand: false
}

export default TextMessage
