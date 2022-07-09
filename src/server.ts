import cron from "node-cron";
import http from "http";
import config from "./config";

import connect, { Performance } from "./database";
import { justDate } from "./utils";
import Vanguard from "./vg";

cron.schedule("0 12 * * *", async () => {
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
  try {
    
    const performance = await Performance.find();
    res.setHeader("Content-Type", "application/json; charset=UTF-8");
    res.end(JSON.stringify(performance));
  } catch (err) {
    const error = err as Error;
    res.end(error.message);
  }
});

server.listen(config.port);
console.log(`Listening on port ${config.port}`);
