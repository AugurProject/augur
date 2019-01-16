// The current test system uses .js for tests, but .ts for underlying files
// These .ts files are compiled on the fly, but after the timer starts for test timeout
// Increase timeout to ensure enough time for first ts compilation AND test run
jest.setTimeout(15000);
