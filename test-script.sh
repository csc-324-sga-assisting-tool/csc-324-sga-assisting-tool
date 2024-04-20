#!/bin/sh

export FIRESTORE_EMULATOR_HOST=127.0.0.1:3240

vitest="./node_modules/.bin/vitest"
runWithFirebase="npx --node=21 firebase --project demo emulators:exec --only firestore"

test() {
    echo "Running tests..."
    # Replace this command with your actual test command
     $runWithFirebase "$vitest"
}

coverage() {
    echo "Running tests and generate coverage report"
    # Replace this command with your actual test command
     $runWithFirebase "$vitest run * --coverage"
}

if [ "$1" = "test" ]; then
    test
elif [ "$1" = "coverage" ]; then
    coverage
else
    echo "Usage: $0 [test|coverage]"
    exit 1
fi
