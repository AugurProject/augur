import React from 'react';
import ReactTooltip from 'react-tooltip';
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';

const MarketOutcomes = p => (
  <div className="market-preview-outcomes">
    {(p.outcomes || []).map((outcome, i) => (
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
    ))}
  </div>
);

// TODO -- Prop Validations
// MarketOutcomes.propTypes = {
//  outcomes: React.PropTypes.array
// };

export default MarketOutcomes;
