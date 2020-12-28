import React from 'react'
import { transparentize } from 'polished'


const Overlay = ({ children, darkMode, onDismiss }) => (
  <div
    // onDismiss={onDismiss}
    style={{
      zIndex: 2,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)'}`,
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
    }
  }>{children}</div>
)

const Content = ({ children, darkMode }) => (
  <div
    style={{
      margin: '0 0 2rem 0',
      backgroundColor: `${darkMode ? '#212429' : '#FAFAFA'}`,
      boxShadow: `0 4px 8px 0 ${transparentize(0.95, darkMode ? '#000' : '#2F80ED')}`,
      padding: '0px',
      width: window.innerWidth < 650 ? '100%' : '50vw',
      maxWidth: '420px',
      maxHeight: '90vh',
      display: 'flex',
      borderRadius: '20px',
    }
  }>{children}</div>
)

const StyledDialogOverlay = ({ onDismiss, darkMode, children }) => (
  <Overlay onDismiss={onDismiss} darkMode={darkMode}>
    {children}
  </Overlay>
)

const StyledDialogContent = ({ darkMode, children }) => (
  <Content darkMode={darkMode}>
    {children}
  </Content>
)

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  darkMode: boolean
}

export default function Modal({
  isOpen,
  onDismiss,
  children,
  darkMode
}: ModalProps) {
  return (
    <>
      {isOpen &&
        <StyledDialogOverlay onDismiss={onDismiss} darkMode={darkMode}>
          <StyledDialogContent
            darkMode={darkMode}
          >
            {children}
          </StyledDialogContent>
        </StyledDialogOverlay>
      }
    </>
  )
}
