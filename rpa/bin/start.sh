#!/bin/bash

## Export environment variables for process.env docs:
#  - https://nodejs.org/api/process.html#process_process_env
for file in ../config/env/*.env.sh; do
  # - remove comments and empty lines from file stream before exporting
  # - append export keyword to set as an environment variable
  export $(grep -Ev '^[[:space:]]*$|^\#' <$file)
done

# run the http server
npm start # --exec babel-node
