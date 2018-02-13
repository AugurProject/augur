import React from 'react'

import PropTypes from 'prop-types'

import Styles from './reporting-dispute-no-rep-state.styles'

const ReportDisputeNoRepState = ({ message, onClickHandler, btnText='OK' }) => (
  <article className={Styles.ReportDispute_noRepState}>
    <span >{message}</span>
    <button onClick={onClickHandler}>{btnText}</button>
  </article>
)

ReportDisputeNoRepState.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  btnText: PropTypes.string,
}

export default ReportDisputeNoRepState
