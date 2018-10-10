#!/bin/bash

networks="$@"
if [[ "${networks}x" == "x" ]]; then
  networks=environment
fi

ARTIFACT_OUTPUT_ROOT="$(pwd)/src/contracts" npm explore augur-core -- npm run deploy:net -- ${networks}
