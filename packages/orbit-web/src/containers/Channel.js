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

const DropZone = lazy(() => import(/* webpackChunkName: "DropZone" */ '../components/DropZone'))

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

  const handleDropFiles = React.useCallback(
    event => {
      event.preventDefault()
      setDragActive(false)

      const files = []
      if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const file = event.dataTransfer.items[i]
          file.kind === 'file' && files.push(file.getAsFile())
        }
      } else {
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          files.push(event.dataTransfer.files.item(i))
        }
      }

      channel.sendFiles(files)
    },
    [channel]
  )

  return (
    <div
      className='Channel'
      onDragOver={event => {
        event.preventDefault()
        !dragActive && setDragActive(true)
      }}
    >
      {dragActive && (
        <DropZone
          label={t('channel.file.dropzone.add', { channel: channelName })}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDropFiles}
        />
      )}

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
