import { UPDATE_ENV } from '../../app/actions/update-env';

export default function (env = {}, action) {
	switch (action.type) {
		case UPDATE_ENV:
			return action.env;

		default:
			return env;
	}
}
