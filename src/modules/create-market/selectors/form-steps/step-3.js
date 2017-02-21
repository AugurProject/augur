import { KEYWORDS_MAX_NUM, TAGS_MAX_LENGTH, RESOURCES_MAX_NUM, RESOURCES_MAX_LENGTH, EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/market-values-constraints';
import validateExpirySource from 'modules/create-market/validators/validate-expiry-source';
import validateExpirySourceUrl from 'modules/create-market/validators/validate-expiry-source-url';
import validateTopic from 'modules/create-market/validators/validate-topic';

export const select = (formState) => {
  const obj = {
    keywordsMaxNum: KEYWORDS_MAX_NUM,
    tagMaxLength: TAGS_MAX_LENGTH,
    resourcesMaxNum: RESOURCES_MAX_NUM,
    resourceMaxLength: RESOURCES_MAX_LENGTH,
    expirySourceTypes: {
      generic: EXPIRY_SOURCE_GENERIC,
      specific: EXPIRY_SOURCE_SPECIFIC
    },
    topic: ''
  };
  return obj;
};

export const isValid = (formState) => {
  if (validateExpirySource(formState.expirySource)) return false;
  if (validateExpirySourceUrl(formState.expirySourceUrl, formState.expirySource)) return false;
  if (validateTopic(formState.topic)) return false;

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

  if (formState.topic !== undefined) {
    errs.topic = validateTopic(formState.topic);
  }

  return errs;
};
