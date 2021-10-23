module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testMatch: [
        '**/test/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node',
    coverageDirectory: 'reports/',
    coverageReporters: ['html', 'json', 'text-summary', 'lcov'],
    testResultsProcessor: 'jest-sonar-reporter'
}
