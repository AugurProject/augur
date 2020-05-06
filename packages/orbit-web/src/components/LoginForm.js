'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import '../styles/SubmitButton.scss'
import '../styles/InputField.scss'

function LoginForm ({ theme, onSubmit, usernameInputRef }) {
  const [t] = useTranslation()
  const [currentLength, setCurrentLength] = React.useState(0)

  const handleUsernameRowClick = React.useCallback(() => {
    if (usernameInputRef.current) usernameInputRef.current.focus()
  }, [])

  const handleUsernameInputChange = React.useCallback(() => {
    if (usernameInputRef.current) setCurrentLength(usernameInputRef.current.value.length)
  }, [])

  return (
    <form onSubmit={onSubmit}>
      <div className='usernameRow fadeInAnimation' onClick={handleUsernameRowClick}>
        <input
          ref={usernameInputRef}
          type='text'
          placeholder={t('login.nickname')}
          maxLength='32'
          autoFocus
          style={theme}
          onChange={handleUsernameInputChange}
        />
      </div>
      <div className='connectButtonRow'>
        <input type='submit' value='Login' />
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  usernameInputRef: PropTypes.object
}

export default LoginForm
