'use strict'

import React from 'react'
import { Emoji } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css'

const pattern = /(:[^:\s]+:?)/gim

// TODO: emoticons are not rendering properly

// Returns a React element or a string
function reactEmoji (word, { size = 16, set = 'emojione', ...rest }, wordIndex) {
  if (word[0] !== ':' || word.length === 1) return word
  const props = Object.assign(
    {
      size,
      set,
      fallback: (emoji, fallbackProps) => fallbackProps.emoji // Return whatever was given as input
    },
    { ...rest }
  )
  const fragmentKey = `${word}-${wordIndex}`
  const emojis = word.match(pattern)
  return (
    <React.Fragment key={fragmentKey}>
      {emojis.map((emoji, i) => (
        <Emoji emoji={emoji} {...props} key={`${fragmentKey}-${i}`} />
      ))}
    </React.Fragment>
  )
}

export default reactEmoji
