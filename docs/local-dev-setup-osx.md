# Setup UI Dev environment on OSX
1. Install docker from [Docker Store](https://store.docker.com/editions/community/docker-ce-desktop-mac)
2. Install [Homebrew](https://brew.sh/)
3. Install [Installation | Yarn](https://yarnpkg.com/en/docs/install)
4. In the same directory
	1. Fork and clone [GitHub - AugurProject/augur: Augur UI](https://github.com/AugurProject/augur)
	2. Clone [GitHub - AugurProject/augur.js: Augur JavaScript API](https://github.com/AugurProject/augur.js)
	3. Clone [GitHub - AugurProject/augur-node: Blockchain --> Database (augur-node) --> Client (UI)](https://github.com/AugurProject/augur-node)
5. Inside the augur ui directory run `UNLOCK_ACCOUNT=true yarn kickoff`
6. The app should load on http://localhost:8080/
