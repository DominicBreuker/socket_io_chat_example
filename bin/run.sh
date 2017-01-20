#!/bin/bash

script="$0"
FOLDER="$(pwd)/$(dirname $script)"

source $FOLDER/utils.sh
PROJECT_ROOT="$(abspath $FOLDER/..)"
echo "project root folder $PROJECT_ROOT"

echo "build docker image"
/bin/bash $FOLDER/build.sh

##### VOLUMES #####

##### RUN #####
echo "Starting container..."

docker run --rm \
           -it \
           -p 8888:8888 \
           dominicbreuker/node_socket_chat_example:latest \
           sh -c "node index.js"
