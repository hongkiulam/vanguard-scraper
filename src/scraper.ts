import { ResponseData } from "./types";
import puppeteer from "puppeteer";
import {
  attemptLogin,
  getIsaDetails,
  getPerformance,
  getPersonalDetails,
} from "./utils/actions";
import {
  ISAVALUE,
  getTextContent,
  RATEOFRETURN,
  PERFORMANCEBUTTON,
  INVESTMENTSRETURNED,
} from "./utils/document";

const scrapeVanguard = async (username: string, password: string) => {
  let data: ResponseData = { success: false };
  data.errorMsg = ["Failed to start session"];
  let browser;
  try {
    console.log("Launch Browser...");
    browser = await puppeteer.launch({});
    console.log("-- Browser Launched");
    const page = await browser.newPage();
    console.log("Goto Vanguard Login...");
    await page.goto("https://secure.vanguardinvestor.co.uk");
    console.log("-- Reached Vanguard Page");

    data.errorMsg = [];
    await attemptLogin(page, username, password);

    console.log("-- Reached Dashboard");
    let personalDetails, performance, isaDetails;
    getPersonalDetails(page)
      .then((response) => (personalDetails = response))
      .catch((e) => data.errorMsg?.push(e.message));
    getPerformance(page)
      .then((response) => (performance = response))
      .catch((e) => data.errorMsg?.push(e.message));
    getIsaDetails(page)
      .then((response) => (isaDetails = response))
      .catch((e) => data.errorMsg?.push(e.message));

    // wait until all requests have been made, and responses returned
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.waitForSelector(ISAVALUE);
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
    data = {
      ...data,
      success: true,
      isaValue,
      rateOfReturn,
      investmentsReturned,
      _experimental: { personalDetails, performance, isaDetails },
    };
    console.log(data);
    await browser.close();
  } catch (e) {
    await browser?.close();
  }
  return data;
};

export default scrapeVanguard;
