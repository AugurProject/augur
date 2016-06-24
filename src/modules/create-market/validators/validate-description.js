import {
	DESCRIPTION_MIN_LENGTH,
	DESCRIPTION_MAX_LENGTH
} from '../../create-market/constants/market-values-constraints';

export default function (description) {
	if (!description || !description.length) {
		return 'Please enter your question';
	}

	if (description.length < DESCRIPTION_MIN_LENGTH) {
		return `Text must be a minimum length of ${DESCRIPTION_MIN_LENGTH}`;
	}

	if (description.length > DESCRIPTION_MAX_LENGTH) {
		return `Text exceeds the maximum length of ${DESCRIPTION_MAX_LENGTH}`;
	}

	return null;
}
