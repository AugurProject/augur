import React from 'react';

import { Draft } from 'modules/types';
import { formatDate } from 'utils/format-date';
import { SCRATCH, TEMPLATE } from 'modules/create-market/constants';

import Styles from 'modules/create-market/saved-drafts.styles.less';
import { CancelTextButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO, ONE } from 'modules/common/constants';
import QuadBox from 'modules/portfolio/components/common/quad-box';

interface SavedDraftsProps {
  updatePage: Function;
}

interface DraftRowProps {
  draft?: Draft;
  updatePage: Function;
}

const DraftRow: React.FC<DraftRowProps> = ({
  draft,
  updatePage,
}) => {
  const { actions: { updateNewMarket, removeDraft } } = useAppStatusStore();
  const date = formatDate(new Date(draft.updated * 1000))
    .formattedLocalShortWithUtcOffset;
  return (
    <div className={Styles.DraftRow}>
      <button
        onClick={() => {
          const data = draft;
          // convert strings to BigNumber for BigNumber fields
          data.initialLiquidityDai = data.initialLiquidityDai
            ? createBigNumber(data.initialLiquidityDai)
            : ZERO;
          data.initialLiquidityGas = data.initialLiquidityGas
            ? createBigNumber(data.initialLiquidityGas)
            : ZERO;
          data.maxPriceBigNumber = data.maxPriceBigNumber
            ? createBigNumber(data.maxPriceBigNumber)
            : ONE;
          data.minPriceBigNumber = data.minPriceBigNumber
            ? createBigNumber(data.minPriceBigNumber)
            : ZERO;
          updateNewMarket(data);
          updatePage(draft.template ? TEMPLATE : SCRATCH);
        }}
      >
        <span>{draft.description}</span>
        <span>Saved: {date.toString()}</span>
      </button>
      <CancelTextButton
        text={'Delete'}
        action={() => removeDraft(draft.uniqueId)}
      />
    </div>
  );
};

const SavedDrafts = ({
  updatePage,
}: SavedDraftsProps) => {
  const { drafts } = useAppStatusStore();
  if (!Object.keys(drafts).length) return null;

  const draftsSorted = Object.keys(drafts).sort(function(a, b) {
    return drafts[b].updated - drafts[a].updated;
  });

  return (
    <QuadBox
      title={'Saved drafts'}
      customClass={Styles.CustomQuadBoxStyles}
      // extraTitlePadding
      // normalOnMobile
      content={
        <div className={Styles.SavedDrafts}>
          {draftsSorted.map(key => (
            <DraftRow
              key={key}
              draft={drafts[key]}
              updatePage={updatePage}
            />
          ))}
        </div>
      }
    />
  );
};

export default SavedDrafts;
