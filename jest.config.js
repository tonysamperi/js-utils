module.exports = {
    "transform": {
        ".(ts|tsx)": "ts-jest"
    },
    "testEnvironment": "node",
    "testRegex": "\\.(spec|test)\\.ts$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "/test/"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 75,
            "functions": 90,
            "lines": 90,
            "statements": 90
        }
    },
    "collectCoverageFrom": [
        "src/*.{js,ts}"
    ],
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.test.json"
        }
    }
};
