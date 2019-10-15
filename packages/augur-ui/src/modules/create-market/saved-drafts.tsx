import React from "react";

import { Drafts, Draft } from "modules/types";
import { formatDate } from "utils/format-date";
import QuadBox from "modules/portfolio/components/common/quad-box";
import { PillLabel } from "modules/common/labels";
import { SCRATCH, TEMPLATE } from "modules/create-market/constants";

import Styles from "modules/create-market/saved-drafts.styles";

interface SavedDraftsProps {
  drafts: Drafts;
  updateNewMarket: Function;
  address: string;
  updatePage: Function;
  removeDraft: Function;
}

interface DraftRowProps {
  draft?: Draft;
  updateNewMarket: Function;
  updatePage: Function;
  removeDraft: Function
}

const DraftRow: React.FC<DraftRowProps> = (props) => {
  const date = formatDate(new Date(props.draft.updated * 1000)).formattedLocalShortTime;
  return (
    <div className={Styles.DraftRow}>
      <button
        onClick={() => {
          props.updateNewMarket(props.draft);
          props.updatePage(props.draft.template ? TEMPLATE : SCRATCH);
        }}
      >
        <PillLabel label="Draft" />
        <div>
          <span>{props.draft.description}</span>
          <span>Saved: {date.toString()}</span>
        </div>
      </button>
      <button onClick={() => props.removeDraft(props.draft.uniqueId)}>
        Delete
      </button>
    </div>
  );
};


export default class SavedDrafts extends React.Component<
  SavedDraftsProps,
  {}
  > {
  render() {
    const {
      updatePage,
      drafts,
      removeDraft,
      updateNewMarket
    } = this.props;

    if (!Object.keys(drafts).length) return null;

    const draftsSorted = Object.keys(drafts).sort(function (a, b) {
      return drafts[b].updated - drafts[a].updated
    });

    return (
      <QuadBox
        title={"Saved drafts"}
        extraTitlePadding
        normalOnMobile
        content={
          <div className={Styles.SavedDrafts}>
            {draftsSorted.map(key =>
              <DraftRow
                key={key}
                draft={drafts[key]}
                removeDraft={removeDraft}
                updateNewMarket={updateNewMarket}
                updatePage={updatePage} />
            )}
          </div>
        }
      />
    );
  }
}
