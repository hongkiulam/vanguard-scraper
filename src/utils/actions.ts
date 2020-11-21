import puppeteer from "puppeteer";
import {
  VGISADetails,
  VGPerformance,
  VGPersonalDetails,
  VGResponse,
} from "../types";
import {
  USERNAMEINPUT,
  PASSWORDINPUT,
  LOGINBUTTON,
  MONTHLYPERFORMANCEBUTTON,
} from "./document";
import paths, { navigate } from "./paths";

export const login = async (
  page: puppeteer.Page,
  username: string,
  password: string
) => {
  try {
    await page.focus(USERNAMEINPUT);
    await page.keyboard.type(username);
    await page.focus(PASSWORDINPUT);
    await page.keyboard.type(password);
    await page.$eval(LOGINBUTTON, (btn) => (btn as HTMLButtonElement).click());
    console.log("Attempting Login...");
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
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Customer\/CustomerPersonalDetails\/Get/.test(
        res.url()
      )
    );
    const personalDetails = (await response.json()) as VGResponse<
      VGPersonalDetails
    >;
    return personalDetails.Result;
  } catch {
    throw new Error("Failed to get personal details");
  }
};

export const getPerformance = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Performance...");
  await navigate(page, paths(userId).DASHBOARD);
  try {
    const response = await page.waitForResponse((res) =>
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Performance\/SubaccountPerformance\/Get/.test(
        res.url()
      )
    );
    const performance = (await response.json()) as VGResponse<VGPerformance>;
    return performance.Result;
  } catch {
    throw new Error("Failed to get performance");
  }
};

export const getIsaDetails = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping ISA Details...");
  await navigate(page, paths(userId).DASHBOARD);
  try {
    const response = await page.waitForResponse((res) =>
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Allowance\/IsaAllowance\/Get/.test(
        res.url()
      )
    );
    const isaDetails = (await response.json()) as VGResponse<VGISADetails>;
    return isaDetails.Result;
  } catch {
    throw new Error("Failed to get ISA Details");
  }
};

export const getHoldings = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Holdings...");
  await navigate(page, paths(userId).HOLDINGS);
  try {
    const response = await page.waitForResponse((res) =>
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Holdings\/SubAccountHoldings\/Get/.test(
        res.url()
      )
    );
    const holdings = (await response.json()) as VGResponse<any>;
    return holdings.Result;
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
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Portfolio\/PortfolioValuationHistory\/Get/.test(
        res.url()
      )
    );
    const valuationHistory = (await response.json()) as VGResponse<any>;
    return valuationHistory.Result;
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
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Performance\/InvestmentMonthlyPerformance\/Get/.test(
        res.url()
      )
    );
    const monthlyPerformance = (await response.json()) as VGResponse<any>;
    return monthlyPerformance.Result;
  } catch {
    throw new Error("Failed to get Monthly Performance");
  }
};
