import mysql from "mysql2";
import config from "./config";
import { jsDateToSQLDate } from "./utils";

const con = mysql.createPool({
  connectionLimit: 1,
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  port: config.mysqlPort,
});

con.on("connection", (connection) => {
  console.log("Connection %d connected", connection.threadId);
});

con.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});

const query = (query: string) => {
  return new Promise<[any, any]>((resolve, reject) => {
    con.query(query, (err: Error, results: any, fields: any) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve([results, fields]);
    });
  });
};
(async () => {
  const results = await query(
    `SELECT * from INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'performances LIMIT 1';`
  );
  if (results[0] === undefined) {
    await query(`
      CREATE TABLE performances (
        id integer primary key auto_increment,
        value decimal(10,2) not null,
        amount_change decimal(10,2) not null,
        percentage_change decimal(10,2) not null,
        date timestamp not null
      );
      `);
    await query(`CREATE INDEX date ON performances (date)`);
  }
})();

export const insertOne = async (performance: Performance) => {
  console.log(performance);
  const [result] = await query(
    `INSERT INTO performances (value, amount_change, percentage_change, date) VALUES (${
      performance.value
    }, ${performance.amount_change}, ${
      performance.percentage_change
    }, '${jsDateToSQLDate(performance.date)}')`
  );
  return result?.message;
};

export const insertMany = async (performances: Performance[]) => {
  const values = performances
    .reduce((previous, current) => {
      return [
        ...previous,
        `(${current.value}, ${current.amount_change}, ${
          current.percentage_change
        }, '${jsDateToSQLDate(new Date(current.date))}')`,
      ];
    }, [] as string[])
    .join(", ");
  const [result] = await query(
    `INSERT INTO performances (value, amount_change, percentage_change, date) VALUES ${values}`
  );
  return result?.message;
};

export const findLatest = async () => {
  const [results] = await query(
    "select * from performances order by date desc limit 1"
  );
  return results[0];
};

export const findAll = async () => {
  const [results] = await query("select * from performances order by date asc");
  return results;
};

export interface Performance {
  value: number;
  amount_change: number;
  percentage_change: number;
  date: Date;
}
