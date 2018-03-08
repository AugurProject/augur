import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Participate } from 'modules/common/components/icons'
import Styles from 'modules/modal/components/modal-participate/modal-participate.styles'

export default class ModalParticipate extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      quantity: '',
    }

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm(e, ...args) {
    e.preventDefault()
    console.log('form submit (NYI)', args, this.state)
  }

  updateField(field, value, ...args) {
    this.setState({ [field]: value })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section className={Styles.ModalParticipate}>
        <h1 className={Styles.ModalParticipate__heading}>{Participate()} Buy Participation Tokens</h1>
        <span className={Styles.ModalParticipate__helperText}>Purchase participation tokens to earn a share of the reporting fees collected during this dispute window.</span>
        <form
          className={Styles.ModalParticipate__form}
          onSubmit={this.submitForm}
        >
          <label htmlFor="modal__participate-quantity">
            Quantity (1 token @ 1 REP)
            <input
              id="modal__participate-quantity"
              type="text"
              className={Styles.ModalParticipate__input}
              value={s.quantity}
              placeholder="0.0"
              onChange={e => this.updateField('quantity', e.target.value)}
            />
          </label>
          <div className={Styles['ModalParticipate__form-actions']}>
            <button onClick={() => p.closeModal()}>Cancel</button>
            <button type="submit">Review</button>
          </div>
        </form>
      </section>
    )
  }
}
