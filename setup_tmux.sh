#!/usr/bin/env bash
tmux new-session -s augur -d
tmux new-window -t augur

tmux rename-window -t augur server
tmux send-keys -t augur ' yarn flash docker:all' C-m

tmux split-window -v -t server

tmux send-keys -t augur 'yarn build:watch' C-m

tmux split-window -h -t augur
tmux send-keys -t augur 'yarn ui dev' C-m

tmux select-layout tiled

tmux select-window -t augur:1
tmux attach -t augur
