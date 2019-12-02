'use strict'

import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useObserver } from 'mobx-react'

import Countries from '../config/countries.json'

import RootContext from '../context/RootContext'

import BackgroundAnimation from '../components/BackgroundAnimation'

import '../styles/MessageUserProfilePanel.scss'
import earthImg from '../images/earth.png'

function MessageUserProfilePanel () {
  const { uiStore } = useContext(RootContext)
  const [t] = useTranslation()

  const handleClose = useCallback(
    e => {
      uiStore.closeUserProfilePanel(e)
    },
    [uiStore.closeUserProfilePanel]
  )

  return useObserver(() =>
    uiStore.userProfilePanelIsOpen ? (
      <div
        className='MessageUserProfilePanel'
        style={calculatePanelStyle(uiStore.userProfilePanelPosition, uiStore.windowDimensions)}
      >
        <BackgroundAnimation
          style={{ top: '-30px', left: '-70px', zIndex: '-1', display: 'block' }}
          size={256}
          theme={{ ...uiStore.theme }}
        />
        <span className='close' onClick={handleClose} children='X' />
        {renderUserCard(t, uiStore.userProfilePanelUser)}
      </div>
    ) : null
  )
}

function calculatePanelStyle (panelPosition, windowDimensions) {
  const { x: left, y: top } = panelPosition
  const translateHorizontal = left > windowDimensions.width / 2 ? '-100%' : '0'
  const translateVertical = top > windowDimensions.height / 2 ? '-100%' : '0'
  return {
    left,
    top,
    transform: `translate(${translateHorizontal}, ${translateVertical})`
  }
}

function renderUserCard (t, user) {
  const country = Countries[user.profile.location]
  return (
    <>
      <img className='picture fadeInAnimation' src={earthImg} />

      <div className='name'>{user.profile.name}</div>
      <div className='country'>{country ? country + ', Earth' : 'Earth'}</div>
      <dl className='profileDataContainer'>
        <dt>{t('userProfile.identityType')}:</dt>
        <dd>{user.identity.type}</dd>
        <dt>{t('userProfile.identityId')}:</dt>
        <dd className='code'>{user.identity.id}</dd>
        <dt>{t('userProfile.identityPublicKey')}:</dt>
        <dd className='code'>{user.identity.publicKey}</dd>
      </dl>
    </>
  )
}

MessageUserProfilePanel.propTypes = {}

export default MessageUserProfilePanel
