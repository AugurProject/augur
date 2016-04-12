import { UPDATE_BRANCH } from '../../app/actions/app-actions';

export default function(branch = {}, action) {
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