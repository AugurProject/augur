import React, { useEffect } from 'react'
import 'feather-icons'
import { TYPE } from '../Theme'
import { PageWrapper, ContentWrapper } from '../components'
import { RowBetween } from '../components/Row'
import { useMarket } from '../contexts/Markets'

function TradePage({ pairAddress }) {
  const { selectedMarket } = useMarket(pairAddress)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageWrapper>
      <ContentWrapper>
        <RowBetween>
          <TYPE.veryLargeHeader style={{ margin: '2rem  4rem', textAlign: 'center' }}>
            {selectedMarket.description}
          </TYPE.veryLargeHeader>
        </RowBetween>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default TradePage
