import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Participate } from 'modules/common/components/icons'
import Styles from 'modules/modal/components/modal-participate/modal-participate.styles'
import Input from 'modules/common/components/input/input'

export default class ModalParticipate extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    rep: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      quantity: '',
    }

    this.submitForm = this.submitForm.bind(this)
    this.handleMaxClick = this.handleMaxClick.bind(this)
  }

  submitForm(e, ...args) {
    e.preventDefault()
    console.log('form submit (NYI)', args, this.state)
  }

  updateField(field, value, ...args) {
    this.setState({ [field]: value })
  }

  handleMaxClick() {
    this.setState({ quantity: this.props.rep })
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
            <Input
              id="modal__participate-quantity"
              type="text"
              className={Styles.ModalParticipate__input}
              value={s.quantity}
              placeholder="0.0"
              onChange={value => this.updateField('quantity', value)}
              maxButton
              onMaxButtonClick={() => this.handleMaxClick()}
            />
          </label>
          <div className={Styles['ModalParticipate__form-actions']}>
            <button className={Styles.ModalParticipate__button} onClick={() => p.closeModal()}>Cancel</button>
            <button className={Styles.ModalParticipate__button} type="submit">Review</button>
          </div>
        </form>
      </section>
    )
  }
}
