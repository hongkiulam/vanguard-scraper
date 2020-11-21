import {
  Holdings,
  ISADetails,
  MonthlyPerformance,
  Performance,
  PersonalDetails,
  ValuationHistory,
} from "../types/response";
import {
  VGHoldings,
  VGISADetails,
  VGMonthlyPerformance,
  VGPerformance,
  VGPersonalDetails,
  VGValuationHistory,
} from "../types/vanguard";

export const sanitisePersonalDetails = (
  data: VGPersonalDetails
): PersonalDetails => {
  const {
    Name: { Title, Given, Middle, Family },
    Gender,
    DateOfBirth,
  } = data;
  const fullName = `${Title} ${Given}${
    Middle ? " " + Middle + " " : " "
  }${Family}`;
  let gender = "other";
  if (Gender === 0) {
    gender = "female";
  }
  if (Gender === 1) {
    gender = "male";
  }
  return {
    name: {
      fullName,
      title: Title,
      given: Given,
      family: Family,
      middle: Middle,
    },
    gender,
    dateOfBirth: DateOfBirth,
  };
};

export const sanitiseIsaDetails = (data: VGISADetails): ISADetails => {
  const {
    TaxYear: { StartDate, EndDate },
    Used,
    Remaining,
    Total,
  } = data;
  return {
    taxYear: {
      startDate: StartDate,
      endDate: EndDate,
    },
    used: Used.Amount,
    remaining: Remaining.Amount,
    total: Total.Amount,
  };
};
export const sanitisePerformance = (data: VGPerformance): Performance => {
  const { Value, PercentageChange, AmountChange } = data;
  return {
    value: Value.Amount,
    percentageChange: PercentageChange,
    amountChange: AmountChange.Amount,
  };
};
export const sanitiseHoldings = (data: VGHoldings): Holdings => {
  const { Holdings, InstrumentDetails } = data;
  const holdings: Holdings = Holdings.map((h) => {
    const instrumentDetails = InstrumentDetails.find(
      (i) => i.ProductId === h.ProductId
    );
    return {
      quantity: h.Quantity,
      productCode: h.ProductCode,
      marketValue: h.MarketValue.Amount,
      averageCost: h.AverageCost.Amount,
      annualFee: instrumentDetails?.AnnualFee || 0,
      productName: instrumentDetails?.Name || h.ProductCode,
      latestUnitCost: instrumentDetails?.LatestPrice.Amount,
    };
  });
  return holdings;
};
export const sanitiseValuationHistory = (
  data: VGValuationHistory
): ValuationHistory => {
  return data.Results.map((item) => ({
    date: item.Date,
    value: item.Value.Amount,
  }));
};
export const santitiseMonthlyPerformance = (
  data: VGMonthlyPerformance
): MonthlyPerformance => {
  // takes objects like this Property: { Amount: 123, Currency: 1 }
  // maps them to just Property: 123
  const flattenPriceObject = <T>(object: T) => {
    let flattened: any = {};
    Object.entries(object).map(([key, value]) => {
      let amount = value;
      if (typeof value === "object") {
        amount = value.Amount;
      }
      flattened[key] = amount;
    });
    return flattened;
  };

  return data.map((month) => {
    const { PerformanceDetail, ..._rest } = month;
    const performanceDetail = flattenPriceObject(PerformanceDetail);
    const rest = flattenPriceObject(_rest);

    return {
      PerformanceDetail: performanceDetail,
      ...rest,
    };
  });
};
