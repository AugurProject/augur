import { DerivedDB } from './DerivedDB';
import { ParsedLog } from '@augurproject/types';

/**
 * DB to store current outcome stake and dispute related information
 */
export class DisputeDatabase extends DerivedDB {

    protected processDoc(log: ParsedLog): ParsedLog {
        if (log.name === 'InitialReportSubmitted') {
            return this.processInitialReportSubmitted(log);
        } else if (log.name === 'DisputeCrowdsourcerCompleted') {
            return this.processDisputeCrowdsourcerCompleted(log);
        } else if (log.name === 'InitialDisputeCrowdsourcerContribution') {
            return this.processDisputeCrowdsourcerContribution(log);
        } else if (log.name === 'DisputeCrowdsourcerCompleted') {
            return this.processDisputeCrowdsourcerCompleted(log);
        }
        return log;
      }
    
      private processInitialReportSubmitted(log: ParsedLog): ParsedLog {
        log['stakeCurrent'] = '0x0';
        log['stakeRemaining'] = '0x0';
        log['tentativeWinningOnRound'] = '0x1';
        log['totalRepStakedInPayout'] = log['amountStaked'];
        return log;
      }

      private processDisputeCrowdsourcerCreated(log: ParsedLog): ParsedLog {
        log['bondSizeCurrent'] = log['size'];
        log['stakeCurrent'] = '0x0';
        log['stakeRemaining'] = '0x0';
        return log;
      }

      private processDisputeCrowdsourcerContribution(log: ParsedLog): ParsedLog {
        log['stakeCurrent'] = log['currentStake']
        return log;
      }
    
      private processDisputeCrowdsourcerCompleted(log: ParsedLog): ParsedLog {
        log['stakeCurrent'] = '0x0';
        log['stakeRemaining'] = '0x0';
        log['tentativeWinningOnRound'] = log['disputeRound'];
        return log;
      }
}
