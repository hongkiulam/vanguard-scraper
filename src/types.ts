export interface ResponseData {
  success: boolean;
  errorMsg?: string[];
  result?: {
    personalDetails?: VGPersonalDetails;
    performance?: VGPerformance;
    isaDetails?: VGISADetails;
    holdings?: any;
    valuationHistory?: any;
    monthlyPerformance?: any;
  };
}

export interface VGResponse<T> {
  Result: T;
}
export interface VGISADetails {
  TaxYear: {
    CountryCode: number;
    EndDate: string; // isostring
    StartDate: string; // isostring
  };
  Used: {
    Amount: number;
    Currency: number;
  };
  Remaining: {
    Amount: number;
    Currency: number;
  };
  Total: {
    Amount: number;
    Currency: number;
  };
}

export interface VGPerformance {
  HierarchyId: string;
  Value: {
    Amount: number;
    Currency: number;
  };
  PercentageChange: number;
  AmountChange: {
    Amount: number;
    Currency: number;
  };
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
