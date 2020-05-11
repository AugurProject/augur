'use strict'

import React from 'react'
import { useTranslation } from 'react-i18next'

function LoadingMessages ({ ...rest }) {
  const [t] = useTranslation()

  return (
    <div className='firstMessage' {...rest}>
      {t('channel.loadingHistory')}
    </div>
  )
}

export default LoadingMessages
