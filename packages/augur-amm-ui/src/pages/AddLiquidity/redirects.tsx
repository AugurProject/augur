import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import AddLiquidity from './index'

export function RedirectToAddLiquidity() {
  return <Redirect to="/add/" />
}

export function RedirectDuplicateTokenIds(
  props: RouteComponentProps<{ marketId: string; currencyIdA: string; currencyIdB: string }>
) {
  const { currencyIdA, currencyIdB } = props
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/add/${currencyIdA}`} />
  }
  return <AddLiquidity {...props} />
}
