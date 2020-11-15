import puppeteer from "puppeteer";
import express from "express";
import {
  INVESTMENTSRETURNED,
  ISAVALUE,
  LOGINBUTTON,
  PASSWORDINPUT,
  PERFORMANCEBUTTON,
  RATEOFRETURN,
  USERNAMEINPUT,
} from "./documentSelectors";
require("dotenv").config();

const app = express();
app.listen(process.env.PORT || 3000);

interface ResponseData {
  success: boolean;
  errorMsg?: string;
  isaValue?: string | null;
  rateOfReturn?: string | null;
  investmentsReturned?: string | null;
}

const getTextContent = (el: Element) => {
  return el.textContent;
};

const scrapeVanguard = async (username: string, password: string) => {
  let data: ResponseData = { success: false };
  data.errorMsg = "Failed to start session";
  let browser;
  try {
    console.log("Launch Browser...");
    browser = await puppeteer.launch({});
    console.log("-- Browser Launched");
    const page = await browser.newPage();
    console.log("Goto Vanguard Login...");
    await page.goto("https://secure.vanguardinvestor.co.uk");
    console.log("-- Reached Vanguard Page");

    // * LOGIN
    await page.focus(USERNAMEINPUT);
    await page.keyboard.type(username);
    await page.focus(PASSWORDINPUT);
    await page.keyboard.type(password);
    await page.$eval(LOGINBUTTON, (btn) => (btn as HTMLButtonElement).click());
    console.log("Attempting Login...");
    const loginRequest = await page.waitForResponse(
      "https://secure.vanguardinvestor.co.uk/en-GB/Api/Session/Login/Post"
    );
    const loginResponse: any = await loginRequest.json();
    if (loginResponse?.Result.NavigateTo === null) {
      console.log("-- Failed Login");
      data.errorMsg = "Invalid username or password";
      throw new Error();
    }
    // * NAVIGATE TO DASHBOARD
    data.errorMsg = "Failed to load data";
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.waitForSelector(ISAVALUE);
    console.log("-- Reached Dashboard");
    data.errorMsg = "Failed to get data";
    const isaValue = await page.$eval(ISAVALUE, getTextContent);
    const rateOfReturn = await page.$eval(RATEOFRETURN, (el) => {
      const val = el.textContent;
      const isNegative = el.classList.contains("text-negative");
      return isNegative ? "-" : "+" + val;
    });

    // goto performance page
    await page.$eval(PERFORMANCEBUTTON, (btn) =>
      (btn as HTMLAnchorElement).click()
    );
    await page.waitForSelector(INVESTMENTSRETURNED);
    const investmentsReturned = await page.$eval(
      INVESTMENTSRETURNED,
      getTextContent
    );
    data = { success: true, isaValue, rateOfReturn, investmentsReturned };
    console.log(data);
    await browser.close();
  } catch {
    await browser?.close();
  }
  return data;
};

app.get("/", async (req, res) => {
  let data: ResponseData = {
    success: false,
    errorMsg: "Missing username/ password query parameters",
  };
  const q = req.query;
  if (
    q.username &&
    q.password &&
    typeof q.username === "string" &&
    typeof q.password === "string"
  ) {
    data = await scrapeVanguard(q.username, q.password);
    res.send(data);
  } else {
    res.send(data);
  }
});
