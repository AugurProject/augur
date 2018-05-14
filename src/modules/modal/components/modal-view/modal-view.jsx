import React, { Component } from 'react'
import PropTypes from 'prop-types'

// TODO -- generalize modals where possible

import ModalLedger from 'modules/modal/components/modal-ledger/modal-ledger'
import ModalUport from 'modules/modal/components/modal-uport/modal-uport'
import ModalNetworkMismatch from 'modules/modal/components/modal-network-mismatch/modal-network-mismatch'
import ModalNetworkDisabled from 'modules/modal/components/modal-network-disabled/modal-network-disabled'
import ModalNetworkDisconnected from 'modules/modal/containers/modal-network-disconnected'
import ModalApproval from 'modules/modal/containers/modal-approval'
import ModalEscapeHatch from 'modules/modal/components/modal-escape-hatch/modal-escape-hatch'
import ModalClaimReportingFeesForkedMarket from 'modules/modal/containers/modal-claim-reporting-fees-forked-market'
import ModalClaimReportingFeesNonforkedMarkets from 'modules/modal/containers/modal-claim-reporting-fees-nonforked-markets'
import ModalParticipate from 'modules/modal/containers/modal-participate'
import ModalMigrateMarket from 'modules/modal/containers/modal-migrate-market'
import ModalNetworkConnect from 'modules/modal/containers/modal-network-connect'
import ModalDisclaimer from 'modules/modal/containers/modal-disclaimer'

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
    const {
      closeModal,
      modal,
    } = this.props
    const s = this.state
    // in place to keep big Cancel button func for ledger/uport
    const showBigCancel = modal.canClose && (modal.type === TYPES.MODAL_LEDGER || modal.type === TYPES.MODAL_UPORT)

    return (
      <section
        ref={(modal) => { this.modal = modal }}
        className={Styles.ModalView}
      >
        <div
          className={Styles.ModalView__content}
        >
          {modal.canClose && !showBigCancel &&
            <button
              className={Styles.ModalView__close}
              onClick={closeModal}
            >
              {Close}
            </button>
          }
          {modal.type === TYPES.MODAL_LEDGER &&
            <ModalLedger {...modal} />
          }
          {modal.type === TYPES.MODAL_UPORT &&
            <ModalUport
              {...modal}
              modalWidth={s.modalWidth}
              modalHeight={s.modalHeight}
            />
          }
          {modal.type === TYPES.MODAL_PARTICIPATE &&
            <ModalParticipate {...this.props} />
          }
          {modal.type === TYPES.MODAL_NETWORK_MISMATCH &&
            <ModalNetworkMismatch {...modal} />
          }
          {modal.type === TYPES.MODAL_NETWORK_DISABLED &&
            <ModalNetworkDisabled {...modal} />
          }
          {modal.type === TYPES.MODAL_NETWORK_CONNECT &&
            <ModalNetworkConnect />
          }
          {modal.type === TYPES.MODAL_NETWORK_DISCONNECTED &&
            <ModalNetworkDisconnected {...this.props} />
          }
          {modal.type === TYPES.MODAL_ACCOUNT_APPROVAL &&
            <ModalApproval {...this.props} />
          }
          {modal.type === TYPES.MODAL_ESCAPE_HATCH &&
            <ModalEscapeHatch {...this.props} />
          }
          {modal.type === TYPES.MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET &&
            <ModalClaimReportingFeesForkedMarket {...modal} />
          }
          {modal.type === TYPES.MODAL_CLAIM_REPORTING_FEES_NONFORKED_MARKETS &&
            <ModalClaimReportingFeesNonforkedMarkets {...modal} />
          }
          {modal.type === TYPES.MODAL_MIGRATE_MARKET &&
            <ModalMigrateMarket
              {...modal}
              closeModal={closeModal}
            />
          }
          {modal.type === TYPES.MODAL_DISCLAIMER &&
            <ModalDisclaimer {...modal} />
          }
          {showBigCancel &&
            <button
              className={Styles.ModalView__button}
              onClick={closeModal}
            >
              Close
            </button>
          }
        </div>
      </section>
    )
  }
}
