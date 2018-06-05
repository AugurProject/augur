import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import CreateMarketPreview from 'modules/create-market/components/create-market-preview/create-market-preview'
import CreateMarketForm from 'modules/create-market/components/create-market-form/create-market-form'

import Styles from 'modules/create-market/components/create-market-view/create-market-view.styles'

const CreateMarketView = p => (
  <section className={Styles.CreateMarketView}>
    <Helmet>
      <title>Create Market</title>
    </Helmet>
    <div>
      <CreateMarketPreview
        newMarket={p.newMarket}
        currentTimestamp={p.currentTimestamp}
        universe={p.universe}
      />
      <CreateMarketForm
        newMarket={p.newMarket}
        updateNewMarket={p.updateNewMarket}
        categories={p.categories}
        meta={p.meta}
        availableEth={p.availableEth}
        availableRep={p.availableRep}
        addOrderToNewMarket={p.addOrderToNewMarket}
        removeOrderFromNewMarket={p.removeOrderFromNewMarket}
        submitNewMarket={p.submitNewMarket}
        isMobileSmall={p.isMobileSmall}
        history={p.history}
        universe={p.universe}
        isBugBounty={p.isBugBounty}
        currentTimestamp={p.currentTimestamp}
        estimateSubmitNewMarket={p.estimateSubmitNewMarket}
      />
    </div>
  </section>
)

CreateMarketView.propTypes = {
  currentTimestamp: PropTypes.number.isRequired,
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired,
  meta: PropTypes.object,
  history: PropTypes.object.isRequired,
  universe: PropTypes.object.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  estimateSubmitNewMarket: PropTypes.func.isRequired,
}

export default CreateMarketView
