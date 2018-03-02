import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'


import Styles from 'modules/reporting/components/reporting-resolved/reporting-resolved.styles'

export default class ReportingResolved extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Resolved</title>
        </Helmet>
        <h2 className={Styles.ReportingResolved__heading}>Resolved</h2>
      </section>
    )
  }
}
