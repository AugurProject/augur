import { Draft } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "appStore";

export const UPDATE_DRAFT = "UPDATE_DRAFT";
export const ADD_DRAFT = "ADD_DRAFT";
export const LOAD_DRAFTS = "LOAD_DRAFTS";
export const REMOVE_DRAFT = "REMOVE_DRAFT";

export const loadDrafts= (drafts: Array<Draft>): BaseAction => ({
  type: LOAD_DRAFTS,
  data: { drafts },
});

export const addDraft = (key: number, draft: Draft) => ({
  type: ADD_DRAFT,
  data: { key: key, draft: draft }
});

export const removeDraft = (key: number) => ({
  type: REMOVE_DRAFT,
  data: { key: key }
});

export const updateDraft = (key: number, draft: Draft) => ({
  type: ADD_DRAFT,
  data: { key: key, draft: draft }
});
