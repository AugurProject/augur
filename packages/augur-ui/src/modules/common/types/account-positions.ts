export const POSITION_ACTIONS = {
  UPDATE_ACCOUNT_POSITIONS_DATA: "UPDATE_ACCOUNT_POSITIONS_DATA"
};

// TODO: fill this in as discovered
export interface PositionData {
  marketId: string;
  netPosition: string;
  outcome: string;
  position: string;
  averagePrice: string;
  realized: string;
  timestamp: number;
  total: string;
  unrealized: string;
  cost: string;
  unrealizedCost: string;
  unrealizedRevenue: string;
  totalPercent: string;
  unrealizedPercent: string;
  realizedPercent: string;
  unrealizedRevenue24hChangePercent: string;
}

export interface AccountPosition {
  marketId: string | null;
  positionData: PositionData;
}

export interface AccountPositionAction {
  type: string;
  data: AccountPosition;
}

export function updateAccountPositionsData(
  data: AccountPosition,
): AccountPositionAction {
  return {
    type: POSITION_ACTIONS.UPDATE_ACCOUNT_POSITIONS_DATA,
    data,
  };
}
