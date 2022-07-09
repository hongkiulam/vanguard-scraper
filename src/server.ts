import cron from "node-cron";
import http from "http";
import config from "./config";

import connect, { Performance } from "./database";
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
  await Performance.create({
    amountChange: amountChange,
    percentageChange: percentageChange,
    value: value,
    date: justDate(new Date()),
  });
});

connect();
const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  const url = req.url;
  try {
    if (url === "/" || url === "/today") {
      const performance = await Performance.findOne(
        {},
        {},
        { sort: { date: -1 } }
      );
      return res.end(JSON.stringify(performance));
    }
    if (url === "/all") {
      const performance = await Performance.find();
      res.end(JSON.stringify(performance));
    }
  } catch (err) {
    const error = err as Error;
    res.end(error.message);
  }
});

server.listen(config.port);
console.log(`Listening on port ${config.port}`);
