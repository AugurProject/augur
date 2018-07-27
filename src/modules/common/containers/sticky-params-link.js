import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { StickyParamsLink } from 'src/modules/common/components/sticky-params-link'
import { AUGUR_NODE_URL_PARAM, ETHEREUM_NODE_HTTP_URL_PARAM, ETHEREUM_NODE_WS_URL_PARAM } from 'src/modules/app/constants/endpoint-url-params'

const mapStateToProps = state => ({
  keysToMaintain: [AUGUR_NODE_URL_PARAM, ETHEREUM_NODE_HTTP_URL_PARAM, ETHEREUM_NODE_WS_URL_PARAM],
})

export const Link = withRouter(connect(mapStateToProps)(StickyParamsLink))
