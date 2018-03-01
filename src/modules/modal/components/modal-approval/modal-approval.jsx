import React from 'react'

import Styles from 'modules/modal/components/modal-approval/modal-approval.styles'

const ModalApproval = p => (
  <section className={Styles.ModalApproval}>
    <h1>Approve Augur</h1>
    <span>In order to trade on Augur you must first approve the Augur Contracts to move your Ether on your behalf. Please Click the &quot;Approve Augur&quot; button below to approve the Augur Contracts. You will not be able to to trade until approval has been completed.</span>
    <div className={Styles.ModalApproval__ActionButtons}>
      <button
        onClick={p.closeModal}
      >
        Close
      </button>
      <button
        onClick={(e) => {
          e.preventDefault()
          p.approveAccount(p.modal.approveCallback)
          p.closeModal()
        }}
      >
        Approve Augur
      </button>
    </div>
  </section>
)

export default ModalApproval
