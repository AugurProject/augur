// import { DEFAULT_MARKET_VIEW_SETTINGS, SETTINGS_SLIPPAGE } from '../constants';
import {
  ParaDeploys,
} from '../types';

// @ts-ignore
export const PARA_CONFIG: ParaDeploys =
  ((process.env.CONFIGURATION as unknown) as ParaDeploys) || {};

// transaction types
export const MIGRATE = 'MIGRATE';
export const APPROVE = 'APPROVE';

export const STUBBED_MIGRATION_ACTIONS = {
  setTimestamp: (timestamp) => {},
  updateApproval: (isApproved) => {},
  updateMigrated: (isMigrated) => {},
  updateTxFailed: (txFailed) => {},
  updateTotalRepMigrated: (totalRepMigrated) => {},
};

export const DEFAULT_MIGRATION_STATE = {
  timestamp: 0,
  isApproved: null,
  txFailed: false,
  isMigrated: false,
  totalRepMigrated: 0
};

export const MIGRATION_KEYS = {
  TIMESTAMP: 'timestamp',
  IS_APPROVED: 'isApproved',
  TX_FAILED: 'txFailed',
  IS_MIGRATED: 'isMigrated',
  TOTAL_REP_MIGRATED: 'totalRepMigrated'
};

export const MIGRATION_ACTIONS = {
  SET_TIMESTAMP: 'SET_TIMESTAMP',
  UPDATE_MIGRATED: 'UPDATE_MIGRATED',
  UPDATE_TX_FAILED: 'UPDATE_TX_FAILED',
  UPDATE_APPROVAL: 'UPDATE_APPROVAL',
  UPDATE_TOTAL_REP_MIGRATED: 'UPDATE_TOTAL_REP_MIGRATED',
};

export const MOCK_MIGRATION_STATE = {
  ...DEFAULT_MIGRATION_STATE,
};
