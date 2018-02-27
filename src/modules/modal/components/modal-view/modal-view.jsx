import React, { Component } from 'react'
import PropTypes from 'prop-types'

// TODO -- generalize modals where possible

import ModalLedger from 'modules/modal/components/modal-ledger/modal-ledger'
import ModalUport from 'modules/modal/components/modal-uport/modal-uport'
import ModalNetworkMismatch from 'modules/modal/components/modal-network-mismatch/modal-network-mismatch'
import ModalNetworkDisconnected from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected'
import ModalEscapeHatch from 'modules/modal/components/modal-escape-hatch/modal-escape-hatch'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import { MODAL_LEDGER, MODAL_UPORT, MODAL_NETWORK_MISMATCH, MODAL_NETWORK_DISCONNECTED, MODAL_ESCAPE_HATCH } from 'modules/modal/constants/modal-types'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

export default class ModalView extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      modalWidth: 0,
      modalHeight: 0
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
      modalHeight: getValue(this, 'modal.clientHeight') || 0
    })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section
        ref={(modal) => { this.modal = modal }}
        className={Styles.ModalView}
      >
        <div
          className={Styles.ModalView__content}
        >
          {p.modal.type === MODAL_LEDGER &&
            <ModalLedger {...p.modal} />
          }
          {p.modal.type === MODAL_UPORT &&
            <ModalUport
              {...p.modal}
              modalWidth={s.modalWidth}
              modalHeight={s.modalHeight}
            />
          }
          {p.modal.type === MODAL_NETWORK_MISMATCH &&
            <ModalNetworkMismatch {...p.modal} />
          }
          {p.modal.type === MODAL_NETWORK_DISCONNECTED &&
            <ModalNetworkDisconnected {...p} />
          }
          {p.modal.type === MODAL_ESCAPE_HATCH &&
            <ModalEscapeHatch {...p} />
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
  }
}
