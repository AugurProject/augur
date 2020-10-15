import { createAction } from '@reduxjs/toolkit'

export enum Field {
  LIQUIDITY_PERCENT = 'LIQUIDITY_PERCENT',
  LIQUIDITY = 'LIQUIDITY',
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
  YES_SHARES = 'YES_SHARES',
  NO_SHARES = 'NO_SHARES',
  COLLATERAL = 'COLLATERAL'
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('burn/typeInputBurn')
