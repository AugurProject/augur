'use strict'

import React from 'react'

import { base58 } from '../../utils/base-x'

// Returns a React element or a string
function reactIpfsLink (
  word,
  { baseIpfsUrl = 'https://ipfs.io/ipfs/', useAutolink = false, props },
  wordIndex
) {
  const firstCheck = word.length === 46 && word.startsWith('Qm')
  if (!firstCheck) return word
  try {
    base58.decode(word)
    const href = baseIpfsUrl + word
    if (useAutolink) return href // Autolinker will handle the creation of an 'a' tag
    props.key = `${href}-${wordIndex}`
    return React.createElement('a', Object.assign({ href }, props), word)
  } catch (e) {
    return word
  }
}

export default reactIpfsLink
