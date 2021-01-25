/**
 * More efficient scrapers when we want to just scrape all the data on each page
 * Deprecated in favour of individual requests,
 * as it gives better control over scraped data
 * albeit slower
 */
import puppeteer from "puppeteer";
import {
  getPersonalDetails,
  getPerformance,
  getIsaDetails,
  getHoldings,
  getValuationHistory,
  getMonthlyPerformance,
} from "./actions";
import {
  LOGINBUTTON,
  MONTHLYPERFORMANCEBUTTON,
  PASSWORDINPUT,
  USERNAMEINPUT,
} from "../constants/document";
import paths from "./paths";

export const attemptLogin = async (
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

/**
 * Scrapes Personal Details, Overall Performance, ISA Details
 * @param page
 * @param userId
 */
export const scrapeDashboard = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Dashboard...");
  const [personalDetails, performance, isaDetails] = await Promise.all([
    getPersonalDetails(page, userId),
    getPerformance(page, userId),
    getIsaDetails(page, userId),
    page.goto(paths(userId).DASHBOARD, { waitUntil: "networkidle2" }),
  ]);
  return { personalDetails, performance, isaDetails };
};

/**
 * Scrapes Holdings
 * @param page
 * @param userId
 */
export const scrapeHoldings = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Holdings...");
  const [holdings] = await Promise.all([
    getHoldings(page, userId),
    page.goto(paths(userId).HOLDINGS, { waitUntil: "networkidle2" }),
  ]);
  return { holdings };
};

/**
 * Scrapes Valuation History, Monthly Performance
 * @param page
 * @param userId
 */
export const scrapePersonals = async (page: puppeteer.Page, userId: string) => {
  console.log("Scraping Personals...");
  await page.goto(paths(userId).PERSONALS);
  const valuationHistory = await getValuationHistory(page, userId);
  const [monthlyPerformance] = await Promise.all([
    getMonthlyPerformance(page, userId),
    page.$eval(MONTHLYPERFORMANCEBUTTON, (el) => (el as HTMLElement).click()),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  return { valuationHistory, monthlyPerformance };
};
