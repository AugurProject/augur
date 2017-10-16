import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import CreateMarketPreview from 'modules/create-market/components/create-market-preview/create-market-preview'
import CreateMarketForm from 'modules/create-market/components/create-market-form/create-market-form'

import Styles from 'modules/create-market/components/create-market-view/create-market-view.styles'

export default class CreateMarketView extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    addValidationToNewMarket: PropTypes.func.isRequired,
    removeValidationFromNewMarket: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.CreateMarketView}>
        <Helmet>
          <title>Create Market</title>
        </Helmet>
        <div>
          <CreateMarketPreview
            newMarket={p.newMarket}
          />
          <CreateMarketForm
            newMarket={p.newMarket}
            updateNewMarket={p.updateNewMarket}
            categories={p.categories}
            availableEth={p.availableEth}
            addOrderToNewMarket={p.addOrderToNewMarket}
            removeOrderFromNewMarket={p.removeOrderFromNewMarket}
            submitNewMarket={p.submitNewMarket}
            isMobileSmall={p.isMobileSmall}
            history={p.history}
          />
        </div>
      </section>
    )
  }
}
