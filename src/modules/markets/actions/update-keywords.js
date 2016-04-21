export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

export function updateKeywords(keywords) {
	return { type: UPDATE_KEYWORDS, keywords};
}