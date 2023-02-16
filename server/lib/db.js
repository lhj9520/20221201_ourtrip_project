const mysql = require("mysql2");
const db = mysql.createPoolCluster();

require("dotenv").config();

db.add("project", {
  host: process.env.REACT_APP_MYDB_HOST,
  user: process.env.REACT_APP_MYDB_USER,
  password: process.env.REACT_APP_MYDB_PASSWORD,
  database: process.env.REACT_APP_MYDB,
  port: process.env.REACT_APP_MYDB_PORT,
});

function runDB(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("project", function (error, connection) {
      if (error) {
        console.log("DB Connection Error!", error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log("query error", error);
          reject(true);
        }

        resolve(data);
      });
      connection.release();
    });
  });
}

module.exports.runDB = runDB;
