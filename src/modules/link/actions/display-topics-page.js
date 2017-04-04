import { selectTopicsLink } from 'modules/link/selectors/links';

export const displayTopicsPage = redirect => (dispatch) => {
  const topicsLink = selectTopicsLink(dispatch);
  if (topicsLink && redirect) topicsLink.onClick();
};
