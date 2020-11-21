### Vanguard Scraper

For Vanguard Personal Investor UK

---

#### logic

- Using Puppeteer, Express
- Uses Basic auth, which sends request to Vanguard login api for real time auth
- Uses puppeteer to create a browser instance then input login details to gain access to vanguard investor information
- ~~Use puppeteer to navigate dashboard and scrape text content~~
- use puppeteer wait for response to directly access the json data from vanguard apis

#### notes

- will `PercentageChange` property show negative?, if not then need to scrape from the DOM/ calculate it (might be easier, should be current valuation - invested to date) IGNORE, allow to be calculated client side
- should i dockerise this
- create a client
- type all response?Done
- queries to filter responses
- different routes for diffrent response
- sanitisers Done
- refactor regex requests
