import React from 'react'

import PropTypes from 'prop-types'

import Styles from './reporting-dispute-no-rep-state.styles'

const ReportDisputeNoRepState = ({ message, onClickHandler, btnText='OK' }) => (
  <article className={Styles.ReportDisputeNoRep}>
    <span className={Styles.ReportDisputeNoRep__message}>{message}</span>
    <button className={Styles.ReportDisputeNoRep__cta} onClick={onClickHandler}>{btnText}</button>
  </article>
)

ReportDisputeNoRepState.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  btnText: PropTypes.string,
}

export default ReportDisputeNoRepState
