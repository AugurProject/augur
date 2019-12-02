'use strict'

import React, { Suspense, lazy, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { useObserver } from 'mobx-react'

import RootContext from '../context/RootContext'

import { BigSpinner } from '../components/Spinner'

import '../styles/ChannelView.scss'

const Channel = lazy(() => import(/* webpackChunkName: "Channel" */ '../containers/Channel'))
const MessageUserProfilePanel = lazy(() =>
  import(/* webpackChunkName: "MessageUserProfilePanel" */ '../containers/MessageUserProfilePanel')
)

function ChannelView () {
  const { networkStore } = useContext(RootContext)
  const { channel } = useParams()

  return useObserver(() =>
    networkStore.isOnline ? (
      <div className='ChannelView'>
        <Suspense fallback={<BigSpinner />}>
          {/* Render the profile panel of a user */}
          {/* This is the panel that is shown when a username is clicked in chat  */}
          <MessageUserProfilePanel />

          {/* Render the channel */}
          <Channel channelName={channel} />
        </Suspense>
      </div>
    ) : (
      <BigSpinner />
    )
  )
}

export default hot(module)(ChannelView)
