const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@tools/(.*)$": "<rootDir>/$1",
    "^@tools-mock/(.*)$": "<rootDir>/tests/mock/$1",
    "^@common/(.*)$": "<rootDir>/../typescript-common/common/$1",
    "^@common-mock/(.*)$": "<rootDir>/../typescript-common/tests/mock/$1",
  }
};