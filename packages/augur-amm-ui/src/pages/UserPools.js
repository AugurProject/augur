import { withRouter } from 'react-router-dom'
import React, { useEffect, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import PooledMarketList from '../components/PooledMarkets'
import Panel from '../components/Panel'
import { useAllMarketData } from '../contexts/Markets'
// import { formattedNum, formattedPercent } from '../utils'
import { ThemedBackground, TYPE } from '../Theme'
import { Dots } from '../components/swap/styleds'
import { transparentize } from 'polished'
import { PageWrapper, ContentWrapper } from '../components'
import { useLPTokenBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from '../hooks'

function UserPoolsPage() {
  const theme = useContext(ThemeContext)
  // get data for lists and totals
  const { markets } = useAllMarketData()
  const { account } = useActiveWeb3React()
  // breakpoints
  const [filteredMarkets, setFilteredMarkets] = useState([])
  const amms = markets.reduce((p, m) => (m.amms.length > 0 ? [...p, ...m.amms.map(a => a.id)] : p), [])
  const [userTokenBalances, loading] = useLPTokenBalances(account, amms)
  const [hasLoaded, setHasLoaded] = useState(false)
  console.log('render user pool', JSON.stringify(userTokenBalances))

  if (!loading && !hasLoaded) {
    setHasLoaded(true)
    const amms = Object.keys(userTokenBalances)
    const newMarkets = markets.reduce((p, m) => {
      const included = m.amms.map(a => a.id).find(id => amms.includes(id))
      return included ? [...p, m] : p
    }, [])
    setFilteredMarkets(newMarkets)
  }

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  /*
  useEffect(() => {
    console.log('use effect called')
    // check if finish loading
    if (!userTokenBalances[1]) {
      const amms = Object.keys(userTokenBalances[0])
      const newMarkets = markets.reduce((p, m) => {
        const included = m.amms.map(a => a.id).find(id => amms.includes(id))
        return included ? [...p, m] : p
      }, [])
      setFilteredMarkets(newMarkets)
    }
  }, [userTokenBalances, markets])
*/
  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.8, '#ff007a')} />
      <ContentWrapper>
        <div>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <PooledMarketList markets={filteredMarkets || []} balances={userTokenBalances} />
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(UserPoolsPage)
