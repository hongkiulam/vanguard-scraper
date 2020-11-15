declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    VANGUARD_USERNAME: string;
    VANGUARD_PASSWORD: string;
  }
}
