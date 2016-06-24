import {
	TAGS_MAX_NUM, TAGS_MAX_LENGTH,
	RESOURCES_MAX_NUM, RESOURCES_MAX_LENGTH,
	EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC
} from '../../../create-market/constants/market-values-constraints';
import validateExpirySource from '../../../create-market/validators/validate-expiry-source';

export const select = (formState) => {
	const obj = {
		tagsMaxNum: TAGS_MAX_NUM,
		tagMaxLength: TAGS_MAX_LENGTH,
		resourcesMaxNum: RESOURCES_MAX_NUM,
		resourceMaxLength: RESOURCES_MAX_LENGTH
	};
	return obj;
};

export const validateExpirySourceUrl = (expirySourceUrl, expirySource) => {
	if (expirySource === EXPIRY_SOURCE_SPECIFIC &&
	(!expirySourceUrl || !expirySourceUrl.length)) {
		return 'Please enter the full URL of the website';
	}
};

export const isValid = (formState) => {
	if (validateExpirySource(formState.expirySource)) {
		return false;
	}

	if (validateExpirySourceUrl(formState.expirySourceUrl, formState.expirySource)) {
		return false;
	}

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if (formState.expirySource !== undefined) {
		errs.expirySource = validateExpirySource(formState.expirySource);
	}

	if (formState.endDate !== undefined) {
		errs.expirySourceUrl = validateExpirySourceUrl(
			formState.expirySourceUrl,
			formState.expirySource);
	}

	return errs;
};
