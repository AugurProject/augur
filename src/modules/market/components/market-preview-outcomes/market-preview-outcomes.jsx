import React from 'react'
// import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';

import Styles from 'modules/market/components/market-preview-outcomes/market-preview-outcomes.styles'

const MarketOutcomes = p => (
  <div className={Styles.MarketOutcomes}>
    <div className={Styles.MarketOutcomes__range}></div>
    <span className={Styles.MarketOutcomes__min}>0%</span>
    <span className={Styles.MarketOutcomes__max}>100%</span>
    <span className={Styles.MarketOutcomes__current}>
      <span className={Styles['MarketOutcomes__current-value']}>60</span>
      <span className={Styles['MarketOutcomes__current-denomination']}>%</span>
    </span>
  </div>
)

// TODO -- Prop Validations
// MarketOutcomes.propTypes = {
//  outcomes: React.PropTypes.array
// };

/* {(p.outcomes || []).map((outcome, i) => (
  <div
    key={outcome.id}
    className="outcome"
  >
    {!!outcome.lastPricePercent &&
      <ValueDenomination
        className="outcome-price"
        {...outcome.lastPricePercent}
        formatted={outcome.lastPricePercent.rounded}
        formattedValue={outcome.lastPricePercent.roundedValue}
      />
    }
    <span
      data-tip
      data-for={`outcome-name-tooltip-${outcome.marketID}-${outcome.id}`}
      data-event="click focus"
      className="outcome-name"
    >
      {outcome.name}
    </span>
    <ReactTooltip
      id={`outcome-name-tooltip-${outcome.marketID}-${outcome.id}`}
      type="dark"
      effect="float"
      place="top"
      globalEventOff="click"
    >
      <span
        data-tip
        data-for={`outcome-name-tooltip-${outcome.marketID}-${outcome.id}`}
        data-event="click focus"
        className="tooltip-text"
      >
        {outcome.name}
      </span>
    </ReactTooltip>
  </div>
))} */

export default MarketOutcomes
