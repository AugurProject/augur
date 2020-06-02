import { BigNumber } from 'bignumber.js';
import { utils as ethersUtils } from 'ethers';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETHER = new ethersUtils.BigNumber(10).pow(18);

export const SECONDS_IN_AN_HOUR = new BigNumber(3600, 10);

export const SECONDS_IN_A_DAY = new BigNumber(86400, 10);

export const SECONDS_IN_A_YEAR = new BigNumber(SECONDS_IN_A_DAY).multipliedBy(
  365
);

export const QUINTILLION = new BigNumber(10).pow(18);

export const INIT_REPORTING_FEE_DIVISOR = '10000';

export enum MarketReportingStateByNum {
  'PreReporting',
  'DesignatedReporting',
  'OpenReporting',
  'CrowdsourcingDispute',
  'AwaitingNextWindow',
  'AwaitingFinalization',
  'Finalized',
  'Forking',
  'AwaitingForkMigration',
}

export enum MarketReportingState {
  PreReporting = 'PreReporting',
  DesignatedReporting = 'DesignatedReporting',
  OpenReporting = 'OpenReporting',
  CrowdsourcingDispute = 'CrowdsourcingDispute',
  AwaitingNextWindow = 'AwaitingNextWindow',
  AwaitingFinalization = 'AwaitingFinalization',
  Finalized = 'Finalized',
  Forking = 'Forking',
  AwaitingForkMigration = 'AwaitingForkMigration',
}

export enum MarketType {
    YesNo = 0,
    Categorical = 1,
    Scalar = 2,
  }
  
  export enum MarketTypeName {
    YesNo = 'YesNo',
    Categorical = 'Categorical',
    Scalar = 'Scalar',
  }
  
  export enum CommonOutcomes {
    Malformed = 'malformed outcome',
    Invalid = 'Invalid',
  }
  
  export enum YesNoOutcomes {
    No = 'No',
    Yes = 'Yes',
  }

export const defaultReportingFeeDivisor = new BigNumber(10000);
