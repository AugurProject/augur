import React from 'react'

import MarketOutcomesList from 'modules/market/components/market-outcomes-list/market-outcomes-list'
import MarketPositionsList from 'modules/market/components/market-positions-list/market-positions-list'
import MarketPositionsListMobile from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile'

const MarketOutcomesAndPositions = p => (
  <section>
    { (!p.isMobile || (p.isMobile && p.selectedOutcomes.length === 0)) &&
      <MarketOutcomesList
        marketId={p.marketId}
        outcomes={p.outcomes}
        selectedOutcomes={p.selectedOutcomes}
        updateSelectedOutcomes={p.updateSelectedOutcomes}
        isMobile={p.isMobile}
      />
    }
    { !p.isMobile &&
      <MarketPositionsList
        positions={p.positions}
        openOrders={p.openOrders}
      />
    }
    { p.isMobile && p.selectedOutcomes.length > 0 &&
      <MarketPositionsListMobile
        outcome={p.outcomes.filter(outcome => outcome.id === p.selectedOutcomes[0])[0]}
        positions={p.positions.filter(position => position.id === p.selectedOutcomes[0])}
        openOrders={p.openOrders.filter(order => order.id === p.selectedOutcomes[0])}
      />
    }
  </section>
)

export default MarketOutcomesAndPositions
