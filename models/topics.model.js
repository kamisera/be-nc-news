const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return { topics: data.rows };
  });
};
