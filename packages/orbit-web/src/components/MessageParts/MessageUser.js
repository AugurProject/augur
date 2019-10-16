'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import createColor from '../../utils/create-color'

function MessageUser ({ message, colorify, isCommand, onClick }) {
  const {
    userIdentity,
    meta: { from: userProfile }
  } = message

  const color =
    colorify && userIdentity ? createColor(userIdentity.publicKey) : 'rgb(250, 250, 250)'

  return (
    <div
      className={classNames('Message__User', { command: isCommand })}
      style={{ color }}
      onClick={evt => {
        if (typeof onClick === 'function') onClick(evt, userProfile, userIdentity)
      }}
    >
      {userProfile ? userProfile.name : ''}
    </div>
  )
}

MessageUser.propTypes = {
  message: PropTypes.object.isRequired,
  colorify: PropTypes.bool,
  isCommand: PropTypes.bool,
  onClick: PropTypes.func
}

MessageUser.defaultProps = {
  colorify: false,
  isCommand: false
}

export default MessageUser
