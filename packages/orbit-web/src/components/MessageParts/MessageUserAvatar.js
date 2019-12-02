'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function MessageUserAvatar ({ message }) {
  const { name: username } = message.meta.from
  return <div className='Message__Avatar'>{username ? username.charAt(0).toUpperCase() : ''}</div>
}

MessageUserAvatar.propTypes = {
  message: PropTypes.object.isRequired
}

export default MessageUserAvatar
