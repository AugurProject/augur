import React from 'react'
import PropTypes from 'prop-types'

import ModalLedger from 'modules/modal/components/modal-ledger/modal-ledger'
import ModalUport from 'modules/modal/components/modal-uport/modal-uport'

import { MODAL_LEDGER, MODAL_UPORT } from 'modules/modal/constants/modal-types'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

const ModalView = p => (
  <section
    className={Styles.ModalView}
  >
    <div
      className={Styles.ModalView__content}
    >
      {p.modal.type === MODAL_LEDGER &&
        <ModalLedger {...p.modal} />
      }
      {p.modal.type === MODAL_UPORT &&
        <ModalUport {...p.modal} />
      }
      {p.modal.canClose &&
        <button
          className={Styles.ModalView__button}
          onClick={p.closeModal}
        >
          Close
        </button>
      }
    </div>
  </section>
)

export default ModalView

ModalView.propTypes = {
  modal: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
}
