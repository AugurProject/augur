import { Augur } from '../../Augur';
import { DB } from './DB';
import { DerivedDB } from './DerivedDB';
import { ParsedLog } from '@augurproject/types';

/**
 * DB to store current outcome stake and dispute related information
 */
export class DisputeDatabase extends DerivedDB {
  constructor(
    db: DB,
    networkId: number,
    name: string,
    mergeEventNames: string[],
    augur: Augur
  ) {
    super(db, networkId, name, mergeEventNames, augur);

    this.requiresOrder = true;
  }

  protected processDoc(log: ParsedLog): ParsedLog {
    if (log.name === 'InitialReportSubmitted') {
      return this.processInitialReportSubmitted(log);
    } else if (log.name === 'DisputeCrowdsourcerCreated') {
      return this.processDisputeCrowdsourcerCreated(log);
    } else if (log.name === 'DisputeCrowdsourcerContribution') {
      return this.processDisputeCrowdsourcerContribution(log);
    } else if (log.name === 'DisputeCrowdsourcerCompleted') {
      return this.processDisputeCrowdsourcerCompleted(log);
    }
    return log;
  }

  private processInitialReportSubmitted(log: ParsedLog): ParsedLog {
    log['stakeCurrent'] = '0x0';
    log['stakeRemaining'] = '0x0';
    log['totalRepStakedInPayout'] = log['amountStaked'];
    log['disputeRound'] = '0x01';
    return log;
  }

  private processDisputeCrowdsourcerCreated(log: ParsedLog): ParsedLog {
    log['bondSizeCurrent'] = log['size'];
    log['stakeCurrent'] = '0x0';
    log['stakeRemaining'] = '0x0';
    return log;
  }

  private processDisputeCrowdsourcerContribution(log: ParsedLog): ParsedLog {
    log['stakeCurrent'] = log['currentStake'];
    return log;
  }

  private processDisputeCrowdsourcerCompleted(log: ParsedLog): ParsedLog {
    log['stakeCurrent'] = '0x0';
    log['stakeRemaining'] = '0x0';
    return log;
  }
}
