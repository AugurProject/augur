import React from 'react'
import PropTypes from 'prop-types'

export const SimpleButton = ({ text, onClick }) => (<button onClick={onClick}>{text}</button>)
SimpleButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
