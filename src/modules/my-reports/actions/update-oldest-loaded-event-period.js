export const UPDATE_OLDEST_LOADED_EVENT_PERIOD = 'UPDATE_OLDEST_LOADED_EVENT_PERIOD';

export function updateOldestLoadedEventPeriod(data) {
	return { type: UPDATE_OLDEST_LOADED_EVENT_PERIOD, data };
}
