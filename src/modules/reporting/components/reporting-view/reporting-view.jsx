import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'
import ReportingDisputeMarkets from 'modules/reporting/containers/reporting-dispute-markets'
import ReportingReportMarkets from 'modules/reporting/containers/reporting-report-markets'
import ReportingResolved from 'modules/reporting/containers/reporting-resolved'
import makePath from 'modules/routes/helpers/make-path'

import { REPORTING_DISPUTE_MARKETS, REPORTING_REPORT_MARKETS, REPORTING_RESOLVED_MARKETS } from 'modules/routes/constants/views'

const ReportingView = p => (
  <section>
    <Switch>
      <AuthenticatedRoute path={makePath(REPORTING_DISPUTE_MARKETS)} component={ReportingDisputeMarkets} />
      <AuthenticatedRoute path={makePath(REPORTING_REPORT_MARKETS)} component={ReportingReportMarkets} />
      <AuthenticatedRoute path={makePath(REPORTING_RESOLVED_MARKETS)} component={ReportingResolved} />
    </Switch>
  </section>
)

export default ReportingView
