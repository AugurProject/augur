import React, { useState } from 'react';
import classNames from 'classnames';
import { ThickChevron } from 'modules/common/icons';
import { EmptyState, BetslipHeader } from 'modules/trading/common';
import {
  useSelected,
  useBetslipAmounts,
  SelectedContext,
} from 'modules/trading/hooks/betslip';

import Styles from 'modules/trading/betslip.styles';

export interface BetslipProps {}

export const Betslip = ({  }: BetslipProps) => {
  const [minimized, setMinimized] = useState(true);
  const { selected, toggleSelected, emptyHeader } = useSelected();
  const betslipInfo = useBetslipAmounts(selected);
  const { betslipAmount, isSelectedEmpty } = betslipInfo;

  return (
    <aside
      className={classNames(Styles.Betslip, {
        [Styles.Minimized]: minimized,
      })}
    >
      <div>
        <button onClick={() => setMinimized(!minimized)}>
          Betslip ({betslipAmount}) {ThickChevron}
        </button>
      </div>
      <section className={Styles.Container}>
        <SelectedContext.Provider value={selected}>
          <BetslipHeader
            toggleSelected={toggleSelected}
            betslipInfo={betslipInfo}
          />
          <section
            className={classNames(Styles.MainSection, {
              [Styles.BetSlipEmpty]: isSelectedEmpty,
            })}
          >
            {isSelectedEmpty && (
              <EmptyState emptyHeader={emptyHeader} />
            )}
          </section>
        </SelectedContext.Provider>
      </section>
    </aside>
  );
};
