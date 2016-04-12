export function ListWordsUnderLength(str, maxLength) {
	var currentLength = 0,
		wordsList = [];

	if (!str || !str.length) {
		return wordsList;
	}

	str.toString().split(' ').some(word => {
		word = word.replace(/[^a-zA-Z0-9\-]/ig, '');

		if (!word || !word.length) {
			return false;
		}

		currentLength += word.length;

		if (currentLength <= maxLength) {
			wordsList.push(word);
		}
		else {
			return true;
		}
	});

	return wordsList;
}