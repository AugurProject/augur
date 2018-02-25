import React from 'react'

import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import MarketPreview from 'src/modules/reporting/containers/market-preview'
import MarketsHeaderStyles from 'modules/markets/components/markets-header/markets-header.styles'

import Styles from './reporting-reporting.styles'

export const NoMarketsFound = ({ message }) => (
  <article className={Styles.NoMarketsFound}>
    <section className={Styles.NoMarketsFound__message}>{message}</section>
  </article>
)

NoMarketsFound.propTypes = {
  message: PropTypes.string.isRequired,
}

export const ReportSection = ({
  title, items, buttonText='Report', emptyMessage
}) => {
  let theChildren
  if (items.length === 0) {
    theChildren = <NoMarketsFound message={emptyMessage} />
  } else {
    theChildren = items.map(item => (<MarketPreview key={item.id} buttonText={buttonText} {...item} />))
  }

  return (
    <article>
      <article className={MarketsHeaderStyles.MarketsHeader}>
        <div className={MarketsHeaderStyles.MarketsHeader__wrapper}>
          <h4 className={MarketsHeaderStyles.MarketsHeader__subheading}>{title}</h4>
        </div>
      </article>
      <section>
        {theChildren}
      </section>
    </article>
  )
}

ReportSection.propTypes = {
  buttonText: PropTypes.string,
  emptyMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
}

class ReportingReporting extends React.Component {
  componentDidMount() {
    this.props.loadReporting()
  }

  render() {
    const {
      designated,
      open,
      upcoming,
    } = this.props.markets

    return (
      <section>
        <Helmet>
          <title>Reporting: Markets</title>
        </Helmet>
        <article className={MarketsHeaderStyles.MarketsHeader}>
          <div className={MarketsHeaderStyles.MarketsHeader__search} />
          <div className={MarketsHeaderStyles.MarketsHeader__wrapper}>
            <h1 className={MarketsHeaderStyles.MarketsHeader__heading}>Reporting: Markets</h1>
          </div>
        </article>
        <ReportSection title="Designated Reporting" items={designated} emptyMessage="There are currently no markets available for you to report on. " />
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
