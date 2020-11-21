import puppeteer from "puppeteer";
// for debugging
export const screenshot = async (page: puppeteer.Page) => {
  await page.screenshot({ path: "image.png", fullPage: true });
};
