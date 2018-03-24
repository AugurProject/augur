import React from 'react'
import PropTypes from 'prop-types'

import { SigningPen } from 'modules/common/components/icons'
import { formatRep, formatEther } from 'utils/format-number'
import Styles from 'modules/modal/components/modal-migrate-market/modal-migrate-market.styles'

const ModalMigrateMarket = (p) => {
  const cleanQuantity = formatRep(p.quantity)

  return (
    <form
      className={Styles.ModalMigrateMarket__form}
      onSubmit={p.onSubmit}
    >
      <h1 className={Styles.ModalMigrateMarket__heading}>{SigningPen} Migrate Market</h1>
      <div className={Styles.ModalMigrateMarket__details}>
        <ul className={Styles.ModalMigrateMarket__labels}>
          <li>market</li>
          <li>gas</li>
        </ul>
        <ul className={Styles.ModalMigrateMarket__values}>
          <li>{p.marketDescription}</li>
          <li>{formatEther(p.gasEstimate).full}</li>
        </ul>
      </div>
      <div className={Styles.ModalMigrateMarket__actions}>
        <button
          className={Styles.ModalMigrateMarket__button}
          type="button"
          onClick={p.switchPages}
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

ModalMigrateMarket.propTypes = {
  quantity: PropTypes.string.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  switchPages: PropTypes.func.isRequired,
}

export default ModalMigrateMarket
