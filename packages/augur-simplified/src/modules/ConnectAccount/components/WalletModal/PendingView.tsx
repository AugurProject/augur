import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import { SUPPORTED_WALLETS } from '../../constants'
import { injected } from '../../connectors'
import Loader from '../Loader'
import Option from './Option'

const PendingSection = ({ children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  }}>
    {children}
  </div>
)

const LoadingMessage = ({ children, darkMode, error }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '12px',
    marginBottom: '20px',
    padding: '1rem',
    color: `${error ? '#FF6871' : darkMode ? '#2172E5' : '#2172E5'}`,
    border: `1px solid ${error ? '#FF6871' : darkMode ? '#565A69' : '#C3C5CB'}`
  }}>
    {children}
  </div>
)

const ErrorGroup = ({ children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'flex-start',
  }}>
    {children}
  </div>
)

const ErrorButton = ({ onClick, darkMode, children }) => (
  <div
    onClick={onClick}
    style={{
      borderRadius: '8px',
      fontSize: '12px',
      color: `${darkMode ? '#565A69' : '#C3C5CB'}`,
      backgroundColor: `${darkMode ? '#565A69' : '#CED0D9'}`,
      marginLeft: '1rem',
      padding: '0.5rem',
      fontWeight: 600,
      userSelect: 'none',
      cursor: 'pointer',
    }
  }>
    {children}
  </div>
)

const LoadingWrapper = ({ children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {children}
  </div>
)

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
  darkMode,
}: {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
  darkMode?: boolean
}) {
  const isMetamask = window['ethereum'] && window['ethereum']['isMetaMask']

  return (
    <PendingSection>
      <LoadingMessage darkMode={darkMode} error={error}>
        <LoadingWrapper>
          {error ? (
            <ErrorGroup>
              <div>Error connecting.</div>
              <ErrorButton
                darkMode={darkMode}
                onClick={() => {
                  setPendingError(false)
                  connector && tryActivation(connector)
                }}
              >
                Try Again
              </ErrorButton>
            </ErrorGroup>
          ) : (
            <>
              <Loader darkMode={darkMode} />
              <span>Initializing...</span>
            </>
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={require('../../assets/' + option.iconName).default}
              darkMode={darkMode}
            />
          )
        }
        return null
      })}
    </PendingSection>
  )
}
