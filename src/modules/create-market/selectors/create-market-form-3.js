import {
	TAGS_MAX_NUM, TAGS_MAX_LENGTH,
	RESOURCES_MAX_NUM, RESOURCES_MAX_LENGTH,
	EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from '../../create-market/constants/market-values-constraints';

import { FAILED } from '../../transactions/constants/statuses';

import store from '../../../store';

export default function() {
	var { createMarketInProgress } = store.getState();
	return {
		tagsMaxNum: TAGS_MAX_NUM,
		tagMaxLength: TAGS_MAX_LENGTH,

		resourcesMaxNum: RESOURCES_MAX_NUM,
		resourceMaxLength: RESOURCES_MAX_LENGTH,

		errors: selectStep3ErrorMessages(createMarketInProgress)
	};
};

export const isValidStep3 = function(formState) {
	if (validateExpirySource(formState.expirySource)) {
		return false;
	}

	if (validateExpirySourceUrl(formState.expirySourceUrl, formState.expirySource)) {
		return false;
	}

	return true;
};

export const selectStep3ErrorMessages = function(formState) {
	var errors = {};

	if (formState.expirySource !== undefined) {
		errors.expirySource = validateExpirySource(formState.expirySource);
	}

	if (formState.endDate !== undefined) {
		errors.expirySourceUrl = validateExpirySourceUrl(formState.expirySourceUrl, formState.expirySource);
	}

	return errors;
};

export const validateExpirySource = function(expirySource) {
	if (!expirySource || [EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC].indexOf(expirySource) < 0) {
		return 'Please choose an expiry source';
	}
};

export const validateExpirySourceUrl = function(expirySourceUrl, expirySource) {
	if (expirySource === EXPIRY_SOURCE_SPECIFIC && (!expirySourceUrl || !expirySourceUrl.length)) {
		return 'Please enter the full URL of the website';
	}
};

