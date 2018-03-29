import React, { Component } from 'react'
import PropTypes from 'prop-types'

// TODO -- generalize modals where possible

import ModalLedger from 'modules/modal/components/modal-ledger/modal-ledger'
import ModalUport from 'modules/modal/components/modal-uport/modal-uport'
import ModalNetworkMismatch from 'modules/modal/components/modal-network-mismatch/modal-network-mismatch'
import ModalNetworkDisconnected from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected'
import ModalApproval from 'modules/modal/components/modal-approval/modal-approval'
import ModalEscapeHatch from 'modules/modal/components/modal-escape-hatch/modal-escape-hatch'
import ModalClaimReportingFees from 'modules/modal/components/modal-claim-reporting-fees/modal-claim-reporting-fees'
import ModalParticipate from 'modules/modal/containers/modal-participate'

import { Close } from 'modules/common/components/icons'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import * as TYPES from 'modules/modal/constants/modal-types'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

export default class ModalView extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      modalWidth: 0,
      modalHeight: 0,
    }

    this.updateModalDimensions = this.updateModalDimensions.bind(this)
    this.debounceUpdateModalDimensions = debounce(this.updateModalDimensions.bind(this))
  }

  componentDidMount() {
    this.updateModalDimensions()

    window.addEventListener('resize', this.debouncedSetQRSize)
  }

  updateModalDimensions() {
    this.setState({
      modalWidth: getValue(this, 'modal.clientWidth') || 0,
      modalHeight: getValue(this, 'modal.clientHeight') || 0,
    })
  }

  render() {
    const s = this.state
    const p = this.props
    // in place to keep big Cancel button func for ledger/uport
    const showBigCancel = p.modal.canClose && (p.modal.type === TYPES.MODAL_LEDGER || p.modal.type === TYPES.MODAL_UPORT)

    return (
      <section
        ref={(modal) => { this.modal = modal }}
        className={Styles.ModalView}
      >
        <div
          className={Styles.ModalView__content}
        >
          {p.modal.canClose && !showBigCancel &&
            <button
              className={Styles.ModalView__close}
              onClick={p.closeModal}
            >
              {Close}
            </button>
          }
          {p.modal.type === TYPES.MODAL_LEDGER &&
            <ModalLedger {...p.modal} />
          }
          {p.modal.type === TYPES.MODAL_UPORT &&
            <ModalUport
              {...p.modal}
              modalWidth={s.modalWidth}
              modalHeight={s.modalHeight}
            />
          }
          {p.modal.type === TYPES.MODAL_PARTICIPATE &&
            <ModalParticipate {...p} />
          }
          {p.modal.type === TYPES.MODAL_NETWORK_MISMATCH &&
            <ModalNetworkMismatch {...p.modal} />
          }
          {p.modal.type === TYPES.MODAL_NETWORK_DISCONNECTED &&
            <ModalNetworkDisconnected {...p} />
          }
          {p.modal.type === TYPES.MODAL_ACCOUNT_APPROVAL &&
            <ModalApproval {...p} />
          }
          {p.modal.type === TYPES.MODAL_ESCAPE_HATCH &&
            <ModalEscapeHatch {...p} />
          }
          {p.modal.type === TYPES.MODAL_CLAIM_REPORTING_FEES &&
            <ModalClaimReportingFees {...p.modal} />
          }
          {showBigCancel &&
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
  }
}
