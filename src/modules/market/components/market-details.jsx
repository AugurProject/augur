import React from 'react';
import PropTypes from 'prop-types';
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';
import ValueDate from 'modules/common/components/value-date';
import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';
import shareDenominationLabel from 'utils/share-denomination-label';
import ConsensusOutcome from 'modules/market/components/consensus-outcome';
import EmDash from 'modules/common/components/em-dash';

const MarketDetails = (p) => {
  const outstandingShares = setShareDenomination(getValue(p, 'outstandingShares.formatted'), p.selectedShareDenomination);
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations);

  return (
    <div className="market-details market-content-scrollable">
      <ul className="properties">
        <li className="property outcome">
          <span className="property-label">consensus</span>
          <span className="property-value">
            {!p.consensus &&
              <EmDash />
            }
            {!!p.consensus &&
              <ConsensusOutcome
                type={p.type}
                isIndeterminate={getValue(p, 'consensus.isIndeterminate')}
                outcomeName={getValue(p, 'consensus.outcomeName')}
                outcomeID={getValue(p, 'consensus.outcomeID')}
                percentCorrect={getValue(p, 'consensus.percentCorrect')}
              />
            }
          </span>
        </li>
        {p.author != null &&
          <li className="property author">
            <span className="property-label">author</span>
            <span className="property-value">{p.author}</span>
          </li>
        }
        {p.isOpen && p.outstandingShares != null &&
          <li className="property outstanding-shares">
            <span className="property-label">outstanding shares</span>
            <ValueDenomination className="property-value" formatted={outstandingShares} denomination={shareDenomination} />
          </li>
        }
        {p.extraInfo != null && p.extraInfo !== '' &&
          <li className="property extra-info">
            <span className="property-label">extra info</span>
            <span className="property-value">{p.extraInfo}</span>
          </li>
        }
        {p.resolutionSource &&
          <li className="property resolution">
            <span className="property-label">resolution source</span>
            {getResolutionNode(p.resolutionSource)}
          </li>
        }
        {p.type === 'scalar' && p.minPrice != null &&
          <li className="property min-value">
            <span className="property-label">minimum value</span>
            <span className="property-value">{p.minPrice}</span>
          </li>
        }
        {p.type === 'scalar' && p.maxPrice != null &&
          <li className="property max-value">
            <span className="property-label">maximum value</span>
            <span className="property-value">{p.maxPrice}</span>
          </li>
        }
        <li className="property creation-date" data-tip={`created: ${p.creationTime.full}`}>
          <span className="property-label">created</span>
          <ValueDate className="property-value" {...p.creationTime} />
        </li>
      </ul>
      {!!p.consensus &&
        <div className="reported-outcome">
          <hr />
          <center><h4>This market is closed.</h4></center>
          <hr />
        </div>
      }
    </div>
  );
};

MarketDetails.propTypes = {
  author: PropTypes.string,
  extraInfo: PropTypes.string,
  resolutionSource: PropTypes.string,
  outstandingShares: PropTypes.object,
  creationTime: PropTypes.object,
  type: PropTypes.string,
  minPrice: PropTypes.string,
  maxPrice: PropTypes.string,
  reportedOutcome: PropTypes.string,
  consensus: PropTypes.object
};

export default MarketDetails;

function getResolutionNode(resolutionSource) {
  let resolutionText;
  if (resolutionSource === 'generic') {
    resolutionText = 'Covered by local, national or international news media';
  } else {
    resolutionText = (<a href={resolutionSource}>{resolutionSource}</a>);
  }

  return (<span className="property-value">{resolutionText}</span>);
}
