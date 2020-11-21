### Vanguard Scraper

For Vanguard Personal Investor UK

---

#### logic

- Using Puppeteer, Express
- Uses Basic auth, which sends request to Vanguard login api for real time auth
- Uses puppeteer to create a browser instance, then logs in by interacting with the page
- ~~Use puppeteer to navigate dashboard and scrape text content~~
- use puppeteer wait for response to directly access the json data from vanguard apis

#### notes

- [ ] will `PercentageChange` property show negative?
- [ ] docker
- [ ] create a client
- [x] type all response?Done
- [ ] queries to filter responses
- [ ] different routes for diffrent response
- [x] sanitisers Done
- [x] refactor regex requests DONE
