module.exports = {
  moduleNameMapper: {
    '^.+\\.(css|less|gif)$': './../../styleMock.js'
  },
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["./src/setupTests.js"]
};