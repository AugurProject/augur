'use strict'

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import hljs from 'highlight.js'

import 'highlight.js/styles/atom-one-dark.css'

function Highlight ({ children, extension, ...rest }) {
  const element = React.createRef()

  useEffect(() => {
    hljs.highlightBlock(element.current)
  })

  const language = hljs.getLanguage(extension)
  const className = classNames(language ? language.aliases : [extension, 'plaintext'])

  return (
    <pre {...rest}>
      <code ref={element} className={className}>
        {children}
      </code>
    </pre>
  )
}

Highlight.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  extension: PropTypes.string
}

export default Highlight
