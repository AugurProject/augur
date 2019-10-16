'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import '../styles/Disclaimer.scss'

function Disclaimer ({ text }) {
  return (
    <div className='Disclaimer'>
      <div className='content'>{text}</div>
    </div>
  )
}

Disclaimer.propTypes = {
  text: PropTypes.string.isRequired
}

export default Disclaimer
