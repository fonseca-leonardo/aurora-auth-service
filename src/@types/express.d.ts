interface FormatedJsonOptions {
  success?: boolean;
  token?: string;
  message?: string;
}

declare namespace Express {
  export interface Request {
    authData?: AuthTokenData;
  }

  export interface Response {
    formatedJson(data: any, options?: FormatedJsonOptions): Promise<this>;
  }
}
