import React from 'react'
import PropTypes from 'prop-types'

export const SimpleButton = ({ text, onClick, className }) => (<button className={className || ''} onClick={onClick}>{text}</button>)
SimpleButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}
