const db = require("../db/connection");

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found!" });
      }
      return { user: data.rows[0] };
    });
};
