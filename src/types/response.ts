export interface ResponseData {
  success: boolean;
  errorMsg?: string[];
  result?: {
    personalDetails?: PersonalDetails;
    performance?: Performance;
    isaDetails?: ISADetails;
    holdings?: Holdings;
    valuationHistory?: ValuationHistory;
    monthlyPerformance?: MonthlyPerformance;
  };
}
export interface PersonalDetails {
  name: {
    fullName: string;
    title: string;
    given: string;
    family: string;
    middle: string;
  };
  gender: string;
  dateOfBirth: string;
}
export interface ISADetails {
  taxYear: {
    startDate: string;
    endDate: string;
  };
  used: number;
  remaining: number;
  total: number;
}
export interface Performance {
  value: number;
  percentageChange: number;
  amountChange: number;
}
export type Holdings = {
  quantity: number;
  productCode: string;
  productName: string;
  marketValue: number;
  averageCost: number;
  latestUnitCost?: number;
  annualFee?: number;
}[];
export type ValuationHistory = {
  date: string;
  value: number;
}[];

export type MonthlyPerformance = {
  PerformanceDetail: {
    CashTransferIn: number;
    PaymentsIn: number;
    PaymentsOut: number;
    InSpecieTransfersIn: number;
    InSpecieTransfersOut: number;
    OpeningValue: number;
    ClosingValue: number;
    NetGain: number;
    RealisedGain: number;
    UnrealisedGain: number;
    GrossInterest: number;
    NetInterest: number;
    ChangeInAccruedInterest: number;
    GrossDividends: number;
    NetDividends: number;
    NetReturn: number;
    GrossReturn: number;
    Tax: number;
    Charges: number;
    Rebates: number;
  };
  PurchaseWithdrawal: number;
  MarketGainLoss: number;
  IncomeReturns: number;
  PersonalInvestmentReturns: number;
  CumulativeReturns: number;
  Month: string;
  OrderId: number;
}[];
