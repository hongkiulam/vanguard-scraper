import puppeteer from "puppeteer";

// (async () => {
//   const browser = await puppeteer.launch({});
//   const page = await browser.newPage();
//   await page.goto("https:/www.google.com");

//   await browser.close();
// })();
import express from 'express';

const app = express();
app.listen(process.env.PORT || 3000);

// app.get('/', async (req,res) => {
//   const browser = await puppeteer.launch({});
//   const page = await browser.newPage();
//   await page.goto('https://secure.vanguardinvestor.co.uk')
//   const login = await page.evaluate(async () => {
//     await page.focus('__GUID_1007');
//     await page.keyboard.type('hongkiulam');
//   })
  
//   await page.screenshot({path: 'image.png'})
//   res.send('hi')
// });
console.log('hi');

(async () => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://secure.vanguardinvestor.co.uk');
  console.log('reached page')
  await page.focus('#__GUID_1007');
  await page.keyboard.type('hongkiulam');
  await page.focus('#__GUID_1008');
  await page.keyboard.type('2HW4dqU63z8MRWpk7XnNemwtgq68UM')
  await page.click('.submit button');

  // await page.waitForNavigation();
  // Get cookies
  // const cookies = await page.cookies();

  // Use cookies in other tab or browser
  // const page2 = await browser.newPage();
  // await page2.setCookie(...cookies);
  // await page2.goto('https://secure.vanguardinvestor.co.uk'); // Opens page as logged user

  await page.screenshot({path: 'image.png'})
  console.log('screenshot')
  await browser.close()
})()
