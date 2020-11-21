export interface VGResponse<T> {
  Result: T;
}

interface Price {
  Amount: number;
  Currency: number;
}
export interface VGISADetails {
  TaxYear: {
    CountryCode: number;
    EndDate: string; // isostring
    StartDate: string; // isostring
  };
  Used: Price;
  Remaining: Price;
  Total: Price;
}

export interface VGPerformance {
  HierarchyId: string;
  Value: Price;
  PercentageChange: number;
  AmountChange: Price;
}

export interface VGPersonalDetails {
  Name: {
    Title: string;
    Given: string;
    Middle: string;
    Family: string;
    Suffix: string;
    Salutation: string;
  };
  MaritalStatus: number;
  Gender: number;
  GovernmentIdentifiers: object[];
  DateOfBirth: string; // iso string
  Nationality: number;
  TownOfBirth: string;
  Countries: { Type: number; Country: number; TaxNumber: string }[];
  CountryOfResidency: number;
  CustomIdentifiers: {
    ConcatIdentifiers: any[];
    NationalIdentifiers: {
      Country: number;
      ExpirationDate: string;
      Value: string;
    }[];
  };
  Passports: {
    Country: number;
    PassportExpiryDate: string;
    PassportNumber: number;
  }[];
  TaxIdentifiers: {
    Country: number;
    ExpirationDate: string;
    Type: number;
    Value: string;
  }[];
}

export interface VGHoldings {
  Holdings: {
    HierarchyId: string;
    Quantity: number;
    AvailableQuantity: number;
    ProductId: number;
    ProductCode: string;
    MarketValue: Price;
    AverageCost: Price;
  }[];
  InstrumentDetails: {
    ProductId: number;
    LatestPrice: Price;
    LatestPriceDate: Date;
    Name: string;
    RiskLevel: number;
    InstrumentGroups: {
      Id: number;
      Name: string;
    }[];
    AnnualFee: number;
    Type: number;
    ProductCode: string;
  }[];
}

export interface VGValuationHistory {
  Results: {
    Date: string;
    Value: Price;
  }[];
}

export type VGMonthlyPerformance = {
  PerformanceDetail: {
    CashTransferIn: Price;
    PaymentsIn: Price;
    PaymentsOut: Price;
    InSpecieTransfersIn: Price;
    InSpecieTransfersOut: Price;
    OpeningValue: Price;
    ClosingValue: Price;
    NetGain: Price;
    RealisedGain: Price;
    UnrealisedGain: Price;
    GrossInterest: Price;
    NetInterest: Price;
    ChangeInAccruedInterest: Price;
    GrossDividends: Price;
    NetDividends: Price;
    NetReturn: number;
    GrossReturn: number;
    Tax: Price;
    Charges: Price;
    Rebates: Price;
  };
  PurchaseWithdrawal: Price;
  MarketGainLoss: Price;
  IncomeReturns: Price;
  PersonalInvestmentReturns: Price;
  CumulativeReturns: Price;
  Month: string;
  OrderId: number;
}[];
