import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Styles from 'modules/reporting/components/reporting-view/reporting-view.styles'

export default class ReportingView extends Component {
  static propTypes = {
    marketsReporting: PropTypes.array.isRequired,
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section className={Styles.Reporting}>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
      </section>
    )
  }
}
