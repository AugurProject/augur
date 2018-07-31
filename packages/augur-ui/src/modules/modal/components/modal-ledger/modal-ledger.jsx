import React from 'react'

import Styles from 'modules/modal/components/modal-ledger/modal-ledger.styles'

const ModalLedger = p => (
  <section className={Styles.ModalLedger}>
    <h1>Sign Transaction On Ledger</h1>
    {p.error &&
      <span>{p.error}</span>
    }
  </section>
)

export default ModalLedger
