import React, { useEffect, useState } from 'react';
import { augurSdk } from 'services/augursdk';
import { SecondaryButton } from 'modules/common/buttons';
import { Breakdown, Title } from 'modules/modal/common';
import Styles from 'modules/modal/modal.styles.less';
import { formatDai } from 'utils/format-number';
import type { Getters } from '@augurproject/sdk';
import { LinearPropertyLabel } from 'modules/common/labels';
import MarketTitle from 'modules/market/components/common/market-title';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';
const FROZEN_FUNDS_KEYS = ['openOrders', 'positions', 'createdMarkets'];
const TITLES = {
  [FROZEN_FUNDS_KEYS[0]]: `Open Orders`,
  [FROZEN_FUNDS_KEYS[1]]: `Positions`,
  [FROZEN_FUNDS_KEYS[2]]: `Validity Bonds`,
};

const TOTAL_TITLES = {
  [FROZEN_FUNDS_KEYS[0]]: `Total Frozen Funds of Open Orders`,
  [FROZEN_FUNDS_KEYS[1]]: `Total Frozen Funds of Positions`,
  [FROZEN_FUNDS_KEYS[2]]: `Total Frozen Funds of Validity Bonds`,
};

export const ModalFrozenFunds = () => {
  const { theme, universe: { id: universe }, loginAccount: { address: account }, actions: { closeModal }} = useAppStatusStore();
  const [breakdowns, setBreakdowns] = useState([]);
  const [total, setTotal] = useState(formatDai('0'));
  const isSportsTheme = theme === THEMES.SPORTS;

  async function getBreakdown() {
    try {
      const breakdown: Getters.Users.FrozenFundsBreakdown = await (async () => {
        const Augur = augurSdk.get();
        return await Augur.getUserFrozenFundsBreakdown({ universe, account });
      })();
      // const breakdown: Getters.Users.FrozenFundsBreakdown = await getUserFrozenFundsBreakdown();
      setTotal(formatDai(breakdown.total));
      if (breakdown.total === '0') return;
      const updateBreakdowns = FROZEN_FUNDS_KEYS.reduce((p, key) => {
        if (breakdown[key].total === '0') return p;
        const total = breakdown[key] ? formatDai(breakdown[key].total) : null;
        const rows = Object.keys(breakdown[key].markets).map(marketId => ({
          key: `${marketId}${key}`,
          marketId: marketId,
          showDenomination: true,
          label: `Frozen Funds`,
          value: formatDai(breakdown[key].markets[marketId]),
          regularCase: true,
          secondary: true,
        }));
        return [
          ...p,
          {
            key,
            rows,
            title: TITLES[key],
            footer: {
              label: TOTAL_TITLES[key],
              showDenomination: true,
              regularCase: true,
              value: total,
            },
          },
        ];
      }, []);

      setBreakdowns(updateBreakdowns);
    } catch (error) {
      console.error('can not get frozen funds breakdown', error);
    }
  }

  useEffect(() => {
    getBreakdown();
  }, []);

  return (
    <div className={Styles.FrozenFundsBreakdown}>
      <Title title={isSportsTheme ? 'Total Exposure' : "Frozen Funds"} closeAction={() => closeModal()} />
      <main>
        <section>
          {breakdowns.map(bk => (
            <div className={Styles.BreakdownSection} key={bk.key}>
              <span>{bk.title}</span>
              {bk.rows.map(row => (
                <div key={row.key}>
                  <MarketTitle hideWarning id={row.marketId} />
                  <LinearPropertyLabel {...row} />
                </div>
              ))}
              <LinearPropertyLabel {...bk.footer} />
            </div>
          ))}

          <Breakdown
            title="Total"
            footer={{
              label: 'Total Frozen Funds',
              showDenomination: true,
              regularCase: true,
              value: total,
            }}
          />
        </section>
      </main>
      <div className={Styles.ButtonsRow}>
        <SecondaryButton text="Close" action={() => closeModal()} />
      </div>
    </div>
  );
};
