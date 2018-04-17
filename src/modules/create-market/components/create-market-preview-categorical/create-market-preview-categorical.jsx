/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as order remains the same

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/create-market/components/create-market-preview-categorical/create-market-preview-categorical.styles'

const CategoricalOutcome = ({ className, outcome }) => (
  <div className={className || Styles.MarketPreviewCategorical__outcome}>
    <span className={Styles['MarketPreviewCategorical__outcome-name']}>
      {outcome}
    </span>
  </div>
)

class MarketPreviewCategorical extends Component {
  constructor(props) {
    super(props)

    this.state = {
      outcomeWrapperHeight: 0,
      isOpen: false,
    }

    this.showMore = this.showMore.bind(this)
  }

  showMore() {
    const outcomeWrapperHeight = this.state.isOpen ? 0 : `${this.outcomeTable.clientHeight}px`

    this.setState({
      outcomeWrapperHeight,
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    const { newMarket } = this.props
    const { outcomes } = newMarket
    const cleanedOutcomes = outcomes.filter(outcome => outcome !== '')
    const totalOutcomes = cleanedOutcomes.length

    const displayShowMore = totalOutcomes > 3
    const showMoreText = this.state.isOpen ? `- ${totalOutcomes - 3} less` : `+ ${totalOutcomes - 3} more`

    const outcomeWrapperStyle = {
      minHeight: this.state.outcomeWrapperHeight,
    }

    return (
      <div
        className={Styles.MarketPreviewCategorical}
        style={outcomeWrapperStyle}
      >
        { cleanedOutcomes.length > 0 &&
          <CategoricalOutcome
            className={Styles['MarketPreviewCategorical__height-sentinel']}
            outcome={cleanedOutcomes[0]}
          />
        }
        <div
          className={classNames(Styles['MarketPreviewCategorical__outcomes-container'], {
            [`${Styles['show-more']}`]: displayShowMore,
          })}
        >
          { displayShowMore &&
            <button
              className={Styles['MarketPreviewCategorical__show-more']}
              onClick={this.showMore}
            >
              { showMoreText }
            </button>
          }
          <div
            ref={(outcomeTable) => { this.outcomeTable = outcomeTable }}
            className={Styles.MarketPreviewCategorical__outcomes}
          >
            {cleanedOutcomes.length > 0 && cleanedOutcomes.map((outcome, i) => (
              <CategoricalOutcome
                key={i}
                outcome={outcome}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

MarketPreviewCategorical.propTypes = {
  newMarket: PropTypes.object.isRequired,
}

CategoricalOutcome.propTypes = {
  outcome: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default MarketPreviewCategorical
