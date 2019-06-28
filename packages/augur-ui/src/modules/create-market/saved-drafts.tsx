import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import QuadBox from "modules/portfolio/components/common/quad-box";
import { PillLabel } from "modules/common/labels";

import Styles from "modules/create-market/saved-drafts.styles";

interface SavedDraftsProps {
  newMarket: Object;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
}

interface DraftRowProps {
  draft?: Any;
}

const DraftRow = (props: DraftRowProps) => {
  return (
    <div className={Styles.DraftRow}>
      <PillLabel label="Draft" />
      <div>
        <span>{props.draft.description}</span>
        <span>Saved: {props.draft.createdTime}</span>
      </div>
      <button>
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
      updatePage
    } = this.props;

    const drafts = [
      {
        description: "Will antibiotics be outlawed for agricultural use in China by the end of 2019?",
        createdTime: "May 01, 2019 09:32pm"
      },
      {
        description: "Will antibiotics be outlawed for agricultural use in China by the end of 2019?",
        createdTime: "May 01, 2019 09:32pm"
      },
      {
        description: "Will antibiotics be outlawed for agricultural use in China by the end of 2019?",
        createdTime: "May 01, 2019 09:32pm"
      },
      {
        description: "Will antibiotics be outlawed for agricultural use in China by the end of 2019?",
        createdTime: "May 01, 2019 09:32pm"
      },
      {
        description: "Will antibiotics be outlawed for agricultural use in China by the end of 2019?",
        createdTime: "May 01, 2019 09:32pm"
      },
      {
        description: "Will antibiotics be outlawed for agricultural use in China by the end of 2019?",
        createdTime: "May 01, 2019 09:32pm"
      }
    ];

    return (
      <QuadBox
        title={"Saved drafts"}
        extraTitlePadding
        content={
          <div className={Styles.SavedDrafts}>
            {drafts.map(draft => 
              <DraftRow draft={draft} />
            )}
          </div>
        }
      />
     );
  }
}