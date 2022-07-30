import cron from "node-cron";
import http from "http";
import config from "./config";

import { findAll, findLatest, insertMany, insertOne } from "./database";
import { justDate } from "./utils";
import Vanguard from "./vg";

const getTodayLive = async () => {
  const vg = new Vanguard();
  await vg.login();
  const performance = await vg.performance();
  console.log(
    performance
      .querySelector(".portfolio-header .value")
      ?.textContent?.replace("£", "")
      .replace(",", "")
  );
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
  let attempts = 0;
  try {
    const perform = async () => {
      try {
        const { value, amount_change, percentage_change } =
          await getTodayLive();
        await insertOne({
          amount_change: amount_change,
          percentage_change: percentage_change,
          value: value,
          date: justDate(new Date()),
        });
      } catch (err) {
        attempts++;
        console.log("Tried %d time(s)", attempts);
        if (attempts >= 3) {
          throw err;
        } else {
          await perform();
        }
      }
    };
    await perform();
  } catch (err) {
    const error = err as Error;
    console.log("Error performing cron", error.message);
  }
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
      const result = await insertMany(data);
      return res.end(JSON.stringify(result));
    }

    if (url === "/" || url === "/today") {
      const performance = await findLatest()
      return res.end(JSON.stringify(performance));
    }
    if (url === "/all") {
      const performances = await findAll()
      return res.end(JSON.stringify(performances));
    }
    if (url === "/live") {
      const todaysPerformance = await getTodayLive();
      await insertOne({
        ...todaysPerformance,
        date: justDate(new Date()),
      });
      return res.end(JSON.stringify(todaysPerformance));
    }
  } catch (err) {
    const error = err as Error;
    res.end(error.message);
  }
});

server.listen(config.port);
console.log(`Listening on port ${config.port}`);
