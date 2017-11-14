import React from 'react'

import MarketOutcomesList from 'modules/market/components/market-outcomes-list/market-outcomes-list'
import MarketPositionsList from 'modules/market/components/market-positions-list/market-positions-list'
import MarketPositionsListMobile from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile'

import Styles from 'modules/market/components/market-data/market-data.styles'

const MarketData = p => (
  <section className={Styles.MarketData}>
    <div className={Styles.MarketData__details}>
      { (!p.isMobile || (p.isMobile && p.selectedOutcomes.length === 0)) &&
        <MarketOutcomesList
          marketID={p.marketID}
          outcomes={p.outcomes}
          scalarShareDenomination={p.scalarShareDenomination}
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
          scalarShareDenomination={p.scalarShareDenomination}
        />
      }
    </div>
    <div className={Styles.MarketData__trading}>
      trading
    </div>
  </section>
)

export default MarketData
