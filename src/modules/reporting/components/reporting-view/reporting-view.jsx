import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'

import ReportingOpen from 'modules/reporting/containers/reporting-open'
import ReportingClosed from 'modules/reporting/containers/reporting-closed'
import ReportingReport from 'modules/reporting/containers/reporting-report'

import makePath from 'modules/routes/helpers/make-path'

import { REPORTING_OPEN, REPORTING_CLOSED, REPORTING_REPORT, REPORTING_DISPUTE } from 'modules/routes/constants/views'

const ReportingView = p => (
  <section>
    <Switch>
      <AuthenticatedRoute path={makePath(REPORTING_OPEN)} component={ReportingOpen} />
      <AuthenticatedRoute path={makePath(REPORTING_CLOSED)} component={ReportingClosed} />
      <AuthenticatedRoute path={makePath(REPORTING_REPORT)} component={ReportingReport} />
      <AuthenticatedRoute path={makePath(REPORTING_DISPUTE)} component={ReportingReport} />
    </Switch>
  </section>
)

export default ReportingView
