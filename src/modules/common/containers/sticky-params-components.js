import { withRouter, Link as OldLink, Redirect as OldRedirect } from 'react-router-dom'

import { StickyParamsHOC } from 'src/modules/common/components/sticky-params-hoc'
import { AUGUR_NODE_URL_PARAM, ETHEREUM_NODE_HTTP_URL_PARAM, ETHEREUM_NODE_WS_URL_PARAM } from 'src/modules/app/constants/endpoint-url-params'

const keysToMaintain = [
  AUGUR_NODE_URL_PARAM,
  ETHEREUM_NODE_HTTP_URL_PARAM,
  ETHEREUM_NODE_WS_URL_PARAM,
]

export const Link = withRouter((StickyParamsHOC(OldLink, keysToMaintain)))
export const Redirect = withRouter((StickyParamsHOC(OldRedirect, keysToMaintain)))
