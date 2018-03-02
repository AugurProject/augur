import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'
import ReportingDispute from 'modules/reporting/containers/reporting-dispute'
import ReportingReporting from 'modules/reporting/containers/reporting-reporting'
import ReportingResolved from 'modules/reporting/containers/reporting-resolved'
import makePath from 'modules/routes/helpers/make-path'

import { REPORTING_DISPUTE, REPORTING_REPORTING, REPORTING_RESOLVED } from 'modules/routes/constants/views'

const ReportingView = p => (
  <section>
    <Switch>
      <AuthenticatedRoute path={makePath(REPORTING_DISPUTE)} component={ReportingDispute} />
      <AuthenticatedRoute path={makePath(REPORTING_REPORTING)} component={ReportingReporting} />
      <AuthenticatedRoute path={makePath(REPORTING_RESOLVED)} component={ReportingResolved} />
    </Switch>
  </section>
)

export default ReportingView
