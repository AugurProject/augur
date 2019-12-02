'use strict'

import React from 'react'
import Autolinker from 'autolinker'

const autolinker = new Autolinker()

// Returns a React element or a string
function reactAutoLink (word, options, wordIndex) {
  const tag = autolinker.parse(word).map(i => i.buildTag())[0]

  if (!tag) return word

  return React.createElement(
    tag.getTagName(),
    Object.assign(tag.attrs, { key: `${tag.attrs.href}-${wordIndex}` }, options),
    tag.getInnerHTML()
  )
}

export default reactAutoLink
