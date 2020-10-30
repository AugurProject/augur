import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../Theme'
import { AutoRow } from '../components/Row'
import PositionMarkets from '../components/PositionMarkets'
import { useMarketShareBalances } from '../state/wallet/hooks'
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapper } from '../components'

function UserPositions() {
  const [userMarketShareBalances, loading] = useMarketShareBalances()

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ContentWrapper>
        <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
          {Object.keys(userMarketShareBalances).length > 0 ? (
            <PositionMarkets positions={userMarketShareBalances || {}} loading={loading} />
          ) : (
            <AutoRow justify={'center'}>
              <TYPE.light>{loading ? 'Loading ...' : 'No Market Positions'}</TYPE.light>
            </AutoRow>
          )}
        </Panel>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(UserPositions)
