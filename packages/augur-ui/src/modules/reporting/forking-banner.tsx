import React from 'react';
import classNames from 'classnames';
import Styles from 'modules/reporting/forking.styles.less';
import { ExclamationCircle } from 'modules/common/icons';
import { CountdownProgress, formatTime } from 'modules/common/progress';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { DateFormattedObject } from 'modules/types';

interface ForkingProps {
  hasStakedRep?: boolean;
  hasRepBalance?: boolean;
  forkTime?: DateFormattedObject;
  currentTime?: DateFormattedObject;
  hasStakedRepAction: Function;
  hasRepMigrationAction: Function
}

export const Forking = (props: ForkingProps) => (
  <section className={classNames(Styles.ForkingLabel)}>
    {ExclamationCircle}
    <div>
      <span>
        {'A fork has been initiated. The Universe is now Locked'}
      </span>
      <span>
        {'If you are a REP holder, please release any outstanding REP. Then, migrate your REP to your chosen child universe.  The forking period will end on [date] or when more than 50% of all REP has been migrated to a child universe. REP migration must happen before the 60 days cut-off. If not your REP will be stuck in the current universe (Genesis Universe). Learn more.'}
      </span>
      <div>
        {props.hasStakedRep && (
          <SecondaryButton action={props.hasStakedRepAction} text={'Release my REP'} />
        )}
        {props.hasRepBalance && (
          <PrimaryButton action={props.hasRepMigrationAction} text={'Migrate REP'} />
        )}
      </div>
    </div>
    <div>
      <CountdownProgress
        label={'Time remaining in Fork Window'}
        time={props.forkTime}
        currentTime={props.currentTime}
      />
    </div>
  </section>
);

export default Forking;
