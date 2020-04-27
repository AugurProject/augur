import React from 'react';
import classNames from 'classnames';
import { ProcessingButton, SubmitTextButton } from 'modules/common/buttons';
import {
  MIGRATEOUTBYPAYOUT,
  SIXTY_DAYS,
  TRANSACTIONS,
} from 'modules/common/constants';
import { ExclamationCircle } from 'modules/common/icons';
import { CountdownProgress } from 'modules/common/progress';

import { DateFormattedObject } from 'modules/types';

import Styles from 'modules/reporting/forking.styles.less';

interface ForkingProps {
  show: boolean;
  hasStakedRep?: boolean;
  hasRepBalance?: boolean;
  isForking?: boolean;
  forkTime?: DateFormattedObject;
  hasStakedRepAction: Function;
  hasRepMigrationAction: Function;
}

export const Forking = ({ hasRepBalance, show, isForking, hasRepMigrationAction, hasStakedRep, forkTime, hasStakedRepAction }: ForkingProps) => (
  <div
    className={classNames(Styles.ForkingLabel, {
      [Styles.Hide]: !show,
    })}
  >
    {ExclamationCircle}
    <div>
      <span>A fork has been initiated. The Universe is now Locked</span>
      <span>

          If you are a REP holder, please release any outstanding REP. Then, migrate your REP to your chosen child universe.  The forking period will end on {forkTime ? forkTime.formattedSimpleData : '[date]'} or when more than 50% of all REP has been migrated to a child universe. REP migration must happen before the 60 days cut-off. If not your REP will be stuck in the current universe (Genesis Universe).
        <a href="https://augur.gitbook.io/help-center/forking-explained" target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </span>
      <div>
        {hasStakedRep && (
          <SubmitTextButton
            action={hasStakedRepAction}
            text={'Release my REP'}
          />
        )}
        {hasRepBalance && isForking && (
          <ProcessingButton
            action={hasRepMigrationAction}
            text='Migrate REP'
            queueName={TRANSACTIONS}
            queueId={MIGRATEOUTBYPAYOUT}
          />
        )}
      </div>
    </div>
    <div>
      <CountdownProgress
        label='Time remaining in Fork Window'
        time={forkTime}
        countdownBreakpoint={SIXTY_DAYS}
      />
    </div>
  </div>
);

export default Forking;
