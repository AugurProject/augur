import React from 'react'
import PropTypes from 'prop-types'

import ModalLedger from 'modules/modal/containers/modal-ledger'

import { MODAL_LEDGER } from 'modules/modal/constants/modal-types'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

const ModalView = p => (
  <section
    className={Styles.ModalView}
  >
    <div
      className={Styles.ModalView__content}
    >
      {p.modal.type === MODAL_LEDGER &&
        <ModalLedger />
      }
    </div>
  </section>
)

export default ModalView

ModalView.propTypes = {
  modal: PropTypes.object.isRequired
}
