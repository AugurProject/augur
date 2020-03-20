import React from 'react';
import classNames from 'classnames';
import Styles from 'modules/reporting/forking.styles.less';
import { ExclamationCircle } from 'modules/common/icons';
import { CountdownProgress, formatTime } from 'modules/common/progress';
import { PrimaryButton, SecondaryButton, ProcessingButton } from 'modules/common/buttons';
import { DateFormattedObject } from 'modules/types';
import { SIXTY_DAYS, MIGRATEOUTBYPAYOUT, TRANSACTIONS } from 'modules/common/constants';

interface ForkingProps {
  show: boolean;
  hasStakedRep?: boolean;
  hasRepBalance?: boolean;
  isForking?: boolean;
  forkTime?: DateFormattedObject;
  hasStakedRepAction: Function;
  hasRepMigrationAction: Function;
}

export const Forking = (props: ForkingProps) => (
  <div
    ref={forkingBanner => {
      this.forkingBanner = forkingBanner;
    }}
    className={classNames(Styles.ForkingLabel, {
      [Styles.Hide]: !props.show,
    })}
  >
    {ExclamationCircle}
    <div>
      <span>{'A fork has been initiated. The Universe is now Locked'}</span>
      <span>
        {
          `If you are a REP holder, please release any outstanding REP. Then, migrate your REP to your chosen child universe.  The forking period will end on ${props.forkTime ? props.forkTime.formattedSimpleData : '[date]'} or when more than 50% of all REP has been migrated to a child universe. REP migration must happen before the 60 days cut-off. If not your REP will be stuck in the current universe (Genesis Universe). `   
        }
        <a href={"https://augur.gitbook.io/help-center/forking-explained"} target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </span>
      <div>
        {props.hasStakedRep && (
          <SecondaryButton
            action={props.hasStakedRepAction}
            text={'Release my REP'}
          />
        )}
        {props.hasRepBalance && props.isForking && (
          <ProcessingButton
            action={props.hasRepMigrationAction}
            text={'Migrate REP'}
            queueName={TRANSACTIONS}
            queueId={MIGRATEOUTBYPAYOUT}
          />
        )}
      </div>
    </div>
    <div>
      <CountdownProgress
        label={'Time remaining in Fork Window'}
        time={props.forkTime}
        countdownBreakpoint={SIXTY_DAYS}
      />
    </div>
  </div>
);

export default Forking;
