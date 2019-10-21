'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import { Redirect, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useObserver } from 'mobx-react'
import classNames from 'classnames'

import RootContext from '../context/RootContext'

import BackgroundAnimation from '../components/BackgroundAnimation'
import JoinChannel from '../components/JoinChannel'
import Spinner from '../components/Spinner'

import ChannelLink from './ChannelLink'

import '../styles/ControlPanel.scss'

setConfig({
  pureSFC: true,
  pureRender: true
})

function ControlPanel () {
  const location = useLocation()
  const { networkStore, uiStore, sessionStore } = React.useContext(RootContext)
  const [t] = useTranslation()
  const [redirect, setRedirect] = React.useState('')
  const [isCloseable, setIsCloseable] = React.useState(false)

  const inputRef = React.useRef()

  const focusInput = React.useCallback(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const handleClosePanel = React.useCallback(
    force => {
      if (force || isCloseable) uiStore.closeControlPanel()
    },
    [isCloseable]
  )

  const handleChannelLinkClick = React.useCallback((e, channel) => {
    e.preventDefault()
    setRedirect(`/channel/${channel.channelName}`)
  }, [])

  const handleJoinChannel = React.useCallback(e => {
    e.preventDefault()
    if (!inputRef.current) return
    setRedirect(`/channel/${inputRef.current.value.trim()}`)
  }, [])

  const handleCloseChannel = React.useCallback(
    channelName => {
      networkStore.leaveChannel(channelName).then(() => {
        if (uiStore.currentChannelName === channelName) setRedirect('/')
      })
    },
    [uiStore.currentChannelName]
  )

  React.useEffect(() => {
    setIsCloseable(location.pathname !== '/')
  }, [location])

  React.useLayoutEffect(() => {
    if (uiStore.isControlPanelOpen) focusInput()
  }, [focusInput, uiStore.isControlPanelOpen])

  React.useEffect(() => {
    if (redirect) {
      handleClosePanel(redirect !== '/')
      setRedirect('')
    }
  }, [handleClosePanel, redirect])

  function renderJoinChannelInput () {
    return networkStore.isOnline ? (
      <div className='joinChannelInput fadeInAnimation' style={{ animationDuration: '.5s' }}>
        <JoinChannel
          onSubmit={handleJoinChannel}
          theme={{ ...uiStore.theme }}
          inputRef={inputRef}
        />
      </div>
    ) : !networkStore.starting ? (
      <button
        className='startIpfsButton submitButton'
        style={{ ...uiStore.theme }}
        onClick={() => networkStore.start()}
      >
        {t('controlPanel.startJsIpfs')}
      </button>
    ) : (
      <div style={{ position: 'relative' }}>
        <Spinner />
      </div>
    )
  }

  function renderChannelsList () {
    return (
      <>
        <div
          className={classNames({
            panelHeader: networkStore.channelsAsArray.length > 0,
            hidden: networkStore.channelsAsArray.length === 0
          })}
        >
          {t('controlPanel.channels')}
        </div>

        <div className='openChannels fadeInAnimation' style={{ animationDuration: '.5s' }}>
          <div className='channelsList'>
            {networkStore.channelsAsArray.map(c => (
              <div
                className={classNames('row', {
                  active: uiStore.currentChannelName === c.channelName
                })}
                key={c.channelName}
              >
                <ChannelLink
                  channel={c}
                  theme={{ ...uiStore.theme }}
                  onClick={e => handleChannelLinkClick(e, c)}
                />
                <span
                  className='closeChannelButton'
                  onClick={() => handleCloseChannel(c.channelName)}
                >
                  {t('controlPanel.closeChannel')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  function renderBottomRow () {
    return (
      <div className='bottomRow'>
        <div
          className='icon flaticon-gear94'
          onClick={() => setRedirect('/settings')}
          style={{ ...uiStore.theme }}
          key='settingsIcon'
        />
        {/* <div
          className="icon flaticon-sharing7"
          // onClick={onOpenSwarmView}
          style={{ ...uiStore.theme }}
          key="swarmIcon"
        /> */}
        <div
          className='icon flaticon-prohibition35'
          onClick={() => sessionStore.logout()}
          style={{ ...uiStore.theme }}
          key='disconnectIcon'
        />
      </div>
    )
  }

  return useObserver(() =>
    uiStore.isControlPanelOpen && sessionStore.isAuthenticated ? (
      <>
        <div
          className={classNames('ControlPanel slideInAnimation', uiStore.sidePanelPosition, {
            'no-close': !isCloseable
          })}
        >
          <div style={{ opacity: 0.8, zIndex: -1 }}>
            <BackgroundAnimation
              size={320}
              startY={58}
              theme={{ ...uiStore.theme }}
              style={{ alignItems: 'flex-start' }}
            />
          </div>

          <div
            className={classNames('header bounceInAnimation', uiStore.sidePanelPosition)}
            onClick={handleClosePanel}
          >
            <div className='logo'>Orbit</div>
          </div>

          <div className='networkName fadeInAnimation' style={{ animationDuration: '1s' }}>
            {networkStore.networkName}
          </div>

          <div className='username'>{sessionStore.username}</div>

          {renderJoinChannelInput()}
          {renderChannelsList()}
          {renderBottomRow()}
        </div>
        <div
          className={classNames('darkener fadeInAnimation', { 'no-close': !isCloseable })}
          style={{ animationDuration: '1s' }}
          onClick={handleClosePanel}
        />
        {redirect ? <Redirect to={redirect} /> : null}
      </>
    ) : null
  )
}

export default hot(module)(ControlPanel)
