import React from "react";
import PropTypes from "prop-types";

import isPopulated from "utils/is-populated";
import MarketOutcomesList from "modules/market/components/market-outcomes-list/market-outcomes-list";
import MarketPositionsList from "modules/market/components/market-positions-list/market-positions-list";
import MarketPositionsListMobile from "modules/market/components/market-positions-list--mobile/market-positions-list--mobile";

const MarketOutcomesAndPositions = ({
  isMobile,
  marketId,
  outcomes,
  numCompleteSets,
  positions,
  orphanedOrders,
  openOrders,
  selectedOutcome,
  cancelOrphanedOrder,
  sellCompleteSets,
  updateSelectedOutcome
}) => (
  <section>
    {(!isMobile || !selectedOutcome) && (
      <MarketOutcomesList
        marketId={marketId}
        outcomes={outcomes}
        selectedOutcome={selectedOutcome}
        updateSelectedOutcome={updateSelectedOutcome}
        isMobile={isMobile}
      />
    )}
    {!isMobile && (
      <MarketPositionsList
        positions={positions}
        openOrders={openOrders}
        numCompleteSets={numCompleteSets}
        marketId={marketId}
        sellCompleteSets={sellCompleteSets}
        orphanedOrders={orphanedOrders}
        cancelOrphanedOrder={cancelOrphanedOrder}
      />
    )}
    {isMobile &&
      selectedOutcome &&
      isPopulated(outcomes) && (
        <MarketPositionsListMobile
          outcome={
            outcomes.filter(outcome => outcome.id === selectedOutcome)[0]
          }
          positions={positions.filter(
            position =>
              parseInt(position.outcomeId, 10) === parseInt(selectedOutcome, 10)
          )}
          openOrders={openOrders.filter(
            order => order.outcomeId === selectedOutcome
          )}
        />
      )}
  </section>
);

MarketOutcomesAndPositions.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  marketId: PropTypes.string.isRequired,
  outcomes: PropTypes.array,
  numCompleteSets: PropTypes.object,
  positions: PropTypes.array,
  orphanedOrders: PropTypes.array,
  openOrders: PropTypes.array,
  selectedOutcome: PropTypes.string,
  cancelOrphanedOrder: PropTypes.func.isRequired,
  sellCompleteSets: PropTypes.func.isRequired,
  updateSelectedOutcome: PropTypes.func.isRequired
};

MarketOutcomesAndPositions.defaultProps = {
  outcomes: [],
  numCompleteSets: null,
  positions: [],
  orphanedOrders: [],
  openOrders: [],
  selectedOutcome: null
};

export default MarketOutcomesAndPositions;
