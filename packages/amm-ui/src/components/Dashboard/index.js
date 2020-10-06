import styled from 'styled-components'
import { Box } from 'rebass'

const Dashboard = styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas:
    'volume'
    'liquidity'
    'shares'
    'statistics'
    'exchange'
    'transactions';

  @media screen and (min-width: 64em) {
    max-width: 1320px;
    grid-gap: 24px;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      /* "statsHeader statsHeader statsHeader" */
      'fill fill fill'
      'pairHeader pairHeader pairHeader'
      'transactions2  transactions2 transactions2'
      'listOptions listOptions listOptions'
      'transactions  transactions transactions';
  }
`

export default Dashboard
