import cron from "node-cron";
import http from "http";
import config from "./config";

import db, { insertMany, insertOne } from "./database";
import { justDate } from "./utils";
import Vanguard from "./vg";

const getTodayLive = async () => {
  const vg = new Vanguard();
  await vg.login();
  const performance = await vg.performance();
  const value = Number(
    performance
      .querySelector(".portfolio-header .value")
      ?.textContent?.replace("£", "")
      .replace(",", "")
  );
  const amount_change = Number(
    performance
      .querySelector(".stat-row.last .figure span")
      ?.textContent?.replace("£", "")
      .replace(",", "")
  );
  const percentage_change =
    Number(
      performance
        .querySelector(".stat-return .figure")
        ?.textContent?.replace("%", "")
        // .replace("-", "")
        // .replace("+", "")
        .replace(",", "")
    ) / 100;
  const result = { value, amount_change, percentage_change };
  return result;
};

cron.schedule("0 5 * * *", async () => {
  const { value, amount_change, percentage_change } = await getTodayLive();
  insertOne({
    amount_change: amount_change,
    percentage_change: percentage_change,
    value: value,
    date: justDate(new Date()),
  });
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  const url = req.url;
  const method = req.method;
  const authHeader = req.headers.authorization;

  try {
    if (url === "/" && method === "POST") {
      if (!authHeader) {
        res.setHeader("WWW-Authenticate", "Basic");
        res.statusCode = 401;
        return res.end();
      }
      const [username, password] = Buffer.from(
        authHeader.replace("Basic ", ""),
        "base64"
      )
        .toString()
        .split(":");
      if (
        username !== config.basicAuthUser ||
        password !== config.basicAuthPassword
      ) {
        res.statusCode = 401;
        return res.end();
      }
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const strData = Buffer.concat(buffers).toString();
      const data = JSON.parse(strData);
      const result = insertMany(data);
      return res.end(JSON.stringify(result));
    }

    if (url === "/" || url === "/today") {
      const performance = db
        .prepare("select * from performances order by date desc limit 1")
        .get();
      return res.end(JSON.stringify(performance));
    }
    if (url === "/all") {
      const performances = db
        .prepare("select * from performances order by date asc")
        .all();
      return res.end(JSON.stringify(performances));
    }
    if (url === "/live") {
      const todaysPerformance = await getTodayLive();
      return res.end(JSON.stringify(todaysPerformance));
    }
  } catch (err) {
    const error = err as Error;
    res.end(error.message);
  }
});

server.listen(config.port);
console.log(`Listening on port ${config.port}`);
