import { TAGS_MAX_NUM, TAGS_MAX_LENGTH,	RESOURCES_MAX_NUM, RESOURCES_MAX_LENGTH, EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from '../../../create-market/constants/market-values-constraints';
import validateExpirySource from '../../../create-market/validators/validate-expiry-source';
import validateExpirySourceUrl from '../../../create-market/validators/validate-expiry-source-url';

export const select = (formState) => {
	const obj = {
		tagsMaxNum: TAGS_MAX_NUM,
		tagMaxLength: TAGS_MAX_LENGTH,
		resourcesMaxNum: RESOURCES_MAX_NUM,
		resourceMaxLength: RESOURCES_MAX_LENGTH,
		expirySourceGeneric: EXPIRY_SOURCE_GENERIC,
		expirySourceSpecific: EXPIRY_SOURCE_SPECIFIC
	};
	return obj;
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
