import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'


export default class PortfolioReports extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
  }

  componentWillMount() {

  }

  render() {

    return (
      <section>
        <Helmet>
          <title>Reporting</title>
        </Helmet>

      </section>
    )
  }
}
