import { UPDATE_CONNECTION_STATUS } from '../../app/actions/update-connection';

export default function (connection = { isConnected: false }, action) {
	switch (action.type) {
		case UPDATE_CONNECTION_STATUS:
			return {
				...connection,
				isConnected: action.isConnected
			};

		default:
			return connection;
	}
}
