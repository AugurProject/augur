import React from 'react'
import PropTypes from 'prop-types'

import { SigningPen } from 'modules/common/components/icons'
import { formatRep, formatEther } from 'utils/format-number'
import Styles from 'modules/modal/components/modal-participate-review/modal-participate-review.styles'

const ModalParticipateReview = (p) => {
  const cleanQuantity = formatRep(p.quantity)

  return (
    <form
      className={Styles.ModalParticipateReview__form}
      onSubmit={p.onSubmit}
    >
      <div className={Styles.ModalParticipateReview__heading}>
        {SigningPen}
        <h1>Review Buy Order</h1>
      </div>
      <div className={Styles.ModalParticipateReview__details}>
        <ul className={Styles.ModalParticipateReview__labels}>
          <li>purchase</li>
          <li>quantity</li>
          <li>price</li>
          <li>gas</li>
        </ul>
        <ul className={Styles.ModalParticipateReview__values}>
          <li>Participation Tokens</li>
          <li>{cleanQuantity.formatted}</li>
          <li>{cleanQuantity.full}</li>
          <li>{formatEther(p.gasEstimate).full}</li>
        </ul>
      </div>
      <div className={Styles.ModalParticipateReview__actions}>
        <button
          className={Styles.ModalParticipateReview__button}
          type="button"
          onClick={p.switchPages}
        >
          Back
        </button>
        <button
          className={Styles.ModalParticipateReview__button}
          type="submit"
        >
          submit
        </button>
      </div>
    </form>
  )
}

ModalParticipateReview.propTypes = {
  quantity: PropTypes.string.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  switchPages: PropTypes.func.isRequired,
}

export default ModalParticipateReview
