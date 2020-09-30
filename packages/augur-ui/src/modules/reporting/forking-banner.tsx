import React from 'react';
import classNames from 'classnames';
import { ProcessingButton, SubmitTextButton } from 'modules/common/buttons';
import {
  MIGRATEOUTBYPAYOUT,
  SIXTY_DAYS,
  TRANSACTIONS,
  ZERO,
  MODAL_REPORTING,
  MODAL_CLAIM_FEES,
} from 'modules/common/constants';
import { ExclamationCircle } from 'modules/common/icons';
import { CountdownProgress } from 'modules/common/progress';

import { DateFormattedObject } from 'modules/types';

import Styles from 'modules/reporting/forking.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber } from 'utils/create-big-number';
import { convertUnixToFormattedDate } from 'utils/format-date';

const ForkingBanner = () => {
  const {
    loginAccount: { reporting, balances },
    universe: { forkingInfo },
    blockchain: { currentAugurTimestamp },
    actions: { setModal },
  } = useAppStatusStore();
  const show = true;
  if (!forkingInfo) return <div/>;
  let hasStakedRep = false;
  if (reporting) {
    const stakes = selectReportingWinningsByMarket();
    hasStakedRep =
      stakes.claimableMarkets &&
      stakes.claimableMarkets.marketContracts &&
      stakes.claimableMarkets.marketContracts.length > 0;
  }
  const market = selectMarket(forkingInfo.forkingMarket);
  const hasRepBalance =
    market !== null && balances && createBigNumber(balances.rep).gt(ZERO);
  const releasableRep = selectReportingWinningsByMarket();

  const forkTime = convertUnixToFormattedDate(forkingInfo.forkEndTime);
  const currentTime = convertUnixToFormattedDate(currentAugurTimestamp);
  const isForking = !forkingInfo.isForkingMarketFinalized;

  return (
    <div
      className={classNames(Styles.ForkingLabel, {
        [Styles.Hide]: !show,
      })}
    >
      {ExclamationCircle}
      <div>
        <span>A fork has been initiated. The Universe is now Locked</span>
        <span>
          If you are a REPv2 holder, please release any outstanding REPv2. Then,
          migrate your REPv2 to your chosen child universe. The forking period
          will end on {forkTime ? forkTime.formattedSimpleData : '[date]'} or
          when more than 50% of all REPv2 has been migrated to a child universe.
          REPv2 migration must happen before the 60 days cut-off. If not your REPv2
          will be stuck in the current universe (Genesis Universe).
          <a
            href="https://augur.gitbook.io/help-center/forking-explained"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </span>
        <div>
          {hasStakedRep && (
            <SubmitTextButton
              action={() =>
                setModal({
                  type: MODAL_CLAIM_FEES,
                  releasableRep,
                })
              }
              text={'Release my REPv2'}
            />
          )}
          {hasRepBalance && isForking && (
            <ProcessingButton
              action={() => setModal({
                type: MODAL_REPORTING,
                market,
              })}
              text="Migrate REPv2"
              queueName={TRANSACTIONS}
              queueId={MIGRATEOUTBYPAYOUT}
            />
          )}
        </div>
      </div>
      <div>
        <CountdownProgress
          label="Time remaining in Fork Window"
          time={forkTime}
          countdownBreakpoint={SIXTY_DAYS}
        />
      </div>
    </div>
  );
};

export default ForkingBanner;