import puppeteer from "puppeteer";
import express from "express";
import basicAuth from "express-basic-auth";
import { ResponseData } from "./types";
import { authorizer } from "./utils/auth";
import { startSession } from "./utils/session";
import {
  getHoldings,
  getIsaDetails,
  getMonthlyPerformance,
  getPerformance,
  getPersonalDetails,
  getValuationHistory,
} from "./utils/actions";
require("dotenv").config();

const app = express();
app.listen(process.env.PORT || 8080);

app.use(
  basicAuth({
    challenge: true,
    authorizeAsync: true,
    authorizer,
  })
);

app.get("/", async (req, res) => {
  let data: ResponseData = {
    success: false,
    errorMsg: ["Basic auth not provided"],
  };
  const {
    user: username,
    password,
  } = (req as basicAuth.IBasicAuthedRequest).auth;
  if (
    username &&
    password &&
    typeof username === "string" &&
    typeof password === "string"
  ) {
    let b; // browser
    try {
      data.errorMsg = ["Failed to start session"];
      const { page, browser, userId } = await startSession(username, password);
      b = browser;
      data.errorMsg = [];
      const personalDetails = await getPersonalDetails(page, userId);
      const performance = await getPerformance(page, userId);
      const isaDetails = await getIsaDetails(page, userId);
      const holdings = await getHoldings(page, userId);
      const valuationHistory = await getValuationHistory(page, userId);
      const monthlyPerformance = await getMonthlyPerformance(page, userId);
      data = {
        ...data,
        success: true,
        result: {
          personalDetails,
          performance,
          isaDetails,
          holdings,
          valuationHistory,
          monthlyPerformance,
        },
      };
    } catch (e) {
      data.errorMsg?.push(e.message);
    }
    b?.close();
    res.send(data);
  } else {
    res.send(data);
  }
  console.log("Done");
});
