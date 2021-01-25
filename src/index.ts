import puppeteer from "puppeteer";
import express from "express";
import basicAuth from "express-basic-auth";
import cors from "cors";
import { ResponseData } from "./types/response";
import { authorizer } from "./utils/auth";
import { startSession } from "./utils/startSession";
import {
  getHoldings,
  getIsaDetails,
  getMonthlyPerformance,
  getPerformance,
  getPersonalDetails,
  getValuationHistory,
} from "./utils/actions";

const app = express();
app.listen(process.env.PORT || 8080);

app.use(cors());
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
    errorMsg: [],
  };
  const {
    user: username,
    password,
  } = (req as basicAuth.IBasicAuthedRequest).auth;
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
  console.log("Closing Browser...");
  res.send(data);
  console.log("Done");
});

app.get("/authorise", (req, res) => {
  res.sendStatus(200);
});

app.get("/:resource", async (req, res) => {
  let data: ResponseData = {
    success: false,
    errorMsg: [],
  };
  const {
    user: username,
    password,
  } = (req as basicAuth.IBasicAuthedRequest).auth;
  const resource = req.params.resource;
  const actions: {
    [doc: string]: (page: puppeteer.Page, userId: string) => Promise<any>;
  } = {
    personalDetails: getPersonalDetails,
    performance: getPerformance,
    isaDetails: getIsaDetails,
    holdings: getHoldings,
    valuationHistory: getValuationHistory,
    monthlyPerformance: getMonthlyPerformance,
  };

  let b; // browser
  try {
    if (!actions[resource]) {
      const invalidResourceMessage = Object.keys(actions).join(", ");
      throw new Error(`Resource must be one of: ${invalidResourceMessage}`);
    }

    data.errorMsg = ["Failed to start session"];
    const { page, browser, userId } = await startSession(username, password);
    b = browser;
    data.errorMsg = [];

    const response = await actions[resource](page, userId);
    data = {
      ...data,
      success: true,
      result: {
        [resource]: response,
      },
    };
  } catch (e) {
    data.errorMsg?.push(e.message);
  }
  b?.close();
  console.log("Closing Browser...");
  res.send(data);
  console.log("Done");
});
