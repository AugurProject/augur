import { selectTopicsLink } from 'modules/link/selectors/links';

export const displayTopicsPage = () => (dispatch) => {
  const topicsLink = selectTopicsLink(dispatch);
  if (topicsLink && typeof topicsLink.onClick === 'function') {
    topicsLink.onClick();
  }
};
