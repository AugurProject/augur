import React from 'react'

import ModalLedger from 'modules/modal/containers/modal-ledger'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

const ModalView = p => (
  <section
    className={Styles.ModalView}
  >
    <ModalLedger />
  </section>
)

export default ModalView
