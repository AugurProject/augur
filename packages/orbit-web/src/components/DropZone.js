import React from 'react'
import PropTypes from 'prop-types'

import '../styles/DropZone.scss'

const DropZone = props => {
  const { onDrop, onDragLeave, label } = props
  return (
    <div className='dropzone' onDrop={onDrop} onDragLeave={onDragLeave}>
      <div className='droplabel'>{label}</div>
    </div>
  )
}

DropZone.propTypes = {
  onDrop: PropTypes.func,
  onDragLeave: PropTypes.func,
  label: PropTypes.string
}

export default DropZone
