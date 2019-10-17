'use strict'

import React from 'react'
import { Redirect } from 'react-router-dom'

import RootContext from '../context/RootContext'
import { useObserver } from 'mobx-react'

export default function IndexView () {
  const { networkStore, uiStore } = React.useContext(RootContext)

  React.useEffect(() => {
    uiStore.setTitle('Orbit')
  }, [])

  return useObserver(() =>
    networkStore.channelNames.length > 0 ? (
      <Redirect to={`/channel/${networkStore.channelNames[0]}`} />
    ) : (
      <Redirect to={`/channel/${networkStore.defaultChannels[0]}`} />
    )
  )
}
