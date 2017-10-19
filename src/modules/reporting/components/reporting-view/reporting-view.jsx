import React from 'react'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'

import ReportingOpen from 'modules/reporting/containers/reporting-open'
import ReportingClosed from 'modules/reporting/containers/reporting-closed'

import makePath from 'modules/routes/helpers/make-path'

import { REPORTING_OPEN, REPORTING_CLOSED } from 'modules/routes/constants/views'

const ReportingView = p => (
  <section>
    <AuthenticatedRoute path={makePath(REPORTING_OPEN)} exact component={ReportingOpen} />
    <AuthenticatedRoute path={makePath(REPORTING_CLOSED)} exact component={ReportingClosed} />
  </section>
)

export default ReportingView
