'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import '../styles/JoinChannel.scss'

function JoinChannel ({ onSubmit, theme, inputRef }) {
  const [t] = useTranslation()
  return (
    <div className='JoinChannel'>
      <form onSubmit={onSubmit}>
        <div className='row'>
          <span className='label'>#</span>
          <span className='field' style={theme}>
            <input type='text' ref={inputRef} placeholder={t('joinChannel.inputPlaceholder')} />
          </span>
        </div>
      </form>
    </div>
  )
}

JoinChannel.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  inputRef: PropTypes.object
}

export default JoinChannel
