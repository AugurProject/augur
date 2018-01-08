import React, { Component } from 'react'
// import PropTypes from 'proptypes'
// import { Switch, Route } from 'react-router-dom'

// import parseQuery from 'modules/routes/helpers/parse-query'
// import makeQuery from 'modules/routes/helpers/make-query'

import ModalLedger from 'modules/modal/containers/modal-ledger'
import ParamsRoute from 'modules/routes/components/params-route/params-route'

// import { MODAL_PARAM_NAME } from 'modules/routers/constants/param-names'

import Styles from 'modules/modal/components/modal-view/modal-view.styles'

export default class ModalView extends Component {
  constructor(props) {
    super(props)

    // this.updateIsModalVisible = this.updateIsModalVisible.bind(this)
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  // isModalVisible() {
  //   // TODO -- determine
  //   // this.props.updateIsModalVisible(isModalVisible)
  // }

  render() {
    return (
      <section
        className={Styles.ModalView}
      >
        <div
          className={Styles.ModalView__content}
        >
          <ParamsRoute
            component={ModalLedger}
            params={{ test: 'test', aight: 'dood' }}
          />
        </div>
      </section>
    )
  }
}
