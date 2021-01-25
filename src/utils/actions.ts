import puppeteer from "puppeteer";
import {
  VGHoldings,
  VGISADetails,
  VGMonthlyPerformance,
  VGPerformance,
  VGPersonalDetails,
  VGResponse,
  VGValuationHistory,
} from "../types/vanguard";
import {
  USERNAMEINPUT,
  PASSWORDINPUT,
  LOGINBUTTON,
  MONTHLYPERFORMANCEBUTTON,
} from "../constants/document";
import paths, { navigate } from "./paths";
import {
  sanitiseHoldings,
  sanitiseIsaDetails,
  sanitisePerformance,
  sanitisePersonalDetails,
  sanitiseValuationHistory,
  santitiseMonthlyPerformance,
} from "./sanitisers";
import requests from "../constants/requests";

export const login = async (
  page: puppeteer.Page,
  username: string,
  password: string
) => {
  try {
    console.log("Input credentials...");
    await page.focus(USERNAMEINPUT);
    await page.keyboard.type(username);
    await page.focus(PASSWORDINPUT);
    await page.keyboard.type(password);
    console.log("Attempting Login...");
    await page.$eval(LOGINBUTTON, (btn) => (btn as HTMLButtonElement).click());
  } catch {
    // this shouldnt happen as we pre-authenticate beforehand
    throw new Error("Failed to login");
  }
};

export const getPersonalDetails = async (
  page: puppeteer.Page,
  userId: string
) => {
  console.log("Scraping Personal Details...");
  await navigate(page, paths(userId).DASHBOARD);
  try {
    const response = await page.waitForResponse((res) =>
      requests.PERSONALDETAILS.test(res.url())
    );
    const personalDetails = (await response.json()) as VGResponse<VGPersonalDetails>;
    return sanitisePersonalDetails(personalDetails.Result);
  } catch {
    throw new Error("Failed to get personal details");
  }
};

export const getPerformance = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Performance...");
  await navigate(page, paths(userId).DASHBOARD);
  try {
    const response = await page.waitForResponse((res) =>
      requests.PERFORMANCE.test(res.url())
    );
    const performance = (await response.json()) as VGResponse<VGPerformance>;
    return sanitisePerformance(performance.Result);
  } catch {
    throw new Error("Failed to get performance");
  }
};

export const getIsaDetails = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping ISA Details...");
  await navigate(page, paths(userId).DASHBOARD);
  try {
    const response = await page.waitForResponse((res) =>
      requests.ISADETAILS.test(res.url())
    );
    const isaDetails = (await response.json()) as VGResponse<VGISADetails>;
    return sanitiseIsaDetails(isaDetails.Result);
  } catch {
    throw new Error("Failed to get ISA Details");
  }
};

export const getHoldings = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Holdings...");
  await navigate(page, paths(userId).HOLDINGS);
  try {
    const response = await page.waitForResponse((res) =>
      requests.HOLDINGS.test(res.url())
    );
    const holdings = (await response.json()) as VGResponse<VGHoldings>;
    return sanitiseHoldings(holdings.Result);
  } catch {
    throw new Error("Failed to get Holdings");
  }
};
export const getValuationHistory = async (
  page: puppeteer.Page,
  userId: string
) => {
  console.log("Scraping Valuation History...");
  await navigate(page, paths(userId).PERSONALS);
  try {
    const response = await page.waitForResponse((res) =>
      requests.VALUATIONHISTORY.test(res.url())
    );
    const valuationHistory = (await response.json()) as VGResponse<VGValuationHistory>;
    return sanitiseValuationHistory(valuationHistory.Result);
  } catch {
    throw new Error("Failed to get Valuation History");
  }
};
export const getMonthlyPerformance = async (
  page: puppeteer.Page,
  userId: string
) => {
  console.log("Scraping Monthly Performance...");
  await navigate(page, paths(userId).PERSONALS);
  await page.$eval(MONTHLYPERFORMANCEBUTTON, (el) =>
    (el as HTMLElement).click()
  );
  try {
    const response = await page.waitForResponse((res) =>
      requests.MONTHLYPERFORMANCE.test(res.url())
    );
    const monthlyPerformance = (await response.json()) as VGResponse<VGMonthlyPerformance>;
    return santitiseMonthlyPerformance(monthlyPerformance.Result);
  } catch {
    throw new Error("Failed to get Monthly Performance");
  }
};
