import { UPDATE_BRANCH } from '../../branch/actions/update-branch';

export default function (branch = {}, action) {
  switch (action.type) {
    case UPDATE_BRANCH:
      return {
        ...branch,
        ...action.branch
      };

    default:
      return branch;
  }
}
