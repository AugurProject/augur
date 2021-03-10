import React from 'react';
import { useMigrationStore } from '../stores/migration-store';
import Styles from './migration-indicator.styles.less';
import { Formatter, createBigNumber } from '@augurproject/augur-comps';

const { formatRep, formatPercent } = Formatter;

const totalRep = createBigNumber(11000000);

export const MigrationIndicator = () => {
  const { totalRepMigrated } = useMigrationStore();
  const formattedRep = formatRep(totalRepMigrated, { decimals: 0, rounded: 0 });
  const formattedTotalRep = formatRep(totalRep, { decimals: 0, rounded: 0 });
  const percent = formatPercent(createBigNumber(totalRepMigrated)
    .div(totalRep)
    .times(createBigNumber(100)));
  return (
    <div className={Styles.MigrationIndicator}>
      <span>Total REP Migrated</span>
      <div />
      <span>
        <span>{formattedRep.minimized} /</span>
        <span> {formattedTotalRep.minimized} REPv2</span>
        <span> ({percent.minimized}%)</span>
      </span>
    </div>
  );
};
