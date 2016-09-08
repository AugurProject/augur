import selectMyPositions from '../../../modules/my-positions/selectors/my-positions';
import selectMyPositionsSummary from '../../../modules/my-positions/selectors/my-positions-summary';

export default function () {
	const markets = selectMyPositions();
	const summary = selectMyPositionsSummary();

	return {
		markets,
		summary
	};
}
