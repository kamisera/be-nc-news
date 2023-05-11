const devData = require("../data/development-data/index.js");
const testData = require("../data/test-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");
const ENV = process.env.NODE_ENV;

const runSeed = (data) => {
  return seed(data).then(() => db.end());
};

if (ENV === "test") {
  runSeed(testData);
} else {
  runSeed(devData);
}
