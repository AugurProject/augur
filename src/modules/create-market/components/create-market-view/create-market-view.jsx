import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

// import CreateMarketMainTitle from 'modules/create-market/components/create-market-main-title'
import CreateMarketPreview from 'modules/create-market/components/create-market-preview/create-market-preview'
import CreateMarketForm from 'modules/create-market/components/create-market-form/create-market-form'
// import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'

export default class CreateMarketView extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    addValidationToNewMarket: PropTypes.func.isRequired,
    removeValidationFromNewMarket: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      buttonHeight: 0
    }

    this.updateValidations = this.updateValidations.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.isValid !== nextProps.newMarket.isValid ||
      (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep && nextProps.newMarket.isValid) ||
      (this.props.newMarket.holdForUserAction !== nextProps.newMarket.holdForUserAction)
    ) {
      this.updateValidations(nextProps.newMarket.isValid, nextProps.newMarket.currentStep, nextProps.newMarket.holdForUserAction)
    }
  }

  updateValidations(isValid, currentStep, isHolding = false) {
    if (isValid && !isHolding) {
      this.props.addValidationToNewMarket(newMarketCreationOrder[currentStep])
    } else {
      this.props.removeValidationFromNewMarket(newMarketCreationOrder[currentStep])
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section>
        <Helmet>
          <title>Create Market</title>
        </Helmet>
        <div>
          {/* <CreateMarketMainTitle
            type={p.newMarket.type}
            validations={p.newMarket.validations}
            currentStep={p.newMarket.currentStep}
            updateNewMarket={p.updateNewMarket}
            clearNewMarket={p.clearNewMarket}
          /> */}
          <CreateMarketPreview
            newMarket={p.newMarket}
            updateNewMarket={p.updateNewMarket}
          />
          <CreateMarketForm
            branch={p.branch}
            availableEth={p.availableEth}
            newMarket={p.newMarket}
            buttonHeight={s.buttonHeight}
            addOrderToNewMarket={p.addOrderToNewMarket}
            removeOrderFromNewMarket={p.removeOrderFromNewMarket}
            updateNewMarket={p.updateNewMarket}
            updateValidations={this.updateValidations}
            addValidationToNewMarket={p.addValidationToNewMarket}
            removeValidationFromNewMarket={p.removeValidationFromNewMarket}
          />
          {/*<CreateMarketFormButtons
            footerHeight={p.footerHeight}
            currentStep={p.newMarket.currentStep}
            type={p.newMarket.type}
            isValid={p.newMarket.isValid}
            holdForUserAction={p.newMarket.holdForUserAction}
            validations={p.newMarket.validations}
            newMarket={p.newMarket}
            updateNewMarket={p.updateNewMarket}
            submitNewMarket={p.submitNewMarket}
            history={p.history}
            updateButtonHeight={buttonHeight => this.setState({ buttonHeight })}
            updateValidations={this.updateValidations}
          /> */}
        </div>
      </section>
    )
  }
}

CreateMarketView.propTypes = {

}
