'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function FileUploadButton ({ onSelectFiles, theme, disabled }) {
  const fileInput = React.createRef()

  const handleClick = React.useCallback(
    e => {
      e.preventDefault()
      if (!disabled) fileInput.current.click()
    },
    [disabled]
  )

  const handleFileSelect = React.useCallback(() => {
    const files = fileInput.current.files
    if (files) onSelectFiles(files)
    fileInput.current.value = null
  }, [onSelectFiles])

  return (
    <div className='FileUploadButton' style={{ ...theme }}>
      <input
        type='file'
        id='file'
        multiple
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <div className='icon flaticon-tool490' onClick={handleClick} />
    </div>
  )
}

FileUploadButton.propTypes = {
  onSelectFiles: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  disabled: PropTypes.bool
}

export default FileUploadButton
