import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { SigningPen } from 'modules/common/components/icons'
import { formatEther } from 'utils/format-number'
import Styles from 'modules/modal/components/modal-migrate-market/modal-migrate-market.styles'

export default class ModalMigrateMarket extends Component {

  static propTypes = {
    marketId: PropTypes.string.isRequired,
    marketDescription: PropTypes.string.isRequired,
    migrateMarketThroughFork: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      gasEstimate: '0.0023',
    }

    this.submitForm = this.submitForm.bind(this)
  }

  componentWillMount() {
    const {
      marketId,
      migrateMarketThroughFork,
    } = this.props
    migrateMarketThroughFork(marketId, true, (err, gasEstimate) => {
      if (!err && !!gasEstimate) this.setState({ gasEstimate })
    })
  }

  submitForm(e, ...args) {
    const {
      marketId,
      migrateMarketThroughFork,
    } = this.props
    e.preventDefault()
    migrateMarketThroughFork(marketId, false, (err, res) => {
      console.log('onSuccess for migrateMarketThroughFork', err, res)
    })
  }

  render() {
    const {
      closeModal,
      marketDescription,
    } = this.props
    const s = this.state

    return (
      <form
        className={Styles.ModalMigrateMarket__form}
        onSubmit={this.submitForm}
      >
        <h1 className={Styles.ModalMigrateMarket__heading}>
          {SigningPen} Migrate Market
        </h1>
        <div className={Styles.ModalMigrateMarket__details}>
          <ul className={Styles.ModalMigrateMarket__row}>
            <li>market</li>
            <li>{marketDescription}</li>
          </ul>
          <ul className={Styles.ModalMigrateMarket__row}>
            <li>gas</li>
            <li>{formatEther(s.gasEstimate).full}</li>
          </ul>
        </div>
        <div className={Styles.ModalMigrateMarket__actions}>
          <button
            className={Styles.ModalMigrateMarket__button}
            type="button"
            onClick={closeModal}
          >
            Back
          </button>
          <button
            className={Styles.ModalMigrateMarket__button}
            type="submit"
          >
            submit
          </button>
        </div>
      </form>
    )
  }
}
