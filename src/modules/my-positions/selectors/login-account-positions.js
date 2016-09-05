import selectMyPositions from '../../../modules/my-positions/selectors/my-positions';
import selectMyPositionsSummary from '../../../modules/my-positions/selectors/my-positions-summary';
import selectSharesPurchased from '../../../modules/my-positions/selectors/shares-purchased';

export default function () {
	const markets = selectMyPositions();
	const summary = selectMyPositionsSummary();
	const sharesPurchased = selectSharesPurchased();

	return {
		markets,
		summary,
		sharesPurchased
	};
}
