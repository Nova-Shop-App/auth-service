/** @type {import('jest').Config} */
export default {
  collectCoverage: true,
  coverageProvider: "v8",

  projects: [
    {
      displayName: "unit",

      testEnvironment: "node",

      testMatch: ["**/__tests__/units/*.test.js"],

      moduleFileExtensions: ["js", "ts"],

      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
      },

      reporters: [
        "default",
        [
          "jest-junit",
          {
            outputDirectory: "<rootDir>/coverage/junit/unit",
            outputName: "junit.xml",
            usePathForSuiteName: true,
            classNameTemplate: "{classname}",
            titleTemplate: "{title}",
            ancestorSeparator: " > ",
          },
        ],
      ],

      coverageDirectory: "<rootDir>/coverage/unit",

      coverageReporters: [
        "text",
        "lcov",
        "html",
        "json",
        "cobertura",
        "clover",
      ],

      collectCoverageFrom: [
        "src/**/*.js",
        "!src/**/*.test.js",
        "!src/**/*.spec.js",
        "!src/main.js",
        "!src/server.js",
        "!**/node_modules/**",
        "!**/coverage/**",
      ],

      coverageThreshold: {
        global: {
          branches: 15,
          functions: 15,
          lines: 15,
          statements: 15,
        },
      },
    },

    {
      displayName: "integration",

      testEnvironment: "node",

      testMatch: ["**/__tests__/integration/*.test.js"],

      moduleFileExtensions: ["js", "ts"],

      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
      },

      reporters: [
        "default",
        [
          "jest-junit",
          {
            outputDirectory: "<rootDir>/coverage/junit/integration",
            outputName: "junit.xml",
            usePathForSuiteName: true,
            classNameTemplate: "{classname}",
            titleTemplate: "{title}",
            ancestorSeparator: " > ",
          },
        ],
      ],
    },
  ],
};