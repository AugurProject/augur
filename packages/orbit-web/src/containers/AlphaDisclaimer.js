'use strict'

import React from 'react'
import { useTranslation } from 'react-i18next'

import Disclaimer from '../components/Disclaimer'

function AlphaDisclaimer () {
  const [t] = useTranslation()
  return <Disclaimer text={t('disclaimer.alpha.content')} />
}

export default AlphaDisclaimer
