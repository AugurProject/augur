'use strict'

import React, { lazy, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import RootContext from '../context/RootContext'

import { BigSpinner } from '../components/Spinner'

import '../styles/Channel.scss'

const ChannelControls = lazy(() =>
  import(/* webpackChunkName: "ChannelControls" */ './ChannelControls')
)
const ChannelMessages = lazy(() =>
  import(/* webpackChunkName: "ChannelMessages" */ './ChannelMessages')
)

function Channel ({ channelName }) {
  const [channel, setChannel] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const { networkStore, uiStore } = useContext(RootContext)
  const [t] = useTranslation()

  const mounted = React.useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  function handleChannelNameChange () {
    setChannel(null)

    uiStore.setTitle(`#${channelName} | Orbit`)
    uiStore.setCurrentChannelName(channelName)

    networkStore.joinChannel(channelName).then(channel => {
      if (mounted.current) setChannel(channel)
    })

    return () => {
      uiStore.setCurrentChannelName(null)
    }
  }

  useEffect(handleChannelNameChange, [channelName])

  return (
    <div
      className='Channel'
    >
      <React.Suspense fallback={<BigSpinner />}>
        {channel ? <ChannelMessages channel={channel} /> : <BigSpinner />}
      </React.Suspense>

      <ChannelControls channel={channel} disabled={!channel} />
    </div>
  )
}

Channel.propTypes = {
  channelName: PropTypes.string.isRequired
}

export default Channel
