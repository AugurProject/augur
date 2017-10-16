import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

// import CreateMarketMainTitle from 'modules/create-market/components/create-market-main-title'
import CreateMarketPreview from 'modules/create-market/components/create-market-preview/create-market-preview'
import CreateMarketForm from 'modules/create-market/components/create-market-form/create-market-form'
// import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons'

// import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'

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

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.newMarket.isValid !== nextProps.newMarket.isValid ||
  //     (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep && nextProps.newMarket.isValid) ||
  //     (this.props.newMarket.holdForUserAction !== nextProps.newMarket.holdForUserAction)
  //   ) {
  //     this.updateValidations(nextProps.newMarket.isValid, nextProps.newMarket.currentStep, nextProps.newMarket.holdForUserAction)
  //   }
  // }

  // updateValidations(isValid, currentStep, isHolding = false) {
  //   if (isValid && !isHolding) {
  //     this.props.addValidationToNewMarket(newMarketCreationOrder[currentStep])
  //   } else {
  //     this.props.removeValidationFromNewMarket(newMarketCreationOrder[currentStep])
  //   }
  // }

  render() {
    const p = this.props
    // const s = this.state

    return (
      <section className={Styles.CreateMarketView}>
        <Helmet>
          <title>Create Market</title>
        </Helmet>
        <div>
          <CreateMarketPreview
            newMarket={p.newMarket}

            updateNewMarket={p.updateNewMarket}
          />
          <CreateMarketForm
            newMarket={p.newMarket}
            updateNewMarket={p.updateNewMarket}
            categories={p.categories}
            isMobileSmall={p.isMobileSmall}
            submitNewMarket={p.submitNewMarket}
            history={p.history}

            universe={p.universe}
            availableEth={p.availableEth}
            addOrderToNewMarket={p.addOrderToNewMarket}
            removeOrderFromNewMarket={p.removeOrderFromNewMarket}
            updateValidations={this.updateValidations}
            addValidationToNewMarket={p.addValidationToNewMarket}
            removeValidationFromNewMarket={p.removeValidationFromNewMarket}
          />
        </div>
      </section>
    )
  }
}
