import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/modal/components/modal-approval/modal-approval.styles'

const ModalApproval = p => (
  <section className={Styles.ModalApproval}>
    <h1>Approve Augur</h1>
    <p>In order to trade on Augur you must first approve the Augur Contracts to move your Ether on your behalf. You will not be able to to trade until approval has been completed.</p>
    <p>After clicking &quot;Approve&quot; you will be asked to sign a transaction, followed by a second transaction to complete your requested trade.</p>
    <div className={Styles.ModalApproval__ActionButtons}>
      <button
        onClick={p.closeModal}
      >
        Cancel
      </button>
      <button
        onClick={(e) => {
          if (!p.modal.continueDefault) e.preventDefault()
          p.approveAccount(p.modal.approveOnSent, p.modal.approveCallback)
          p.closeModal()
        }}
      >
        Approve
      </button>
    </div>
  </section>
)

ModalApproval.propTypes = {
  approveAccount: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modal: PropTypes.shape({
    approveCallback: PropTypes.func.isRequired,
  }),
  continueDefault: PropTypes.bool,
}

export default ModalApproval
