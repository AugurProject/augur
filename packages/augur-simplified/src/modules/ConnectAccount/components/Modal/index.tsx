import React from 'react';
import Styles from 'modules/ConnectAccount/index.styles.less';

const ModalOverlay = ({children}) => (
  <div className={Styles.ModalOverlay}>
    {children}
  </div>
);

const ModalContainer = ({children}) => (
  <div className={Styles.ModalContainer}>
    {children}
  </div>
);

const ModalHeader = ({children}) => (
  <div className={Styles.ModalHeader}>
    {children}
  </div>
);

const ModalBody = ({children}) => (
  <div className={Styles.ModalBody}>
    {children}
  </div>
);

const ModalFooter = ({children}) => (
  <div className={Styles.ModalFooter}>
    {children}
  </div>
);

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
  return isOpen ? (
    <ModalOverlay onDismiss={onDismiss} darkMode={darkMode}>
      <ModalContainer>
        <ModalHeader>

        </ModalHeader>
        <ModalBody>

        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </ModalContainer>
      {/*<StyledDialogContent*/}
      {/*  darkMode={darkMode}*/}
      {/*>*/}
      {/*  {children}*/}
      {/*</StyledDialogContent>*/}
    </ModalOverlay>
  ) : null
}
