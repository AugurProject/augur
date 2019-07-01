import {
  UPDATE_DRAFT,
  ADD_DRAFT,
  LOAD_DRAFTS,
  REMOVE_DRAFT
} from "modules/create-market/actions/update-drafts";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Draft, BaseAction } from "modules/types";

const DEFAULT_STATE = {};

export default function(drafts = DEFAULT_STATE, { type, data }: BaseAction): Draft {
  switch (type) {
    case UPDATE_DRAFT: 
      return {
        ...drafts,
        [data.key]: data.draft
      };
    case ADD_DRAFT: 
      return {
        ...drafts,
        [data.key]: data.draft
      };
    case REMOVE_DRAFT: {
      delete drafts[data.key]
      return {
        ...drafts
      };
    }
    case LOAD_DRAFTS: {
      return data.drafts;
    }
    default:
      return drafts;
  }
}
