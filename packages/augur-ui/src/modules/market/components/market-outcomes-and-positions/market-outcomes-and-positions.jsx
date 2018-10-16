import React from "react";

import MarketOutcomesList from "modules/market/components/market-outcomes-list/market-outcomes-list";
import MarketPositionsList from "modules/market/components/market-positions-list/market-positions-list";
import MarketPositionsListMobile from "modules/market/components/market-positions-list--mobile/market-positions-list--mobile";

const MarketOutcomesAndPositions = p => (
  <section>
    {(!p.isMobile || (p.isMobile && !p.selectedOutcome)) && (
      <MarketOutcomesList
        marketId={p.marketId}
        outcomes={p.outcomes}
        selectedOutcome={p.selectedOutcome}
        updateSelectedOutcome={p.updateSelectedOutcome}
        isMobile={p.isMobile}
      />
    )}
    {!p.isMobile && (
      <MarketPositionsList
        positions={p.positions}
        openOrders={p.openOrders}
        numCompleteSets={p.numCompleteSets}
        marketId={p.marketId}
        sellCompleteSets={p.sellCompleteSets}
        orphanedOrders={p.orphanedOrders}
        cancelOrphanedOrder={p.cancelOrphanedOrder}
      />
    )}
    {p.isMobile &&
      p.selectedOutcome &&
      p.outcomes.length > 0 && (
        <MarketPositionsListMobile
          outcome={
            p.outcomes.filter(outcome => outcome.id === p.selectedOutcome)[0]
          }
          positions={p.positions.filter(
            position =>
              parseInt(position.outcomeId, 10) ===
              parseInt(p.selectedOutcome, 10)
          )}
          openOrders={p.openOrders.filter(
            order => order.outcomeId === p.selectedOutcome
          )}
        />
      )}
  </section>
);

export default MarketOutcomesAndPositions;
