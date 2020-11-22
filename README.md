### Vanguard Scraper

A web-scraping based API for a Vanguard Personal Investor Account (UK)

---

#### Usage

##### Installation

- First install project dependencies with `npm install`, then:
  - `npm run dev` to run the app with nodemon which watches for file changes
  - `npm start` to run the app normally (no file watch)
- OR, with `docker-compose` by running `docker-compose up -d` (`-d` for running in the background)

##### Authentication

Authentication to the API occurs via HTTP Basic Authentication, with the same credentials as you would use to login to your personal investor account. Your credentials should be provided with every request.

To authenticate, include an `Authorization` header in your request with a value of `Basic <credentials>`, where _credentials_ is a Base64 encoded string of _username:password_. For example,

```
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
```

##### Resources

_Fetch all available resources (exposed via API)_
`GET /`

```json
{
  "success": true,
  "errorMsg": [],
  "result": {
    "personalDetails": { ... },
    "performance": { ... },
    "isaDetails": { ... },
    "holdings": { ... },
    "valuationHistory": { ... },
    "monthlyPerformance": { ... },
  }
}
```

_Fetch individual resources_
`GET /personalDetails`

```json
{
  "personalDetails": {
    "name": {
      "fullName": "Mr Fred Bloggs",
      "title": "Mr",
      "given": "Fred",
      "family": "Bloggs",
      "middle": null
    },
    "gender": "male",
    "dateOfBirth": "1900-01-01T00:00:00"
  }
}
```

`GET /performance`

```json
{
  "performance": {
    "value": 1000,
    "percentageChange": 0.02,
    "amountChange": 100
  }
}
```

`GET /isaDetails`

```json
{
  "isaDetails": {
    "taxYear": {
      "startDate": "2020-04-06T00:00:00",
      "endDate": "2021-04-05T00:00:00"
    },
    "used": 900,
    "remaining": 19100,
    "total": 20000
  }
}
```

`GET /holdings`

```json
{
  "holdings": [
    {
      "quantity": 1,
      "productCode": "GBPCash",
      "marketValue": 1,
      "averageCost": 1,
      "annualFee": 0,
      "productName": "GBP Cash",
      "latestUnitCost": 1
    },
    {
      "quantity": 10,
      "productCode": "ACDQ.GB",
      "marketValue": 1000,
      "averageCost": 100,
      "annualFee": 0.22,
      "productName": "LifeStrategy",
      "latestUnitCost": 100
    },
    {
      "quantity": 1,
      "productCode": "VUKE.XLON.GB",
      "marketValue": 25,
      "averageCost": 25,
      "annualFee": 0.09,
      "productName": "FTSE 100 UCITS ETF (VUKE)",
      "latestUnitCost": 27.25
    }
  ]
}
```

`GET /valuationHistory`

```json
{
  "valuationHistory": [
    {
      "date": "1900-01-01T00:00:00",
      "value": 1000
    },
    {
      "date": "1900-01-02T00:00:00",
      "value": 1000
    }
    // ...objects representing daily value
  ]
}
```

`GET /monthlyPerformance`

```json
{
  "monthlyPerformance": [
    {
      "PerformanceDetail": {
        "CashTransferIn": 0,
        "PaymentsIn": 1000,
        "PaymentsOut": 0,
        "InSpecieTransfersIn": 0,
        "InSpecieTransfersOut": 0,
        "OpeningValue": 0,
        "ClosingValue": 1000,
        "NetGain": 1,
        "RealisedGain": 0,
        "UnrealisedGain": 1,
        "GrossInterest": 0,
        "NetInterest": 0,
        "ChangeInAccruedInterest": 0,
        "GrossDividends": 0,
        "NetDividends": 0,
        "NetReturn": 0.0001,
        "GrossReturn": 0.0001,
        "Tax": 0,
        "Charges": 0,
        "Rebates": 0
      },
      "PurchaseWithdrawal": 1000,
      "MarketGainLoss": 1,
      "IncomeReturns": 0,
      "PersonalInvestmentReturns": 1,
      "CumulativeReturns": 1,
      "Month": "Jan 1900",
      "OrderId": 0
    }
    // object for each month
  ]
}
```

##### How it works

When a request is sent to the API, we start a [puppeteer](https://github.com/puppeteer/puppeteer) session in the background which navigates to the Vanguard login page. We attempt a login by interacting with the page, filling in the forms using the credentials provided via HTTP Basic Auth.

On successful login, a series of operations are performed to get the required data. This involves navigating to specific pages and receiving JSON responses with puppeteer's `waitForResponse` method.
This should provide a more robust alternative to parsing the content on the page using DOM selectors as those are subject to breaking with any UI changes on the page. Directly accessing the JSON responses from the page should provide more longevity as those are less likely to change.
However, in the case of the `monthlyPerformance` resource, its request is only fired after a specific button click on the page, thus the app would need to be updated in response to UI changes on Vanguard's front-end.

###### dev notes

- [x] ~~will `PercentageChange` property show negative?~~
- [x] docker
- [ ] create a client?
- [x] type all response?
- [x] ~~queries to filter responses~~
- [x] different routes for diffrent response
- [x] sanitisers
- [x] refactor regex requests
