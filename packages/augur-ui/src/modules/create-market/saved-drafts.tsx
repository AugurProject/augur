import React from 'react';

import { Drafts, Draft } from 'modules/types';
import { formatDate } from 'utils/format-date';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import { SCRATCH, TEMPLATE } from 'modules/create-market/constants';

import Styles from 'modules/create-market/saved-drafts.styles.less';
import { CancelTextButton } from 'modules/common/buttons';

interface SavedDraftsProps {
  drafts: Drafts;
  updateNewMarket: Function;
  updatePage: Function;
  removeDraft: Function;
}

interface DraftRowProps {
  draft?: Draft;
  updateNewMarket: Function;
  updatePage: Function;
  removeDraft: Function;
}

const DraftRow: React.FC<DraftRowProps> = ({
  draft,
  removeDraft,
  updateNewMarket,
  updatePage,
}) => {
  const date = formatDate(new Date(draft.updated * 1000))
    .formattedLocalShortWithUtcOffset;
  return (
    <div className={Styles.DraftRow}>
      <button
        onClick={() => {
          updateNewMarket(draft);
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

const SavedDrafts = ({ drafts, updatePage, removeDraft, updateNewMarket }: SavedDraftsProps) => {
  if (!Object.keys(drafts).length) return null;

  const draftsSorted = Object.keys(drafts).sort(function(a, b) {
    return drafts[b].updated - drafts[a].updated;
  });

  return (
    <QuadBox
      title={'Saved drafts'}
      extraTitlePadding
      normalOnMobile
      content={
        <div className={Styles.SavedDrafts}>
          {draftsSorted.map(key => (
            <DraftRow
              key={key}
              draft={drafts[key]}
              removeDraft={removeDraft}
              updateNewMarket={updateNewMarket}
              updatePage={updatePage}
            />
          ))}
        </div>
      }
    />
  );
};

export default SavedDrafts;
