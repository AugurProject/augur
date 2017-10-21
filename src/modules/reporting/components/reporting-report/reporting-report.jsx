import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import MarketPreview from 'modules/market/components/market-preview/market-preview'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/reporting/components/reporting-report/reporting-report.styles'
import FormStyles from 'modules/common/less/form'

export default class ReportingReport extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      isFormValid: false,
      isMarketValid: null,
      selectedOutcome: null,
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
  }

  prevPage() {
    const newStep = this.state.currentStep <= 0 ? 0 : this.state.currentStep - 1
    this.setState({ currentStep: newStep })
  }

  nextPage() {
    const newStep = this.state.currentStep >= 1 ? 1 : this.state.currentStep + 1
    this.setState({ currentStep: newStep })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Submit Report</title>
        </Helmet>
        <MarketPreview
          {...p.market}
          isLogged={p.isLogged}
          location={p.location}
          history={p.history}
          style="single-card"
        />
        <article className={FormStyles.Form}>
          { s.currentStep === 0 &&
            <ul className={classNames(Styles.ReportingReport__fields, FormStyles.Form__fields)}>
              { p.market.extraInf &&
                <li>
                  <label>
                    <span>Market Details</span>
                  </label>
                  <p>{ p.market.extraInfo }</p>
                </li>
              }
              <li>
                <label>
                  <span>Resolution Source</span>
                </label>
                <p>Outcome will be detailed on a public website: <a href="http://www.example.com" target="_blank">http://www.example.com</a></p>
              </li>
              <li>
                <label>
                  <span>Is Market Valid?</span>
                </label>
                <ul className={FormStyles['Form__radio-buttons--per-line']}>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.isMarketValid === true })}
                      onClick={(e) => { this.setState({ isMarketValid: true }) }}
                    >Yes</button>
                  </li>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.isMarketValid === false })}
                      onClick={(e) => { this.setState({ isMarketValid: false }) }}
                    >No</button>
                  </li>
                </ul>
              </li>
              { s.isMarketValid && p.market.type === BINARY &&
                <li>
                  <label>
                    <span>Outcome</span>
                  </label>
                  <ul className={FormStyles['Form__radio-buttons--per-line']}>
                    <li>
                      <button
                        className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === 'yes' })}
                        onClick={(e) => { this.setState({ selectedOutcome: 'yes' }) }}
                      >Yes</button>
                    </li>
                    <li>
                      <button
                        className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === 'no' })}
                        onClick={(e) => { this.setState({ selectedOutcome: 'no' }) }}
                      >No</button>
                    </li>
                  </ul>
                </li>
              }
              { s.isMarketValid && p.market.type === CATEGORICAL &&
                <li>
                  <label>
                    <span>Outcome</span>
                  </label>
                  <ul className={FormStyles['Form__radio-buttons--per-line']}>
                    { p.market.outcomes && p.market.outcomes.map(outcome => (
                      <li key={outcome.id}>
                        <button
                          className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === outcome.name })}
                          onClick={(e) => { this.setState({ selectedOutcome: outcome.name }) }}
                        >{outcome.name}</button>
                      </li>
                      ))
                    }
                  </ul>
                </li>
              }
              { s.isMarketValid && p.market.type === SCALAR &&
                <li className={FormStyles['field--short']}>
                  <label>
                    <span htmlFor="sr__input--outcome-scalar">Outcome</span>
                  </label>
                  <input
                    id="sr__input--outcome-scalar"
                    type="number"
                    min={p.market.minValue}
                    max={p.market.maxValue}
                    placeholder="0"
                  />
                </li>
              }
              <li className={FormStyles['field--short']}>
                <label>
                  <span htmlFor="sr__input--stake">Amount to Stake</span>
                </label>
                <input
                  id="sr__input--stake"
                  type="number"
                  min="0"
                  placeholder="0.0000 REP"
                />
              </li>
            </ul>
          }
          { s.currentStep === 1 &&
            <span>Hello this is page 2</span>
          }
          <div className={FormStyles.Form__navigation}>
            <button
              className={classNames(FormStyles.Form__prev, { [`${FormStyles['hide-button']}`]: s.currentStep === 0 })}
              onClick={this.prevPage}
            >Previous</button>
            <button
              className={classNames(FormStyles.Form__next, { [`${FormStyles['hide-button']}`]: s.currentStep === 1 })}
              disabled={!s.isFormValid}
              onClick={s.isFormValid && this.nextPage}
            >Report</button>
          </div>
        </article>
      </section>
    )
  }
}
