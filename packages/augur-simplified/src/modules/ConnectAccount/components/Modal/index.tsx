import React from 'react'
import { animated, useTransition } from 'react-spring'
import { transparentize } from 'polished'
// import { useGesture } from 'react-use-gesture'


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
      width: '50vw',
      maxWidth: '420px',
      maxHeight: '90vh',
      display: 'flex',
      borderRadius: '20px',
    }
  }>{children}</div>
)


const AnimatedDialogOverlay = animated(Overlay)


const StyledDialogOverlay = ({ onDismiss, darkMode, children }) => (
  <AnimatedDialogOverlay onDismiss={onDismiss} darkMode={darkMode}>
    {children}
  </AnimatedDialogOverlay>
)

const AnimatedDialogContent = animated(Content)

const StyledDialogContent = ({ darkMode, children }) => (
  <AnimatedDialogContent darkMode={darkMode}>
    {children}
  </AnimatedDialogContent>
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
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children,
  darkMode
}: ModalProps) {

  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  // const [{}, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  // const bind = useGesture({
  //   onDrag: state => {
  //     set({
  //       y: state.down ? state.movement[1] : 0
  //     })
  //     if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
  //       onDismiss()
  //     }
  //   }
  // })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay key={key} onDismiss={onDismiss} darkMode={darkMode}>
              <StyledDialogContent
                darkMode={darkMode}
              >
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
