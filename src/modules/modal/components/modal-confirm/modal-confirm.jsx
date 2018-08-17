import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/modal/components/modal-confirm/modal-confirm.styles'

const ModalConfirm = p => (
  <section className={Styles.ModalConfirm}>
    <h1>{p.modal.title}</h1>
    <p>{p.modal.description}</p>
    <div className={Styles.ModalConfirm__ActionButtons}>
      <button
        className={Styles.ModalConfirm__cancel}
        onClick={p.closeModal}
      >
        {p.modal.cancelButtonText}
      </button>
      <button
        className={Styles.ModalConfirm__submit}
        onClick={(e) => {
          if (!p.continueDefault) e.preventDefault()
          p.modal.submitAction()
          p.closeModal()
        }}
      >
        {p.modal.submitButtonText}
      </button>
    </div>
  </section>
)

ModalConfirm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  submitAction: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  continueDefault: PropTypes.bool,
}

export default ModalConfirm
