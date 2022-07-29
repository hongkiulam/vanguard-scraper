import cron from "node-cron";
import http from "http";
import config from "./config";

import db, { insertMany, insertOne } from "./database";
import { justDate } from "./utils";
import Vanguard from "./vg";

cron.schedule("0 5 * * *", async () => {
  const vg = new Vanguard();
  await vg.login();
  const performance = await vg.performance();
  const value = Number(
    performance
      .querySelector(".stat-ended .figure span")
      ?.textContent?.replace("£", "")
      .replace(",", "")
  );
  const amountChange = Number(
    performance
      .querySelector(".stat-row.last .figure span")
      ?.textContent?.replace("£", "")
      .replace(",", "")
  );
  const percentageChange =
    Number(
      performance
        .querySelector(".stat-return .figure")
        ?.textContent?.replace("%", "")
        .replace("-", "")
        .replace("+", "")
        .replace(",", "")
    ) / 100;
  insertOne({
    amount_change: amountChange,
    percentage_change: percentageChange,
    value: value,
    date: justDate(new Date()),
  });
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  const url = req.url;
  const method = req.method
  try {
    if (url === "/" && method === "POST") {      
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const strData = Buffer.concat(buffers).toString();
      const data = JSON.parse(strData)
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
      res.end(JSON.stringify(performances));
    }
  } catch (err) {
    const error = err as Error;
    res.end(error.message);
  }
});

server.listen(config.port);
console.log(`Listening on port ${config.port}`);
