import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getValue from 'utils/get-value'

import Styles from 'modules/create-market/components/create-market-preview-categorical/create-market-preview-categorical.styles'

const CategoricalOutcome = ({ className, outcome }) => (
  <div className={className || Styles.MarketPreviewCategorical__outcome}>
    <span className={Styles['MarketPreviewCategorical__outcome-name']}>
      {outcome.name}
    </span>
    <span className={Styles['MarketPreviewCategorical__outcome-value']}>
      {getValue(outcome, 'lastPricePercent.full')}
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
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { outcomes } = this.props.newMarket
    const totalOutcomes = outcomes.length

    const displayShowMore = totalOutcomes > 3
    const showMoreText = this.state.isOpen ? `- ${totalOutcomes - 3} less` : `+ ${totalOutcomes - 3} more`

    const outcomeWrapperStyle = {
      minHeight: this.state.outcomeWrapperHeight
    }

    return (
      <div
        className={Styles.MarketPreviewCategorical}
        style={outcomeWrapperStyle}
      >
        { outcomes.length > 0 &&
          <CategoricalOutcome
            className={Styles['MarketPreviewCategorical__height-sentinel']}
            outcome={outcomes[0]}
          />
        }
        <div
          className={classNames(Styles['MarketPreviewCategorical__outcomes-container'], {
            [`${Styles['show-more']}`]: displayShowMore
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
            {outcomes.length > 0 && outcomes.map(outcome => (
              <CategoricalOutcome
                key={outcome.id}
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
  newMarket: PropTypes.object.isRequired
}

CategoricalOutcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default MarketPreviewCategorical
