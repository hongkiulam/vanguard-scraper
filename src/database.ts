import Database from "better-sqlite3";
const db = new Database("data.db");
export default db;

const tableExists = db
  .prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='performances';"
  )
  .get();

if (!tableExists) {
  db.prepare(
    `
CREATE TABLE performances (
  id integer primary key autoincrement,
  value decimal(10,2) not null,
  amount_change decimal(10,2) not null,
  percentage_change decimal(10,2) not null,
  date timestamp not null
);`
  ).run();
  db.prepare(
    `
CREATE INDEX date ON performances (date);
`
  ).run();
}

export const insertOne = (performance: Performance) => {
  const stmt = db.prepare(
    "INSERT INTO performances (value, amount_change, percentage_change, date) VALUES (?, ?, ?, ?)"
  );
  stmt.run(
    performance.value,
    performance.amount_change,
    performance.percentage_change,
    performance.date.toISOString()
  );
};

export const insertMany = (performances: Performance[]) => {
  const values = performances
    .reduce((previous, current) => {
      return [
        ...previous,
        `(${current.value}, ${current.amount_change}, ${
          current.percentage_change
        }, '${new Date(current.date).toISOString()}')`,
      ];
    }, [] as string[])
    .join(", ");
  const stmt = db.prepare(
    `INSERT INTO performances (value, amount_change, percentage_change, date) VALUES ${values}`
  );
  return stmt.run();
};

export interface Performance {
  value: number;
  amount_change: number;
  percentage_change: number;
  date: Date;
}
