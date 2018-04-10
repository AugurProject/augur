import React from 'react'

import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import MarketPreview from 'src/modules/reporting/containers/market-preview'
import Styles from './reporting-report-markets.styles'

export const NoMarketsFound = ({ message }) => (
  <article className={Styles.NoMarketsFound}>
    <section className={Styles.NoMarketsFound__message}>{message}</section>
  </article>
)

NoMarketsFound.propTypes = {
  message: PropTypes.string.isRequired,
}

export const ReportSection = ({
  title, items, emptyMessage,
}) => {
  let theChildren
  if (items.length === 0) {
    theChildren = <NoMarketsFound message={emptyMessage} key={title} />
  } else {
    theChildren = items.map(item => (<MarketPreview key={item.id} {...item} />))
  }

  return (
    <article className={Styles.ReportSection}>
      <h4 className={Styles.ReportSection__heading}>{title}</h4>
      <section>
        {theChildren}
      </section>
    </article>
  )
}

ReportSection.propTypes = {
  emptyMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
}

class ReportingReporting extends React.Component {
  componentDidMount() {
    const { loadReporting } = this.props
    loadReporting()
  }

  render() {
    const { markets } = this.props
    const {
      designated,
      open,
      upcoming,
    } = markets

    return (
      <section>
        <Helmet>
          <title>Reporting: Markets</title>
        </Helmet>
        <ReportingHeader
          heading="Markets"
        />
        <ReportSection title="Designated Reporting" items={designated} emptyMessage="There are no markets available for you to report on. " />
        <ReportSection title="Open Reporting" items={open} emptyMessage="There are no markets in Open Reporting." />
        <ReportSection title="Upcoming Reporting" items={upcoming} buttonText="View" emptyMessage="There are no upcoming markets for you to report on." />
      </section>
    )
  }
}

ReportingReporting.propTypes = {
  markets: PropTypes.object.isRequired,
  loadReporting: PropTypes.func.isRequired,
}

export default ReportingReporting
