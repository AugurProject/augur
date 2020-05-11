'use strict'

import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { useObserver } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import RootContext from '../context/RootContext'

import '../styles/ChannelHeader.scss'

function ChannelHeader () {
  const location = useLocation()
  const { channel } = useParams()
  const { networkStore, uiStore } = useContext(RootContext)
  const [t] = useTranslation()

  function handleMenuButtonClick (e) {
    e.stopPropagation()
    uiStore.openControlPanel()
  }

  const overrideName = t(`viewNames.${location.pathname.slice(1)}`)

  return useObserver(() => (
    <div className='Header'>
      <div
        className='open-controlpanel icon flaticon-lines18'
        onClick={handleMenuButtonClick}
      >
        {networkStore.unreadEntriesCount > 0 ? (
          <span className='unreadMessages'>{networkStore.unreadEntriesCount}</span>
        ) : null}
      </div>
      {/*<div className='currentChannel'>{channel ? `#${channel}` : overrideName}</div>*/}
    </div>
  ))
}

export default hot(module)(ChannelHeader)
