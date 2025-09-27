export default {
  transform: {
    "^.+\\.js$": "babel-jest", // Transform all .js files with babel-jest
  },
  testEnvironment: "node", // For Node.js-based tests (e.g., API with supertest)
};
