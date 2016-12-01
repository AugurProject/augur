export default function (loginMessageState) {
	if (loginMessageState.userVersionRead == null) {
		return false;
	}

	return loginMessageState.userVersionRead >= loginMessageState.version;
}
